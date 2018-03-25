export interface IToken {
    type: string
    match: string
    val: any
    otherVal: any
    regex: RegExp
}
declare const tokenise: (str: string, tokens?: IToken[]) => IToken[]
export default tokenise
