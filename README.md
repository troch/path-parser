[![npm version](https://badge.fury.io/js/path-parser.svg)](http://badge.fury.io/js/path-parser)
[![Build Status](https://travis-ci.org/troch/path-parser.svg)](https://travis-ci.org/troch/path-parser)

# path-parser

A small library to parse and build paths. It can be used to partially or fully
test paths against a defined pattern.

Partial testing allows to determine if a given path starts with the defined pattern.
It is used by [route-node](https://github.com/troch/route-node)

```javascript
import { Path } from 'path-parser'
// or
const { Path } = require('path-parser')

const path = new Path('/users/:id')

// Matching
path.test('/users/00123')
// {
//  id: "00123"
// }

// Partial testing: does the provided path
// starts with the defined pattern?
path.partialTest('/users/00123/orders')
// {
//  id: "00123"
// }
path.partialTest('/profile/00123/orders')
// null

// Building
path.build({ id: '00123' })
// => "/users/00123"
```

Without `new`:

```javascript
const path = Path.createPath('/users/:id')
```

## Defining parameters

- `:param`: for URL parameters
- `;param`: for matrix parameters
- `*splat`: for parameters spanning over multiple segments. Handle with care
- `?param1&param2` or `?:param1&:param2`: for query parameters. Colons `:` are optional.

#### Parameter constraints

For URL parameters and matrix parameters, you can add a constraint in the form of a regular expression.
Note that back slashes have to be escaped.

- `:param<\\d+>` will match numbers only for parameter `param`
- `;id<[a-fA-F0-9]{8}` will match 8 characters hexadecimal strings for parameter `id`

Constraints are also applied when building paths, unless specified otherwise (set option flag `ignoreConstraints` to true).

```javascript
// Path.build(params, opts)
var Path = new Path('/users/:id<d+>')

path.build({ id: 'not-a-number' }) // => Will throw an error
path.build({ id: '123' }) // => '/users/123'
```

## API

### path.test(path: string, opts?: object): object | null;

Test if the provided path matches the defined path template. Options available are:

- `'caseSensitive'`: whether matching should be case sensitive or not (default to `false`)
- `'strictTrailingSlash'`: whether or not it should strictly match trailing slashes (default to `false`)
- `'queryParams'`: [options for query parameters](https://github.com/troch/search-params#options)

### path.partialTest(path: string, opts?: object): object | null;

Test if the provided path is partially matched (starts with) the defined path template. Options available are:

- `'caseSensitive'`: whether matching should be case sensitive or not (default to `false`)
- `'delimited'`: whether or not a partial match should only be successful if it reaches a delimiter (`/`, `?`, `.` and `;`). Default to `true`.
- `'queryParams'`: [options for query parameters](https://github.com/troch/search-params#options)

### path.build(params?: object, opts?: object): string;

Builds the defined path template with the provided parameters

- `'ignoreConstraints'`: whether or not to ignore parameter constraints (default to `false`)
- `'ignoreSearch'`: whether or not to build query parameters (default to `false`)
- `'caseSensitive'`: whether matching should be case sensitive or not (default to `false`)
- `'queryParams'`: [options for query parameters](https://github.com/troch/search-params#options)

## Related modules

- [route-parser](https://github.com/rcs/route-parser)
- [url-pattern](https://github.com/snd/url-pattern)
