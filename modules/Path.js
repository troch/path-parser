let defaultOrConstrained = (match) => {
    return '(' + (match ? match.replace(/(^<|>$)/g, '') : '[a-zA-Z0-9-_.~]+') + ')'
}

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
        pattern: /^([0-9a-zA-Z]+?)/,
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
                type:     rule.name,
                match:    match[0],
                val:      match.slice(1, 2),
                otherVal: match.slice(2),
                regex:    rule.regex instanceof Function ? rule.regex(match) : rule.regex
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

let optTrailingSlash = (source, trailingSlash) => {
    if (!trailingSlash) return source
    return source.replace(/\\\/$/, '') + '(?:\\/)?'
}

let parseQueryParams = path => {
    let searchPart = path.split('?')[1]
    if (!searchPart) return {}
    return searchPart.split('&')
            .map(_ => _.split('='))
            .reduce((obj, m) => {
                let val = m[1] === undefined ? '' : m[1]
                let existingVal = obj[m[0]]

                if (existingVal === undefined) obj[m[0]] = val
                else obj[m[0]] = Array.isArray(existingVal) ? existingVal.concat(val) : [ existingVal, val ]

                return obj
            }, {})
}

let isSerialisable = val => val !== undefined && val !== null && val !== ''

export default class Path {
    static createPath(path) {
        return new Path(path)
    }

    constructor(path) {
        if (!path) throw new Error('Please supply a path')
        this.path   = path
        this.tokens = tokenise(path)

        this.hasUrlParams = this.tokens.filter(t => /^url-parameter/.test(t.type)).length > 0
        this.hasSpatParam = this.tokens.filter(t => /splat$/.test(t.type)).length > 0
        this.hasMatrixParams = this.tokens.filter(t => /matrix$/.test(t.type)).length > 0
        this.hasQueryParams = this.tokens.filter(t => t.type === 'query-parameter').length > 0
        // Extract named parameters from tokens
        this.urlParams = !this.hasUrlParams ? [] : this.tokens
                            .filter(t => /^url-parameter/.test(t.type))
                            .map(t => t.val.slice(0, 1))
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
        if (!match) return null
        else if (!this.urlParams.length) return {}
        // Reduce named params to key-value pairs
        return match.slice(1, this.urlParams.length + 1)
                .reduce((params, m, i) => {
                    params[this.urlParams[i]] = m
                    return params
                }, {})
    }

    match(path, trailingSlash = 0) {
        // trailingSlash: falsy => non optional, truthy => optional
        let source = optTrailingSlash(this.source, trailingSlash)
        // Check if exact match
        let match = this._urlMatch(path, new RegExp('^' + source + (this.hasQueryParams ? '\\?.*$' : '$')))
        // If no match, or no query params, no need to go further
        if (!match || !this.hasQueryParams) return match
        // Extract query params
        let queryParams = parseQueryParams(path)
        let unexpectedQueryParams = Object.keys(queryParams)
            .filter(p => this.queryParams.indexOf(p) === -1)

        if (unexpectedQueryParams.length === 0) {
            // Extend url match
            Object.keys(queryParams)
                .forEach(p => match[p] = queryParams[p])

            return match
        }

        return null
    }

    partialMatch(path, trailingSlash = 0) {
        // Check if partial match (start of given path matches regex)
        // trailingSlash: falsy => non optional, truthy => optional
        let source = optTrailingSlash(this.source, trailingSlash)
        let match = this._urlMatch(path, new RegExp('^' + source))

        if (!match) return match

        if (!this.hasQueryParams) return match

        let queryParams = parseQueryParams(path)

        Object.keys(queryParams)
            .filter(p => this.queryParams.indexOf(p) >= 0)
            .forEach(p => match[p] = queryParams[p])

        return match
    }

    build(params = {}, opts = {ignoreConstraints: false, ignoreSearch: false}) {
        // Check all params are provided (not search parameters which are optional)
        if (this.urlParams.some(p => params[p] === undefined)) throw new Error('Missing parameters')

        // Check constraints
        if (!opts.ignoreConstraints) {
            let constraintsPassed = this.tokens
                .filter(t => /^url-parameter/.test(t.type) && !/-splat$/.test(t.type))
                .every(t => new RegExp('^' + defaultOrConstrained(t.otherVal[0]) + '$').test(params[t.val]))

            if (!constraintsPassed) throw new Error('Some parameters are of invalid format');
        }

        let base = this.tokens
            .filter(t => t.type !== 'query-parameter')
            .map(t => {
                if (t.type === 'url-parameter-matrix') return `;${t.val[0]}=${params[t.val[0]]}`
                return /^url-parameter/.test(t.type) ? params[t.val[0]] : t.match
            })
            .join('')

        if (opts.ignoreSearch) return base

        let searchPart = this.queryParams
            .filter(p => Object.keys(params).indexOf(p) !== -1)
            .map(p => p + (isSerialisable(params[p]) ? '=' + params[p] : ''))
            .join('&')

        return base + (searchPart ? '?' + searchPart : '')
    }
}
