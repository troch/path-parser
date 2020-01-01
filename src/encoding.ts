/**
 * We encode using encodeURIComponent but we want to
 * preserver certain characters which are commonly used
 * (sub delimiters and ':')
 * 
 * https://www.ietf.org/rfc/rfc3986.txt
 * 
 * reserved    = gen-delims / sub-delims
 * 
 * gen-delims  = ":" / "/" / "?" / "#" / "[" / "]" / "@"
 * 
 * sub-delims  = "!" / "$" / "&" / "'" / "(" / ")"
              / "*" / "+" / "," / ";" / "="
 */

const excludeSubDelimiters = /[^!$'()*+,;|:]/g

export type URLParamsEncodingType = 'default' | 'uri' | 'uriComponent' | 'none'

export const encodeURIComponentExcludingSubDelims = (segment: string): string =>
  segment.replace(excludeSubDelimiters, match => encodeURIComponent(match))

const encodingMethods: Record<
  URLParamsEncodingType,
  (param: string) => string
> = {
  default: encodeURIComponentExcludingSubDelims,
  uri: encodeURI,
  uriComponent: encodeURIComponent,
  none: (val: string) => val
}

const decodingMethods: Record<
  URLParamsEncodingType,
  (param: string) => string
> = {
  default: decodeURIComponent,
  uri: decodeURI,
  uriComponent: decodeURIComponent,
  none: (val: string) => val
}

export const encodeParam = (
  param: string | number | boolean,
  encoding: URLParamsEncodingType,
  isSpatParam: boolean
): string => {
  const encoder =
    encodingMethods[encoding] || encodeURIComponentExcludingSubDelims

  if (isSpatParam) {
    return String(param)
      .split('/')
      .map(encoder)
      .join('/')
  }

  return encoder(String(param))
}

export const decodeParam = (
  param: string,
  encoding: URLParamsEncodingType
): string => (decodingMethods[encoding] || decodeURIComponent)(param)
