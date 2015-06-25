# path-parser

A small utility to parse and build paths.

## Usage

```javascript
var Path = require('path-parser');
// Defining a new path
var p = new Path('/users/profile/:id');
// Matching
p.match("users/profile/00123")               // => {id: "00123"}
p.partialMatch("users/profile/00123/orders") // => {id: "00123"}
p.partialMatch("profile/00123/orders")       // => false
// Building
p.build({id: '00123'})                       // => "users/profile/00123"
```

## Defining parameters

- `:param`: for URL parameters
- `*splat`: for parameters spanning over multiple segments. Handle with care
- `?param1&param2` or `?:param1&:param2`: for query parameters. Colons `:` are optional

## Related modules

- [url-pattern](https://github.com/snd/url-pattern)
- [route-parser](https://github.com/rcs/route-parser)
