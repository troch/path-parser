[![npm version](https://badge.fury.io/js/path-parser.svg)](http://badge.fury.io/js/path-parser)
[![Build Status](https://travis-ci.org/troch/path-parser.svg)](https://travis-ci.org/troch/path-parser)
[![Coverage Status](https://coveralls.io/repos/troch/path-parser/badge.svg?branch=master)](https://coveralls.io/r/troch/path-parser?branch=master)

# path-parser

A small utility to parse and build paths. It can be used to partially or fully
match paths against a defined pattern.

Partial match allows to determine if a given path starts with the defined pattern.
It is used by [route-node](https://github.com/troch/route-node)

## Usage

```javascript
var Path = require('path-parser');
// Defining a new path
var p = new Path('/users/profile/:id');
// Matching
p.match('/users/profile/00123')               // => {id: "00123"}
// Partial matching: does this path
// starts with that pattern?
p.partialMatch('/users/profile/00123/orders') // => {id: "00123"}
p.partialMatch('/profile/00123/orders')       // => false
// Building
p.build({id: '00123'})                       // => "users/profile/00123"
```

## Defining parameters

- `:param`: for URL parameters
- `*splat`: for parameters spanning over multiple segments. Handle with care
- `?param1&param2` or `?:param1&:param2`: for query parameters. Colons `:` are optional

## Related modules

- [route-parser](https://github.com/rcs/route-parser)
- [url-pattern](https://github.com/snd/url-pattern)
