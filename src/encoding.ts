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

const excludeSubDelimiters = /[^!'()*+,;:]/g

export const encodeExcludingSubDelims = (segment: string): string =>
  segment.replace(excludeSubDelimiters, match => encodeURIComponent(match))

export const encodeParam = (
  segment: string | number | boolean,
  isSpatParam: boolean
): string => {
  if (isSpatParam) {
    return String(segment)
      .split('/')
      .map(encodeExcludingSubDelims)
      .join('/')
  }

  return encodeExcludingSubDelims(String(segment))
}
