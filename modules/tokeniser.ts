import rules, { IRule } from './rules'

export interface IToken {
    type: string
    match: string
    val: any
    otherVal: any
    regex: RegExp
}

const tokenise = (str: string, tokens: IToken[] = []): IToken[] => {
    // Look for a matching rule
    const matched = rules.some(rule => {
        const match = str.match(rule.pattern)
        if (!match) {
            return false
        }

        tokens.push({
            type: rule.name,
            match: match[0],
            val: match.slice(1, 2),
            otherVal: match.slice(2),
            regex:
                rule.regex instanceof Function ? rule.regex(match) : rule.regex
        })

        if (match[0].length < str.length) {
            tokens = tokenise(str.substr(match[0].length), tokens)
        }
        return true
    })

    // If no rules matched, throw an error (possible malformed path)
    if (!matched) {
        throw new Error(`Could not parse path '${str}'`)
    }

    return tokens
}

export default tokenise
