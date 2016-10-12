[![npm version](https://badge.fury.io/js/path-parser.svg)](http://badge.fury.io/js/path-parser)
[![Build Status](https://travis-ci.org/troch/path-parser.svg)](https://travis-ci.org/troch/path-parser)
[![Coverage Status](https://coveralls.io/repos/troch/path-parser/badge.svg?branch=master)](https://coveralls.io/r/troch/path-parser?branch=master)

# path-parser

A small utility to parse and build paths. It can be used to partially or fully
test paths against a defined pattern.

Partial testing allows to determine if a given path starts with the defined pattern.
It is used by [route-node](https://github.com/troch/route-node)

## Usage

```javascript
import Path from 'path-parser';
// Defining a new path
const p = new Path('/users/profile/:id');
// Matching
p.test('/users/profile/00123')               // => {id: "00123"}
// Partial testing: does this path
// starts with that pattern?
p.partialTest('/users/profile/00123/orders') // => {id: "00123"}
p.partialTest('/profile/00123/orders')       // => null
// Building
p.build({id: '00123'})                       // => "users/profile/00123"
```

Without `new`:

```javascript
import Path from 'path-parser';

const p = Path.createPath('/users/profile/:id');
```

## Defining parameters

- `:param`: for URL parameters
- `;param`: for matrix parameters
- `*splat`: for parameters spanning over multiple segments. Handle with care
- `?param1&param2` or `?:param1&:param2`: for query parameters. Colons `:` are optional.
- `?param1=a&param1=b` will result in `{param1: ['a', 'b']}`
- `?param1[]=a` and `?param1[]=a&param1[]=b` will result respectively in `{param1: ['a']}` and `{param1: ['a', 'b']}`

## Parameter constraints

For URL parameters and matrix parameters, you can add a constraint in the form of a regular expression.
Note that back slashes have to be escaped.

- `:param<\\d+>` will match numbers only for parameter `param`
- `;id<[a-fA-F0-9]{8}` will match 8 characters hexadecimal strings for parameter `id`

Constraints are also applied when building paths, unless specified otherwise (set option flag `ignoreConstraints` to true).

```javascript
// Path.build(params, opts)
var Path = new Path('/users/profile/:id<\d+>');

path.build({id: 'not-a-number'});       // => Will throw an error
path.build({id: 'not-a-number'}, {ignoreConstraints: true}); // => '/users/profile/not-a-number'
```

## Optional trailing slashes

`.test(path, options)` accepts an option object:
- `trailingSlash`: if truthy, it will make trailing slashes optional (default to `true`).

```javascript
var path = new Path('/my-path');

path.test('/my-path/')       // => null
path.test('/my-path/', { trailingSlash: true }) // => {}
```

## Partial test with delimiters

`.partialTest(path, options)` accepts an option object:
- `delimited`: if truthy, a partial test will only be successful if a delimiter is found at the end of a match (default to `true`, delimiters are `/`, `?`, `.` and `;`).

```javascript
var path = new Path('/my-path');

path.partialTest('/my-path/extended')       // => {}
path.partialTest('/my-path-extended')       // => null
path.partialTest('/my-path-extended', { delimited: false }) // => {}
```

## Related modules

- [route-parser](https://github.com/rcs/route-parser)
- [url-pattern](https://github.com/snd/url-pattern)
