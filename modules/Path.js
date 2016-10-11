import { getSearch, withoutBrackets, parse, toObject } from 'search-params';

const defaultOrConstrained = (match) =>
    '(' + (match ? match.replace(/(^<|>$)/g, '') : '[a-zA-Z0-9-_.~%]+') + ')';

const rules = [
    {
        // An URL can contain a parameter :paramName
        // - and _ are allowed but not in last position
        name:    'url-parameter',
        pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
        regex:   match => new RegExp(defaultOrConstrained(match[2]))
    },
    {
        // Url parameter (splat)
        name: 'url-parameter-splat',
        pattern: /^\*([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
        regex: /([^\?]*)/
    },
    {
        name: 'url-parameter-matrix',
        pattern: /^\;([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
        regex:   match => new RegExp(';' + match[1] + '=' + defaultOrConstrained(match[2]))
    },
    {
        // Query parameter: ?param1&param2
        //                   ?:param1&:param2
        name:    'query-parameter-bracket',
        pattern: /^(?:\?|&)(?:\:)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(?:\[\])/,
        // regex:   match => new RegExp('(?=(\?|.*&)' + match[0] + '(?=(\=|&|$)))')
    },
    {
        // Query parameter: ?param1&param2
        //                   ?:param1&:param2
        name:    'query-parameter',
        pattern: /^(?:\?|&)(?:\:)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
        // regex:   match => new RegExp('(?=(\?|.*&)' + match[0] + '(?=(\=|&|$)))')
    },
    {
        // Delimiter /
        name:    'delimiter',
        pattern: /^(\/|\?)/,
        regex:   match => new RegExp('\\' + match[0])
    },
    {
        // Sub delimiters
        name:    'sub-delimiter',
        pattern: /^(\!|\&|\-|_|\.|;)/,
        regex:   match => new RegExp(match[0])
    },
    {
        // Unmatched fragment (until delimiter is found)
        name:    'fragment',
        pattern: /^([0-9a-zA-Z]+)/,
        regex:   match => new RegExp(match[0])
    }
];

const exists = (val) => val !== undefined && val !== null;

const tokenise = (str, tokens = []) => {
    // Look for a matching rule
    const matched =
        rules.some(rule => {
            let match = str.match(rule.pattern);
            if (!match) return false;

            tokens.push({
                type:     rule.name,
                match:    match[0],
                val:      match.slice(1, 2),
                otherVal: match.slice(2),
                regex:    rule.regex instanceof Function ? rule.regex(match) : rule.regex
            });

            if (match[0].length < str.length) tokens = tokenise(str.substr(match[0].length), tokens);
            return true;
        });

    // If no rules matched, throw an error (possible malformed path)
    if (!matched) {
        throw new Error('Could not parse path.');
    }
    // Return tokens
    return tokens;
};

const optTrailingSlash = (source, trailingSlash) => {
    if (!trailingSlash) return source;
    return source.replace(/\\\/$/, '') + '(?:\\/)?';
};

const appendQueryParam = (params, param, val = '') => {
    if (/\[\]$/.test(param)) {
        param = withoutBrackets(param);
        val = [ val ];
    }
    const existingVal = params[param];

    if (existingVal === undefined) params[param] = val;
    else params[param] = Array.isArray(existingVal) ? existingVal.concat(val) : [ existingVal, val ];

    return params;
};

const parseQueryParams = path => {
    let searchPart = getSearch(path);
    if (!searchPart) return {};

    return toObject(parse(searchPart));
};

function serialise(key, val) {
    if (Array.isArray(val)) {
        return val.map(v => serialise(key, v)).join('&');
    }

    if (val === true) {
        return key;
    }

    return `${key}=${val}`;
}

export default class Path {
    static createPath(path) {
        return new Path(path);
    }

    static serialise(key, val) {
        return serialise(key, val);
    }

    constructor(path) {
        if (!path) throw new Error('Please supply a path');
        this.path   = path;
        this.tokens = tokenise(path);

        this.hasUrlParams = this.tokens.filter(t => /^url-parameter/.test(t.type)).length > 0;
        this.hasSpatParam = this.tokens.filter(t => /splat$/.test(t.type)).length > 0;
        this.hasMatrixParams = this.tokens.filter(t => /matrix$/.test(t.type)).length > 0;
        this.hasQueryParams = this.tokens.filter(t => /^query-parameter/.test(t.type)).length > 0;
        // Extract named parameters from tokens
        this.urlParams = !this.hasUrlParams ? [] : this.tokens
                            .filter(t => /^url-parameter/.test(t.type))
                            .map(t => t.val.slice(0, 1))
                            // Flatten
                            .reduce((r, v) => r.concat(v));
        // Query params
        this.queryParams = !this.hasQueryParams ? [] : this.tokens
                            .filter(t => t.type === 'query-parameter')
                            .map(t => t.val)
                            .reduce((r, v) => r.concat(v), []);

        this.queryParamsBr = !this.hasQueryParams ? [] : this.tokens
                            .filter(t => /-bracket$/.test(t.type))
                            .map(t => t.val)
                            .reduce((r, v) => r.concat(v), []);

        this.params = this.urlParams.concat(this.queryParams).concat(this.queryParamsBr);
        // Check if hasQueryParams
        // Regular expressions for url part only (full and partial match)
        this.source = this.tokens
                        .filter(t => t.regex !== undefined)
                        .map(r => r.regex.source)
                        .join('');
    }

    _urlMatch(path, regex) {
        let match = path.match(regex);
        if (!match) return null;
        else if (!this.urlParams.length) return {};
        // Reduce named params to key-value pairs
        return match.slice(1, this.urlParams.length + 1)
                .reduce((params, m, i) => {
                    params[this.urlParams[i]] = decodeURIComponent(m);
                    return params;
                }, {});
    }

    match(path, trailingSlash = 0) {
        // trailingSlash: falsy => non optional, truthy => optional
        const source = optTrailingSlash(this.source, trailingSlash);
        // Check if exact match
        const matched = this._urlMatch(path, new RegExp('^' + source + (this.hasQueryParams ? '(\\?.*$|$)' : '$')));
        // If no match, or no query params, no need to go further
        if (!matched || !this.hasQueryParams) return matched;
        // Extract query params
        let queryParams = parseQueryParams(path);
        let unexpectedQueryParams = Object.keys(queryParams)
            .filter(p => this.queryParams.concat(this.queryParamsBr).indexOf(p) === -1 );

        if (unexpectedQueryParams.length === 0) {
            // Extend url match
            Object.keys(queryParams)
                .forEach(p => matched[p] = queryParams[p]);

            return matched;
        }

        return null;
    }

    partialMatch(path, trailingSlash = 0) {
        // Check if partial match (start of given path matches regex)
        // trailingSlash: falsy => non optional, truthy => optional
        let source = optTrailingSlash(this.source, trailingSlash);
        let match = this._urlMatch(path, new RegExp('^' + source));

        if (!match) return match;

        if (!this.hasQueryParams) return match;

        let queryParams = parseQueryParams(path);

        Object.keys(queryParams)
            .filter(p => this.queryParams.concat(this.queryParamsBr).indexOf(p) >= 0)
            .forEach(p => appendQueryParam(match, p, queryParams[p]));

        return match;
    }

    build(params = {}, opts = {ignoreConstraints: false, ignoreSearch: false}) {
        const encodedParams = Object.keys(params).reduce(
            (acc, key) => {
                // Use encodeURI in case of spats
                if (!exists(params[key])) {
                    return acc;
                }

                const val = params[key];

                if (typeof val === 'boolean') {
                    acc[key] = val;
                } else if (Array.isArray(val)) {
                    acc[key] = val.map(encodeURI);
                } else {
                    acc[key] = encodeURI(val);
                }

                return acc;
            },
            {}
        );

        // Check all params are provided (not search parameters which are optional)
        if (this.urlParams.some(p => !exists(encodedParams[p]))) throw new Error('Missing parameters');

        // Check constraints
        if (!opts.ignoreConstraints) {
            let constraintsPassed = this.tokens
                .filter(t => /^url-parameter/.test(t.type) && !/-splat$/.test(t.type))
                .every(t => new RegExp('^' + defaultOrConstrained(t.otherVal[0]) + '$').test(encodedParams[t.val]));

            if (!constraintsPassed) throw new Error('Some parameters are of invalid format');
        }

        let base = this.tokens
            .filter(t => /^query-parameter/.test(t.type) === false)
            .map(t => {
                if (t.type === 'url-parameter-matrix') return `;${t.val}=${encodedParams[t.val[0]]}`;
                return /^url-parameter/.test(t.type) ? encodedParams[t.val[0]] : t.match;
            })
            .join('');

        if (opts.ignoreSearch) return base;

        const queryParams = this.queryParams.concat(this.queryParamsBr.map(p => p + '[]'));

        const searchPart = queryParams
            .filter(p => Object.keys(encodedParams).indexOf(withoutBrackets(p)) !== -1)
            .map(p => serialise(p, encodedParams[withoutBrackets(p)]))
            .join('&');

        return base + (searchPart ? '?' + searchPart : '');
    }
}
