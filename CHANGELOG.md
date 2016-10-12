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



