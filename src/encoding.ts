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

export type URLParamsEncodingType =
  | 'default'
  | 'uri'
  | 'uriComponent'
  | 'none'
  | 'legacy'

export const encodeURIComponentExcludingSubDelims = (
  segment: string
): string => {
  // Define sub-delimiters to exclude from encoding
  const subDelimiters = /[!$'()*+,;|:]/g

  // Use Array.from to correctly handle characters represented by surrogate pairs
  return Array.from(segment)
    .map(char => {
      // Check if the character is a sub-delimiter
      if (subDelimiters.test(char)) {
        return char // Return the character as is if it's a sub-delimiter
      } else {
        return encodeURIComponent(char) // Otherwise, encode it
      }
    })
    .join('') // Join the array back into a string
}

const encodingMethods: Record<
  URLParamsEncodingType,
  (param: string) => string
> = {
  default: encodeURIComponentExcludingSubDelims,
  uri: encodeURI,
  uriComponent: encodeURIComponent,
  none: val => val,
  legacy: encodeURI
}

const decodingMethods: Record<
  URLParamsEncodingType,
  (param: string) => string
> = {
  default: decodeURIComponent,
  uri: decodeURI,
  uriComponent: decodeURIComponent,
  none: val => val,
  legacy: decodeURIComponent
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
