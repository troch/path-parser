'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var rules = [{
    name: 'parameter',
    pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
    regex: /([a-zA-Z0-9-_.~]+)/
}, {
    name: 'delimiter',
    pattern: /^\//,
    regex: /\//
}, {
    name: 'sub-delimiter',
    pattern: /^(\!|\&|\?|\*|\'|,|;|\-|_)/,
    regex: function regex(match) {
        return new RegExp(match[0]);
    }
}, {
    name: 'fragment',
    pattern: /^(.*?)(?=\/|\:|\?|\#|$)/,
    regex: function regex(match) {
        return new RegExp(match[0]);
    }
}];

var tokenise = function tokenise(str) {
    var tokens = arguments[1] === undefined ? [] : arguments[1];

    // Look for a matching rule
    var matched = rules.some(function (rule) {
        var match = str.match(rule.pattern);
        if (!match) return false;

        tokens.push({
            type: rule.name,
            match: match[0],
            val: match.length > 1 ? match.slice(1) : null,
            regex: rule.regex instanceof Function ? rule.regex(match) : rule.regex
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

var Path = (function () {
    function Path(path) {
        _classCallCheck(this, Path);

        if (!path) throw new Error('Please supply a path');
        this.path = path;
        this.tokens = tokenise(path);
        // Regular expressions for full match and partial match
        this.source = this.tokens.map(function (r) {
            return r.regex.source;
        }).join('');
        // Extract name parameters from tokens
        this.params = this.tokens.filter(function (t) {
            return t.type === 'parameter';
        }).map(function (t) {
            return t.val;
        }).reduce(function (r, v) {
            return r.concat(v);
        });
    }

    _createClass(Path, [{
        key: '_match',
        value: function _match(path, regex) {
            var _this = this;

            var match = path.match(regex);
            if (!match) return false;else if (!this.params) return true;
            // Reduce named params to key-value pairs
            return match.slice(1, this.params.length + 1).reduce(function (params, m, i) {
                params[_this.params[i]] = m;
                return params;
            }, {});
        }
    }, {
        key: 'match',
        value: function match(path) {
            // Check if exact match
            return this._match(path, new RegExp('^' + this.source + '$'));
        }
    }, {
        key: 'partialMatch',
        value: function partialMatch(path) {
            // Check if partial match (start of given path matches regex)
            return this._match(path, new RegExp('^' + this.source));
        }
    }, {
        key: 'build',
        value: function build() {
            var params = arguments[0] === undefined ? {} : arguments[0];

            // Check all params are provided
            if (!this.params.every(function (p) {
                return params[p] !== undefined;
            })) throw new Error('Missing parameters');

            return this.tokens.map(function (t) {
                return t.type === 'parameter' ? params[t.val[0]] : t.match;
            }).join('');
        }
    }]);

    return Path;
})();

exports['default'] = Path;
module.exports = exports['default'];

