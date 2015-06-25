const rules = [
    {
        // An URL can contain a parameter :paramName
        // - and _ are allowed but not in last position
        name:    'url-parameter',
        pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
        regex:   /([a-zA-Z0-9-_.~]+)/
    },
    {
        // Url parameter (splat)
        name: 'url-parameter-splat',
        pattern: /^\*([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
        regex: /([^\?]*)/
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
        pattern: /^(\/|\?|#)/,
        regex:   match => new RegExp(match[0])
    },
    {
        // Sub delimiters
        name:    'sub-delimiter',
        pattern: /^(\!|\&|,|;|\-|_)/,
        regex:   match => new RegExp(match[0])
    },
    {
        // Unmatched fragment (until delimiter is found)
        name:    'fragment',
        pattern: /^(.*?)(?=\/|\?|\#|$)/,
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

        this.hasUrlParams = this.tokens.filter(t => /url-parameter/.test(t.type)).length > 0
        this.hasSpatParam = this.tokens.filter(t => /splat/.test(t.type)).length > 0
        this.hasQueryParams = this.tokens.filter(t => t.type === 'query-parameter').length > 0
        // Extract named parameters from tokens
        this.urlParams = !this.hasUrlParams ? [] : this.tokens
                            .filter(t => /url-parameter/.test(t.type))
                            .map(t => t.val)
                            // Flatten
                            .reduce((r, v) => r.concat(v))
        // Query params
        this.queryParams = !this.hasQueryParams ? [] : this.tokens
                            .filter(t => t.type === 'query-parameter')
                            .map(t => t.val)
                            // Flatten
                            .reduce((r, v) => r.concat(v))
        this.params = this.urlParams.concat(this.queryParams)
        // Check if hasQueryParams
        // Regular expressions for url part only (full and partial match)
        this.source = this.tokens
                        .filter(t => t.regex !== undefined)
                        .map(r => r.regex.source)
                        .join('')
    }

    _urlMatch(path, regex) {
        let match = path.match(regex)
        if (!match) return false
        else if (!this.urlParams.length) return {}
        // Reduce named params to key-value pairs
        return match.slice(1, this.urlParams.length + 1)
                .reduce((params, m, i) => {
                    params[this.urlParams[i]] = m
                    return params
                }, {})
    }

    match(path) {
        // Check if exact match
        let match = this._urlMatch(path, new RegExp('^' + this.source + (this.hasQueryParams ? '\?.*$' : '$')))
        // If no match, or no query params, no need to go further
        if (!match || !this.hasQueryParams) return match
        // Extract query params
        let queryParams = path.split('?')[1].split('&')
            .map(_ => _.split('='))
            .reduce((obj, m) => {
                obj[m[0]] = m[1]
                return obj
            }, {})

        if (Object.keys(queryParams).every(p => this.queryParams.indexOf(p) !== 1)
            && Object.keys(queryParams).length === this.queryParams.length) {
            // Extend url match
            Object.keys(queryParams)
                .forEach(p => match[p] = queryParams[p])

            return match
        }

        return false
    }

    partialMatch(path) {
        // Check if partial match (start of given path matches regex)
        return this._urlMatch(path, new RegExp('^' + this.source))
    }

    build(params = {}) {
        // Check all params are provided (not search parameters which are optional)
        if (!this.params.every(p => params[p] !== undefined)) throw new Error('Missing parameters')

        let base = this.tokens
            .filter(t => t.type !== 'query-parameter')
            .map(t => t.type === 'url-parameter' ? params[t.val[0]] : t.match)
            .join('')

        let searchPart = this.queryParams
            .map(p => p + '=' + params[p])
            .join('&')

        return base + (searchPart ? '?' + searchPart : '')
    }
}
