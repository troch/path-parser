import { IOptions } from 'search-params';
import { IToken } from './tokeniser';
export interface IPartialTestOptions {
    caseSensitive?: boolean;
    delimited?: boolean;
    queryParams?: IOptions;
}
export interface ITestOptions {
    caseSensitive?: boolean;
    strictTrailingSlash?: boolean;
    optionalQueryParams?: boolean;
    queryParams?: IOptions;
}
export interface IBuildOptions {
    ignoreConstraints?: boolean;
    ignoreSearch?: boolean;
    queryParams?: IOptions;
}
export declare type TestMatch = object | null;
export declare class Path {
    static createPath(path: any): Path;
    path: string;
    tokens: IToken[];
    hasUrlParams: boolean;
    hasSpatParam: boolean;
    hasMatrixParams: boolean;
    hasQueryParams: boolean;
    spatParams: string[];
    urlParams: string[];
    queryParams: string[];
    params: string[];
    source: string;
    constructor(path: any);
    isQueryParam(name: string): boolean;
    test(path: string, opts?: ITestOptions): TestMatch;
    partialTest(path: string, opts?: IPartialTestOptions): TestMatch;
    build(params?: object, opts?: IBuildOptions): string;
    private getParams(type);
    private urlTest(path, source, {caseSensitive}?);
}
export default Path;
