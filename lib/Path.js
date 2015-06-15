const rules = [
    {
        name:    'parameter',
        pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
        regex:   /([a-zA-Z0-9-_.~]+)/
    },
    {
        name:    'delimiter',
        pattern: /^\//,
        regex:   /\//
    },
    {
        name:    'sub-delimiter',
        pattern: /^(\!|\&|\?|\*|\'|,|;|\-|_)/,
        regex:   match => new RegExp(match[0])
    },
    {
        name:    'fragment',
        pattern: /^(.*?)(?=\/|\:|\?|\#|$)/,
        regex:   match => new RegExp(match[0])
    }
]

let tokenise = (str, tokens = []) => {
    // Look for a matching rule
    let matched =
        rules.some(rule => {
            let match = str.match(rule.pattern)
            if (!match) return false

            tokens.push({
                type:   rule.name,
                match:  match[0],
                val:    match.length > 1 ? match.slice(1) : null,
                regex:  rule.regex instanceof Function ? rule.regex(match) : rule.regex
            })

            if (match[0].length < str.length) tokens = tokenise(str.substr(match[0].length), tokens)
            return true
        })
    // If no rules matched, throw an error (possible malformed path)
    if (!matched) {
        throw new Error('Could not parse path.')
    }
    // Return tokens
    return tokens
}

export default class Path {
    constructor(path) {
        if (!path) throw new Error('Please supply a path')
        this.path   = path
        this.tokens = tokenise(path)
        // Regular expressions for full match and partial match
        this.source = this.tokens.map(r => r.regex.source).join('')
        // Extract name parameters from tokens
        this.params = this.tokens
                        .filter(t => t.type === 'parameter')
                        .map(t => t.val)
                        .reduce((r, v) => r.concat(v))
    }

    _match(path, regex) {
        let match = path.match(regex)
        if (!match) return false
        else if (!this.params) return true
        // Reduce named params to key-value pairs
        return match.slice(1, this.params.length + 1)
                .reduce((params, m, i) => {
                    params[this.params[i]] = m
                    return params
                }, {});
    }

    match(path) {
        // Check if exact match
        return this._match(path, new RegExp('^' + this.source + '$'))
    }

    partialMatch(path) {
        // Check if partial match (start of given path matches regex)
        return this._match(path, new RegExp('^' + this.source))
    }

    build(params = {}) {
        // Check all params are provided
        if (!this.params.every(p => params[p] !== undefined)) throw new Error('Missing parameters')

        return this.tokens.map(t => t.type === 'parameter' ? params[t.val[0]] : t.match).join('')
    }
}
