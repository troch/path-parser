const rules = {
    parameter:    /^:([a-zA-Z0-9-_]+)/,
    delimiter:    /^\//,
    // subDelimiter:
    fragment:     /^(.*?)(?=\/|:)/
}

let tokenise = (str, tokens = []) => {
    Object.keys(rules)
        .some(rule => {
            let match = str.match(rules[rule])
            if (!match) return false

            tokens.push({
                type:   rule,
                match:  match[0],
                val:    match.slice(1)
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
}
