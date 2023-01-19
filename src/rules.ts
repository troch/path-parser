export const defaultOrConstrained = (match: string): string =>
  '(' +
  (match ? match.replace(/(^<|>$)/g, '') : "[a-zA-Z0-9-_.~%':|=+\\*@$]+") +
  ')'

export type RegExpFactory = (match: any) => RegExp

export interface IRule {
  /* The name of the rule */
  name: string
  /* The regular expression used to find a token in a path definition */
  pattern: RegExp
  /* The derived regular expression to match a path */
  regex?: RegExp | RegExpFactory
}

const rules: IRule[] = [
  {
    name: 'url-parameter',
    pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
    regex: (match: RegExpMatchArray) =>
      new RegExp(defaultOrConstrained(match[2]))
  },
  {
    name: 'url-parameter-splat',
    pattern: /^\*([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
    regex: /([^?]*)/
  },
  {
    name: 'url-parameter-matrix',
    pattern: /^;([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
    regex: (match: RegExpMatchArray) =>
      new RegExp(';' + match[1] + '=' + defaultOrConstrained(match[2]))
  },
  {
    name: 'query-parameter',
    pattern: /^(?:\?|&)(?::)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(?:=([a-zA-Z0-9-_]+))?/
  },
  {
    name: 'delimiter',
    pattern: /^(\/|\?)/,
    regex: (match: RegExpMatchArray) => new RegExp('\\' + match[0])
  },
  {
    name: 'sub-delimiter',
    pattern: /^(!|&|-|_|\.|;)/,
    regex: (match: RegExpMatchArray) => new RegExp(match[0])
  },
  {
    name: 'fragment',
    pattern: /^([0-9a-zA-Z]+)/,
    regex: (match: RegExpMatchArray) => new RegExp(match[0])
  }
]

export default rules
