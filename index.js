'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var rules = [{
    name: 'parameter',
    pattern: /^:([a-zA-Z0-9-_]+)/
}, {
    name: 'delimiter',
    pattern: /^\//
}, {
    name: 'fragment',
    pattern: /^(.*?)(?=\/|:)/
}];

var tokenise = function tokenise(str) {
    var tokens = arguments[1] === undefined ? [] : arguments[1];

    rules.some(function (rule) {
        var match = str.match(rule.pattern);
        if (!match) return false;

        tokens.push({
            type: rule.name,
            match: match[0],
            val: match.length > 1 ? match.slice(1) : null
        });

        tokenise(str.substr(match[0].length), tokens);
        return true;
    });

    return tokens;
};

var Path = (function () {
    function Path(path) {
        _classCallCheck(this, Path);

        if (!path) throw new Error('Please supply a path');
        this.path = path;
        this.tokens = tokenise(path);
    }

    _createClass(Path, [{
        key: 'match',
        value: function match() {}
    }, {
        key: 'build',
        value: function build() {
            var params = arguments[0] === undefined ? {} : arguments[0];
        }
    }]);

    return Path;
})();

exports['default'] = Path;
module.exports = exports['default'];
// regex:   /a/
// regex:   /\//
// regex:   /\//

