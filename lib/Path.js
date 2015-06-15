const rules = [
    {
        name:    'parameter',
        pattern: /^:([a-zA-Z0-9-_]+)/,
        // regex:   /a/
    },
    {
        name:    'delimiter',
        pattern: /^\//,
        // regex:   /\//
    },
    {
        name:    'fragment',
        pattern: /^(.*?)(?=\/|:)/,
        // regex:   /\//
    }
]

let tokenise = (str, tokens = []) => {
    rules.some(rule => {
            let match = str.match(rule.pattern)
            if (!match) return false

            tokens.push({
                type:   rule.name,
                match:  match[0],
                val:    match.length > 1 ? match.slice(1) : null
            })

            tokenise(str.substr(match[0].length), tokens)
            return true
        })

    return tokens
}

export default class Path {
    constructor(path) {
        if (!path) throw new Error('Please supply a path')
        this.path = path
        this.tokens = tokenise(path)
    }

    match() {

    }

    build(params = {}) {

    }
}
