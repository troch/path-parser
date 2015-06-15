'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var rules = {
    parameter: /^:([a-zA-Z0-9-_]+)/,
    delimiter: /^\//,
    // subDelimiter:
    fragment: /^(.*?)(?=\/|:)/
};

var tokenise = function tokenise(str) {
    var tokens = arguments[1] === undefined ? [] : arguments[1];

    Object.keys(rules).some(function (rule) {
        var match = str.match(rules[rule]);
        if (!match) return false;

        tokens.push({
            type: rule,
            match: match[0],
            val: match.slice(1)
        });

        tokenise(str.substr(match[0].length), tokens);
        return true;
    });

    return tokens;
};

var Path = function Path(path) {
    _classCallCheck(this, Path);

    if (!path) throw new Error('Please supply a path');
    this.path = path;
    this.tokens = tokenise(path);
};

exports['default'] = Path;
module.exports = exports['default'];

