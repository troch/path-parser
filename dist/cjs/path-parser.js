'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var searchParams = require('search-params');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

var defaultOrConstrained = function (match) {
    return '(' + (match ? match.replace(/(^<|>$)/g, '') : "[a-zA-Z0-9-_.~%':]+") + ')';
};
var rules = [
    {
        name: 'url-parameter',
        pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
        regex: function (match) {
            return new RegExp(defaultOrConstrained(match[2]));
        }
    },
    {
        name: 'url-parameter-splat',
        pattern: /^\*([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
        regex: /([^?]*)/
    },
    {
        name: 'url-parameter-matrix',
        pattern: /^;([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
        regex: function (match) {
            return new RegExp(';' + match[1] + '=' + defaultOrConstrained(match[2]));
        }
    },
    {
        name: 'query-parameter',
        pattern: /^(?:\?|&)(?::)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/
    },
    {
        name: 'delimiter',
        pattern: /^(\/|\?)/,
        regex: function (match) { return new RegExp('\\' + match[0]); }
    },
    {
        name: 'sub-delimiter',
        pattern: /^(!|&|-|_|\.|;)/,
        regex: function (match) { return new RegExp(match[0]); }
    },
    {
        name: 'fragment',
        pattern: /^([0-9a-zA-Z]+)/,
        regex: function (match) { return new RegExp(match[0]); }
    }
];

var tokenise = function (str, tokens) {
    if (tokens === void 0) { tokens = []; }
    // Look for a matching rule
    var matched = rules.some(function (rule) {
        var match = str.match(rule.pattern);
        if (!match) {
            return false;
        }
        tokens.push({
            type: rule.name,
            match: match[0],
            val: match.slice(1, 2),
            otherVal: match.slice(2),
            regex: rule.regex instanceof Function ? rule.regex(match) : rule.regex
        });
        if (match[0].length < str.length) {
            tokens = tokenise(str.substr(match[0].length), tokens);
        }
        return true;
    });
    // If no rules matched, throw an error (possible malformed path)
    if (!matched) {
        throw new Error("Could not parse path '" + str + "'");
    }
    return tokens;
};

var identity = function (_) { return _; };
var exists = function (val) { return val !== undefined && val !== null; };
var optTrailingSlash = function (source, strictTrailingSlash) {
    if (strictTrailingSlash) {
        return source;
    }
    if (source === '\\/') {
        return source;
    }
    return source.replace(/\\\/$/, '') + '(?:\\/)?';
};
var upToDelimiter = function (source, delimiter) {
    if (!delimiter) {
        return source;
    }
    return /(\/)$/.test(source) ? source : source + '(\\/|\\?|\\.|;|$)';
};
var appendQueryParam = function (params, param, val) {
    if (val === void 0) { val = ''; }
    var existingVal = params[param];
    if (existingVal === undefined) {
        params[param] = val;
    }
    else {
        params[param] = Array.isArray(existingVal)
            ? existingVal.concat(val)
            : [existingVal, val];
    }
    return params;
};
var Path = /** @class */ (function () {
    function Path(path) {
        if (!path) {
            throw new Error('Missing path in Path constructor');
        }
        this.path = path;
        this.tokens = tokenise(path);
        this.hasUrlParams =
            this.tokens.filter(function (t) { return /^url-parameter/.test(t.type); }).length > 0;
        this.hasSpatParam =
            this.tokens.filter(function (t) { return /splat$/.test(t.type); }).length > 0;
        this.hasMatrixParams =
            this.tokens.filter(function (t) { return /matrix$/.test(t.type); }).length > 0;
        this.hasQueryParams =
            this.tokens.filter(function (t) { return /^query-parameter/.test(t.type); }).length > 0;
        // Extract named parameters from tokens
        this.spatParams = this.getParams('url-parameter-splat');
        this.urlParams = this.getParams(/^url-parameter/);
        // Query params
        this.queryParams = this.getParams('query-parameter');
        // All params
        this.params = this.urlParams.concat(this.queryParams);
        // Check if hasQueryParams
        // Regular expressions for url part only (full and partial match)
        this.source = this.tokens
            .filter(function (t) { return t.regex !== undefined; })
            .map(function (r) { return r.regex.source; })
            .join('');
    }
    Path.createPath = function (path) {
        return new Path(path);
    };
    Path.prototype.isQueryParam = function (name) {
        return this.queryParams.indexOf(name) !== -1;
    };
    Path.prototype.test = function (path, opts) {
        var _this = this;
        var options = __assign({ strictTrailingSlash: false, queryParams: {} }, opts);
        // trailingSlash: falsy => non optional, truthy => optional
        var source = optTrailingSlash(this.source, options.strictTrailingSlash);
        // Check if exact match
        var match = this.urlTest(path, source + (this.hasQueryParams ? '(\\?.*$|$)' : '$'), opts);
        // If no match, or no query params, no need to go further
        if (!match || !this.hasQueryParams) {
            return match;
        }
        // Extract query params
        var queryParams = searchParams.parse(path, options.queryParams);
        var unexpectedQueryParams = Object.keys(queryParams).filter(function (p) { return !_this.isQueryParam(p); });
        if (unexpectedQueryParams.length === 0) {
            // Extend url match
            Object.keys(queryParams).forEach(function (p) { return (match[p] = queryParams[p]); });
            return match;
        }
        return null;
    };
    Path.prototype.partialTest = function (path, opts) {
        var _this = this;
        var options = __assign({ delimited: true, queryParams: {} }, opts);
        // Check if partial match (start of given path matches regex)
        // trailingSlash: falsy => non optional, truthy => optional
        var source = upToDelimiter(this.source, options.delimited);
        var match = this.urlTest(path, source, options);
        if (!match) {
            return match;
        }
        if (!this.hasQueryParams) {
            return match;
        }
        var queryParams = searchParams.parse(path, options.queryParams);
        Object.keys(queryParams)
            .filter(function (p) { return _this.isQueryParam(p); })
            .forEach(function (p) { return appendQueryParam(match, p, queryParams[p]); });
        return match;
    };
    Path.prototype.build = function (params, opts) {
        var _this = this;
        if (params === void 0) { params = {}; }
        var options = __assign({ ignoreConstraints: false, ignoreSearch: false, queryParams: {} }, opts);
        var encodedUrlParams = Object.keys(params)
            .filter(function (p) { return !_this.isQueryParam(p); })
            .reduce(function (acc, key) {
            if (!exists(params[key])) {
                return acc;
            }
            var val = params[key];
            var encode = _this.isQueryParam(key) ? identity : encodeURI;
            if (typeof val === 'boolean') {
                acc[key] = val;
            }
            else if (Array.isArray(val)) {
                acc[key] = val.map(encode);
            }
            else {
                acc[key] = encode(val);
            }
            return acc;
        }, {});
        // Check all params are provided (not search parameters which are optional)
        if (this.urlParams.some(function (p) { return !exists(params[p]); })) {
            var missingParameters = this.urlParams.filter(function (p) { return !exists(params[p]); });
            throw new Error("Cannot build path: '" +
                this.path +
                "' requires missing parameters { " +
                missingParameters.join(', ') +
                ' }');
        }
        // Check constraints
        if (!options.ignoreConstraints) {
            var constraintsPassed = this.tokens
                .filter(function (t) {
                return /^url-parameter/.test(t.type) && !/-splat$/.test(t.type);
            })
                .every(function (t) {
                return new RegExp('^' + defaultOrConstrained(t.otherVal[0]) + '$').test(encodedUrlParams[t.val]);
            });
            if (!constraintsPassed) {
                throw new Error("Some parameters of '" + this.path + "' are of invalid format");
            }
        }
        var base = this.tokens
            .filter(function (t) { return /^query-parameter/.test(t.type) === false; })
            .map(function (t) {
            if (t.type === 'url-parameter-matrix') {
                return ";" + t.val + "=" + encodedUrlParams[t.val[0]];
            }
            return /^url-parameter/.test(t.type)
                ? encodedUrlParams[t.val[0]]
                : t.match;
        })
            .join('');
        if (options.ignoreSearch) {
            return base;
        }
        var searchParams$$1 = this.queryParams
            .filter(function (p) { return Object.keys(params).indexOf(p) !== -1; })
            .reduce(function (sparams, paramName) {
            sparams[paramName] = params[paramName];
            return sparams;
        }, {});
        var searchPart = searchParams.build(searchParams$$1, options.queryParams);
        return searchPart ? base + '?' + searchPart : base;
    };
    Path.prototype.getParams = function (type) {
        var predicate = type instanceof RegExp
            ? function (t) { return type.test(t.type); }
            : function (t) { return t.type === type; };
        return this.tokens.filter(predicate).map(function (t) { return t.val[0]; });
    };
    Path.prototype.urlTest = function (path, source, _a) {
        var _this = this;
        var _b = (_a === void 0 ? {} : _a).caseSensitive, caseSensitive = _b === void 0 ? false : _b;
        var regex = new RegExp('^' + source, caseSensitive ? '' : 'i');
        var match = path.match(regex);
        if (!match) {
            return null;
        }
        else if (!this.urlParams.length) {
            return {};
        }
        // Reduce named params to key-value pairs
        return match
            .slice(1, this.urlParams.length + 1)
            .reduce(function (params, m, i) {
            params[_this.urlParams[i]] = decodeURIComponent(m);
            return params;
        }, {});
    };
    return Path;
}());

exports.Path = Path;
exports.default = Path;
