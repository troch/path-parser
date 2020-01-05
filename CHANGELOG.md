# [6.0.0](https://github.com/troch/path-parser/compare/v5.1.0...v6.0.0) (2020-01-05)


### Features

* add option `urlParamsEncoding` for specifying encoding and decoding of URL params ([#46](https://github.com/troch/path-parser/issues/46)) ([eb8d728](https://github.com/troch/path-parser/commit/eb8d728f99afe5fe6fa1eee45562813a16dcf118))

### BREAKING CHANGES

* `queryParams` options from `build`, `test` and `partialTest` has been moved to `Path` constructor
* The new `urlParamsEncoding` option changes the default encoding and decoding. See the README for available encoding and decoding methods.
* Option interfaces have been renamed (`PathTestOptions`, `PathBuildOptions`, `PathPartialTestOptions`)



# [5.1.0](https://github.com/troch/path-parser/compare/v5.0.1...v5.1.0) (2019-12-30)


### Features

* add generic type to `Path` ([#45](https://github.com/troch/path-parser/issues/45)) ([33eaed2](https://github.com/troch/path-parser/commit/33eaed2857fb4bd5b28dd504231af23f0b9ba547))
* Update `search-params` to latest version

### Bug Fixes

* Fix missing dependency `tslib`


## [5.0.1](https://github.com/troch/path-parser/compare/v5.0.0...v5.0.1) (2019-12-29)


### Bug Fixes

* Revert encoding fix ([c43c07e](https://github.com/troch/path-parser/commit/c43c07e1d89d9c324a84683be55d1634445f2a21))

Note: not all cases were accounted for and the benefits of this fix is currently unclear.



# [5.0.0](https://github.com/troch/path-parser/compare/v4.2.0...v5.0.0) (2019-12-29)


### Bug Fixes

* use encodeURIComponent to encode URL params ([#43](https://github.com/troch/path-parser/issues/43)) ([946d256](https://github.com/troch/path-parser/commit/946d2563a3cabe3b22fc14c679045ef8a8519821))


### Maintenance

* upgrade all dev dependencies ([#42](https://github.com/troch/path-parser/issues/42)) ([b294b17](https://github.com/troch/path-parser/commit/b294b17fdadd37db399469c10920eb1850652fd8))


### BREAKING CHANGES

* default export has been removed, now `Path` is only available as a named export.

<a name="4.2.0"></a>
# [4.2.0](https://github.com/troch/path-parser/compare/v4.1.1...v4.2.0) (2018-07-11)


### Features

* allow star as a param value ([14bb91c](https://github.com/troch/path-parser/commit/14bb91c))
* allow @ characters in path params ([d773d8e](https://github.com/troch/path-parser/commit/d773d8e))



<a name="4.1.1"></a>
## [4.1.1](https://github.com/troch/path-parser/compare/v4.1.0...v4.1.1) (2018-06-05)


### Bug Fixes

* update search-params to decode unicode values when parsing ([f0c4396](https://github.com/troch/path-parser/commit/f0c4396))



<a name="4.1.0"></a>
# [4.1.0](https://github.com/troch/path-parser/compare/v4.0.5...v4.1.0) (2018-05-14)


### Features

* support  sign in parameters ([adc36b0](https://github.com/troch/path-parser/commit/adc36b0))



<a name="4.0.5"></a>
## [4.0.5](https://github.com/troch/path-parser/compare/v4.0.4...v4.0.5) (2018-05-14)


### Bug Fixes

* allow equal signs in parameters (commonly found at the end of base 64 encoded strings) ([5c98fb6](https://github.com/troch/path-parser/commit/5c98fb6))



<a name="4.0.4"></a>
## [4.0.4](https://github.com/troch/path-parser/compare/v4.0.3...v4.0.4) (2018-04-09)


### Bug Fixes

* match pipe characters in parameters (Firefox) ([d6e6d27](https://github.com/troch/path-parser/commit/d6e6d27))



<a name="4.0.3"></a>
## [4.0.3](https://github.com/troch/path-parser/compare/v4.0.2...v4.0.3) (2018-04-03)


### Bug Fixes

* properly link types ([b7473e9](https://github.com/troch/path-parser/commit/b7473e9))



<a name="4.0.2"></a>
## [4.0.2](https://github.com/troch/path-parser/compare/v4.0.1...v4.0.2) (2018-03-27)



<a name="4.0.1"></a>
## [4.0.1](https://github.com/troch/path-parser/compare/v4.0.0...v4.0.1) (2018-03-26)


### Bug Fixes

* fix matching with strictTrailingSlash option ([353ecc0](https://github.com/troch/path-parser/commit/353ecc0))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/troch/path-parser/compare/v3.0.1...v4.0.0) (2018-03-25)


### Features

* make matching case insensitive, add support for 'caseSentive' option ([063aca6](https://github.com/troch/path-parser/commit/063aca6))


### BREAKING CHANGES

* query parameters can no longer be defined with brackets, instead options are available when matching and building to describe how arrays, booleans and null values are formatted (see 'queryParams' options in README).
* Boolean and null values in query parameters are stringified differently, see the list of options available. To keep behaviour unchanged, set `nullFormat` to `'hidden'` and `booleanFormat` to `'empty-true'`.
* 'trailingSlash' option has been renamed to 'strictTrailingSlash'
* 'test' and 'partialTest' are now case insensitive by default, use 'caseSensitive' option to make it case sensitive



<a name="3.0.1"></a>
## [3.0.1](https://github.com/troch/path-parser/compare/v3.0.0...v3.0.1) (2017-11-16)



<a name="3.0.0"></a>
# [3.0.0](https://github.com/troch/path-parser/compare/v2.1.0...v3.0.0) (2017-11-16)


### BREAKING CHANGES

* amd and umd builds are no longer provided



<a name="2.1.0"></a>
# [2.1.0](https://github.com/troch/path-parser/compare/v2.0.2...v2.1.0) (2017-11-08)


### Features

* improve other error messages ([bf5bea5](https://github.com/troch/path-parser/commit/bf5bea5))
* provide more details in "Missing parameters" error [router5/router5[#208](https://github.com/troch/path-parser/issues/208)] ([b562e5c](https://github.com/troch/path-parser/commit/b562e5c))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/troch/path-parser/compare/v2.0.1...v2.0.2) (2016-11-01)


### Bug Fixes

* add possibility to use ' and : characters in path. ([2f445e7](https://github.com/troch/path-parser/commit/2f445e7))
* use properly encodeURI and encodeURIComponent ([1270364](https://github.com/troch/path-parser/commit/1270364))



<a name="2.0.1"></a>
## [2.0.1](https://github.com/troch/path-parser/compare/v2.0.0...v2.0.1) (2016-10-13)


### Bug Fixes

* don't partially match '' against '/' ([eeb378e](https://github.com/troch/path-parser/commit/eeb378e))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/troch/path-parser/compare/v1.0.4...v2.0.0) (2016-10-12)


### Features

* add a 'delimited' option to partialMatch ([969c1bf](https://github.com/troch/path-parser/commit/969c1bf))
* add search-params as a dependency ([6ab04d7](https://github.com/troch/path-parser/commit/6ab04d7))


### BREAKING CHANGES

* `.match()` renamed to `.test()` and now takes an options object as a second parameter
* `.partialMatch()` renamed to `.partialTest()` and now takes an options object as a second parameter. Option `delimited` is by default true, meaning a partial will be successful if the partially matched path is consumed up to a delimiter (`?`, `/`, `.`, `;`)


<a name="1.0.4"></a>
## [1.0.4](https://github.com/troch/path-parser/compare/v1.0.3...v1.0.4) (2016-06-30)


### Bug Fixes

* encode all parameters and not only query parameters ([19d5131](https://github.com/troch/path-parser/commit/19d5131))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/troch/path-parser/compare/v1.0.2...v1.0.3) (2016-06-29)


### Bug Fixes

* allow encoded URI components in URL parameters ([ae1ad85](https://github.com/troch/path-parser/commit/ae1ad85)), closes [router5/router5#63](https://github.com/router5/router5/issues/63)



<a name="1.0.2"></a>
## [1.0.2](https://github.com/troch/path-parser/compare/v1.0.1...v1.0.2) (2016-01-06)


### Bug Fixes

* improve full path matching of a path with query params ([ada3897](https://github.com/troch/path-parser/commit/ada3897))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/troch/path-parser/compare/v1.0.0...v1.0.1) (2016-01-05)




<a name="1.0.0"></a>
# [1.0.0](https://github.com/troch/path-parser/compare/v0.5.0...v1.0.0) (2016-01-05)




<a name="0.5.0"></a>
# [0.5.0](https://github.com/troch/path-parser/compare/v0.4.4...v0.5.0) (2015-12-08)


### Features

* add support for query parameters with brackets ([658d491](https://github.com/troch/path-parser/commit/658d491))



<a name="0.4.4"></a>
## [0.4.4](https://github.com/troch/path-parser/compare/v0.4.3...v0.4.4) (2015-11-24)


### Bug Fixes

* encode and decode query parameters special characters ([5c69712](https://github.com/troch/path-parser/commit/5c69712))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/troch/path-parser/compare/v0.4.2...v0.4.3) (2015-10-11)




<a name="0.4.2"></a>
## [0.4.2](https://github.com/troch/path-parser/compare/v0.4.1...v0.4.2) (2015-10-07)


### Bug Fixes

* format multiple query parameters with same key as array when matching partially ([d7f57f0](https://github.com/troch/path-parser/commit/d7f57f0))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/troch/path-parser/compare/v0.4.0...v0.4.1) (2015-10-07)


### Features

* build paths with query parameters as arrays ([9e0f644](https://github.com/troch/path-parser/commit/9e0f644))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/troch/path-parser/compare/v0.3.2...v0.4.0) (2015-10-07)


### Features

* add Path.createPath constructor shortcut ([a45b781](https://github.com/troch/path-parser/commit/a45b781)), closes [#2](https://github.com/troch/path-parser/issues/2)
* store multiple query parameters with the same key in an array ([3efd958](https://github.com/troch/path-parser/commit/3efd958)), closes [#3](https://github.com/troch/path-parser/issues/3)



<a name="0.3.2"></a>
## [0.3.2](https://github.com/troch/path-parser/compare/v0.3.1...v0.3.2) (2015-09-04)


### Bug Fixes

* make query parameters optional when matching and match them on partial match ([303b240](https://github.com/troch/path-parser/commit/303b240))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/troch/path-parser/compare/v0.3.0...v0.3.1) (2015-09-04)


### Bug Fixes

* better building and matching of query params ([5e8f881](https://github.com/troch/path-parser/commit/5e8f881))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/troch/path-parser/compare/v0.2.4...v0.3.0) (2015-09-03)


### Bug Fixes

* build a path without all query parameters ([208fd8a](https://github.com/troch/path-parser/commit/208fd8a))

### Features

* build paths without search part ([c9973be](https://github.com/troch/path-parser/commit/c9973be))


### BREAKING CHANGES

* .build() now takes an options object as a second parameter

Issue router5/router5#19



<a name="0.2.4"></a>
## [0.2.4](https://github.com/troch/path-parser/compare/v0.2.3...v0.2.4) (2015-09-01)


### Features

* allow optional trailing slash for '/' ([570a0c4](https://github.com/troch/path-parser/commit/570a0c4))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/troch/path-parser/compare/v0.2.2...v0.2.3) (2015-08-20)


### Bug Fixes

* better escape regular expression special chars so built source matches regexp so ([21d30b7](https://github.com/troch/path-parser/commit/21d30b7))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/troch/path-parser/compare/v0.2.1...v0.2.2) (2015-08-19)


### Bug Fixes

* escape special characters properly in regular expressions ([f573957](https://github.com/troch/path-parser/commit/f573957))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/troch/path-parser/compare/v0.2.0...v0.2.1) (2015-08-19)


### Bug Fixes

* don't apply optional trailing slashes on paths === / ([36e0180](https://github.com/troch/path-parser/commit/36e0180))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/troch/path-parser/compare/v0.1.1...v0.2.0) (2015-08-19)


### Features

* support optional trailing slashes ([6785886](https://github.com/troch/path-parser/commit/6785886))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/troch/path-parser/compare/v0.1.0...v0.1.1) (2015-07-22)




<a name="0.1.0"></a>
# [0.1.0](https://github.com/troch/path-parser/compare/v0.0.7...v0.1.0) (2015-07-06)


### Features

* add matrix and url parameter constraints ([a567ba1](https://github.com/troch/path-parser/commit/a567ba1))



<a name="0.0.7"></a>
## [0.0.7](https://github.com/troch/path-parser/compare/v0.0.6...v0.0.7) (2015-07-01)


### Features

* support matrix parameters ([0451290](https://github.com/troch/path-parser/commit/0451290))



<a name="0.0.6"></a>
## [0.0.6](https://github.com/troch/path-parser/compare/v0.0.5...v0.0.6) (2015-06-30)




<a name="0.0.5"></a>
## [0.0.5](https://github.com/troch/path-parser/compare/v0.0.4...v0.0.5) (2015-06-30)




<a name="0.0.4"></a>
## [0.0.4](https://github.com/troch/path-parser/compare/v0.0.3...v0.0.4) (2015-06-28)


### Bug Fixes

* fix bug when multiple query params ([880bae0](https://github.com/troch/path-parser/commit/880bae0))

### Features

* improve tokenisation and tests ([5b9e1fe](https://github.com/troch/path-parser/commit/5b9e1fe))



<a name="0.0.3"></a>
## [0.0.3](https://github.com/troch/path-parser/compare/v0.0.2...v0.0.3) (2015-06-26)


### Bug Fixes

* fix path building with splats ([7bd7d74](https://github.com/troch/path-parser/commit/7bd7d74))



<a name="0.0.2"></a>
## [0.0.2](https://github.com/troch/path-parser/compare/v0.0.1...v0.0.2) (2015-06-25)


### Features

* add splat support with query params ([96bcd6d](https://github.com/troch/path-parser/commit/96bcd6d))



<a name="0.0.1"></a>
## [0.0.1](https://github.com/troch/path-parser/compare/4ee86cf...v0.0.1) (2015-06-25)


### Features

* add spat param flag ([b77174a](https://github.com/troch/path-parser/commit/b77174a))
* add support for query parameters ([4ee86cf](https://github.com/troch/path-parser/commit/4ee86cf))
* add support for splats ([e346bbf](https://github.com/troch/path-parser/commit/e346bbf))



