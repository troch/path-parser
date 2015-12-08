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
p.partialMatch('/profile/00123/orders')       // => null
// Building
p.build({id: '00123'})                       // => "users/profile/00123"
```

Without `new`:

```javascript
var Path = require('path-parser');

var p = Path.createPath('/users/profile/:id');
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

When using `.match()` or `.partialMatch()`, you can path a second argument. If truthy, it will make trailing slashes optional.

```javascript
var path = new Path('/my-path');

path.match('/my-path/')       // => null
path.match('/my-path/', true) // => {}
```

## Related modules

- [route-parser](https://github.com/rcs/route-parser)
- [url-pattern](https://github.com/snd/url-pattern)
