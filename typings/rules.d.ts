export declare const defaultOrConstrained: (match: string) => string
export declare type RegExpFactory = (match: any) => RegExp
export interface IRule {
    name: string
    pattern: RegExp
    regex?: RegExp | RegExpFactory
}
declare const rules: IRule[]
export default rules
