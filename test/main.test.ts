import { Path } from '../src'

describe('Path', () => {
  it('should throw an error when instanciated without parameter', () => {
    expect(() => {
      new Path('')
    }).toThrow()
  })

  it('should throw an error if Path is used like a function', () => {
    expect(() => {
      // @ts-ignore
      Path()
    }).toThrow()
  })

  it('should throw an error if a path cannot be tokenised', () => {
    expect(() => {
      new Path('/!#')
    }).toThrow()
  })

  it('should return a path if createPath is used', () => {
    expect(Path.createPath('/users')).toBeDefined()
  })

  it('should match and build paths with url parameters', () => {
    const path = new Path('/users/profile/:id-:id2.html')
    // Successful match & partial match
    expect(path.test('/users/profile/123-abc.html')).toEqual({
      id: '123',
      id2: 'abc'
    })
    expect(path.partialTest('/users/profile/123-abc.html?what')).toEqual({
      id: '123',
      id2: 'abc'
    })
    // Unsuccessful match
    expect(path.test('/users/details/123-abc')).toBeNull()
    expect(path.test('/users/details/123-abc.html')).toBeNull()
    expect(path.test('/users/profile/123-abc.html?what')).toBeNull()

    expect(path.build({ id: '123', id2: 'abc' })).toBe(
      '/users/profile/123-abc.html'
    )
    expect(() => {
      path.build({ id: '123' })
    }).toThrow(
      "Cannot build path: '/users/profile/:id-:id2.html' requires missing parameters { id2 }"
    )
  })

  it('should match and build paths with emojis in query parameters', () => {
    const pathA = new Path('/home?emoji')

    expect(pathA.build({ emoji: '🤗' })).toEqual('/home?emoji=%F0%9F%A4%97')

    const path = new Path('/home?emoji')
    expect(path.test('/home?emoji=%F0%9F%99%8C')).toEqual({
      emoji: '🙌'
    })
  })

  it('should match and build paths with query parameters', () => {
    const path = new Path('/users?offset&limit', {
      queryParams: { booleanFormat: 'string' }
    })
    // Successful match & partial match
    expect(path.test('/users?offset=31&limit=15')).toEqual({
      offset: '31',
      limit: '15'
    })
    expect(path.test('/users?offset=31&offset=30&limit=15')).toEqual({
      offset: ['31', '30'],
      limit: '15'
    })
    expect(path.test('/users?offset=1&limit=15')).toEqual({
      offset: '1',
      limit: '15'
    })
    expect(path.test('/users?limit=15')).toEqual({ limit: '15' })
    expect(path.test('/users?limit=15')).toEqual({ limit: '15' })
    expect(path.partialTest('/users?offset=true&limits=1')).toEqual({
      offset: true
    })
    expect(path.partialTest('/users?offset=1&offset=2%202&limits=1')).toEqual({
      offset: ['1', '2 2']
    })
    expect(path.partialTest('/users')).toEqual({})

    // Unsuccessful match
    expect(path.test('/users?offset=31&order=asc')).toBeNull()
    expect(path.test('/users?offset=31&limit=10&order=asc')).toBeNull()

    expect(path.build({ offset: 31, limit: '15 15' })).toBe(
      '/users?offset=31&limit=15%2015'
    )
    expect(path.build({ offset: 31 })).toBe('/users?offset=31')
    expect(path.build({ offset: 31, limit: '' })).toBe(
      '/users?offset=31&limit='
    )
    expect(path.build({ offset: 31, limit: undefined })).toBe(
      '/users?offset=31'
    )
    expect(path.build({ offset: 31, limit: false })).toBe(
      '/users?offset=31&limit=false'
    )
    expect(path.build({ offset: 31, limit: true })).toBe(
      '/users?offset=31&limit=true'
    )
    expect(path.build({ offset: [31, 30], limit: false })).toBe(
      '/users?offset=31&offset=30&limit=false'
    )
    expect(path.build({ offset: 31, limit: 15 }, { ignoreSearch: true })).toBe(
      '/users'
    )
  })

  it('should match and build paths of query parameters with square brackets', () => {
    const path = new Path('/users?offset&limit', {
      queryParams: { arrayFormat: 'brackets' }
    })
    expect(path.build({ offset: 31, limit: ['15'] })).toBe(
      '/users?offset=31&limit[]=15'
    )
    expect(path.build({ offset: 31, limit: ['15', '16'] })).toBe(
      '/users?offset=31&limit[]=15&limit[]=16'
    )

    expect(path.test('/users?offset=31&limit[]=15')).toEqual({
      offset: '31',
      limit: ['15']
    })
    expect(path.test('/users?offset=31&limit[]=15&limit[]=16')).toEqual({
      offset: '31',
      limit: ['15', '16']
    })
  })

  it('should match and build paths with url and query parameters', () => {
    const path = new Path('/users/profile/:id-:id2?:id3')
    expect(path.hasQueryParams).toBe(true)
    // Successful match & partial match
    expect(path.test('/users/profile/123-456?id3=789')).toEqual({
      id: '123',
      id2: '456',
      id3: '789'
    })
    expect(path.partialTest('/users/profile/123-456')).toEqual({
      id: '123',
      id2: '456'
    })
    // Un,successful match
    expect(path.test('/users/details/123-456')).toBeDefined()
    expect(path.test('/users/profile/123-456?id3=789&id4=000')).toBeDefined()

    expect(path.build({ id: '123', id2: '456', id3: '789' })).toBe(
      '/users/profile/123-456?id3=789'
    )
  })

  it('should match and build paths with splat parameters', () => {
    const path = new Path('/users/*splat')
    expect(path.hasSpatParam).toBe(true)
    // Successful match
    expect(path.test('/users/profile/123')).toEqual({ splat: 'profile/123' })
    expect(path.test('/users/admin/manage/view/123')).toEqual({
      splat: 'admin/manage/view/123'
    })
    // Build path
    expect(path.build({ splat: 'profile/123' })).toBe('/users/profile/123')
  })

  it('should match and build paths with splat and url parameters', () => {
    const path = new Path('/users/*splat/view/:id')
    expect(path.hasSpatParam).toBe(true)
    // Successful match
    expect(path.test('/users/profile/view/123')).toEqual({
      splat: 'profile',
      id: '123'
    })
    expect(path.test('/users/admin/manage/view/123')).toEqual({
      splat: 'admin/manage',
      id: '123'
    })
  })

  it('should match and build paths with url, splat and query parameters', () => {
    const path = new Path('/:section/*splat?id')
    expect(path.hasSpatParam).toBe(true)
    // Successful match
    expect(path.test('/users/profile/view?id=123')).toEqual({
      section: 'users',
      splat: 'profile/view',
      id: '123'
    })
    expect(
      path.build({ section: 'users', splat: 'profile/view', id: '123' })
    ).toBe('/users/profile/view?id=123')
  })

  it('should match and build paths with matrix parameters', () => {
    const path = new Path('/users/;section;id')
    expect(path.hasMatrixParams).toBe(true)
    // Build path
    expect(path.build({ section: 'profile', id: '123' })).toBe(
      '/users/;section=profile;id=123'
    )
    // Successful match
    expect(path.test('/users/;section=profile;id=123')).toEqual({
      section: 'profile',
      id: '123'
    })
  })

  it('should match and build paths with constrained parameters', () => {
    let path = new Path('/users/:id<\\d+>')
    // Build path
    expect(path.build({ id: 99 })).toBe('/users/99')
    // Match path
    expect(path.test('/users/11')).toEqual({ id: '11' })
    expect(path.test('/users/thomas')).toBeDefined()

    path = new Path('/users/;id<[A-F0-9]{6}>')
    // Build path
    expect(path.build({ id: 'A76FE4' })).toBe('/users/;id=A76FE4')
    // Error because of incorrect parameter format
    expect(() => {
      path.build({ id: 'incorrect-param' })
    }).toThrow()
    // Force
    expect(path.build({ id: 'fake' }, { ignoreConstraints: true })).toBe(
      '/users/;id=fake'
    )

    // Match path
    expect(path.test('/users/;id=A76FE4')).toEqual({ id: 'A76FE4' })
    expect(path.test('/users;id=Z12345')).toBeDefined()
  })

  it('should match and build paths with star (*) as a parameter value', () => {
    const path = new Path('/test/:param')

    expect(path.build({ param: 'super*' })).toBe('/test/super*')

    expect(path.test('/test/super*')).toEqual({ param: 'super*' })
  })

  it('should match paths with optional trailing slashes', () => {
    let path = new Path('/my-path')
    expect(path.test('/my-path/', { strictTrailingSlash: true })).toBeDefined()
    expect(path.test('/my-path/', { strictTrailingSlash: false })).toEqual({})

    path = new Path('/my-path/')
    expect(path.test('/my-path', { strictTrailingSlash: true })).toBeDefined()
    expect(path.test('/my-path', { strictTrailingSlash: false })).toEqual({})

    path = new Path('/')
    expect(path.test('', { strictTrailingSlash: true })).toBeDefined()
    expect(path.test('', { strictTrailingSlash: false })).toBeDefined()
    expect(path.test('/', { strictTrailingSlash: true })).toEqual({})
  })

  it('should match paths with encoded values', () => {
    const path = new Path('/test/:id')

    expect(path.partialTest('/test/%7B123-456%7D')).toEqual({ id: '{123-456}' })
  })

  it('should encode values and build paths', () => {
    const path = new Path('/test/:id')

    expect(path.build({ id: '{123-456}' })).toBe('/test/%7B123-456%7D')
  })

  it('should partial match up to a delimiter', () => {
    const path = new Path('/univers')

    expect(path.partialTest('/university')).toBeDefined()
    expect(path.partialTest('/university', { delimited: false })).toEqual({})
    expect(path.partialTest('/univers/hello')).toEqual({})
  })

  it('should match with special characters in path', () => {
    const path = new Path('/test/:name/test2')

    expect(path.partialTest('/test/he:re/test2')).toEqual({ name: 'he:re' })
    expect(path.partialTest("/test/he're/test2")).toEqual({ name: "he're" })

    expect(path.build({ name: "he're" })).toEqual("/test/he're/test2")
  })

  it('should be case insensitive', () => {
    const path = new Path('/test')

    expect(path.test('/test')).toEqual({})
    expect(path.test('/Test')).toEqual({})
    expect(path.test('/TEST', { caseSensitive: true })).toBeDefined()
  })

  it('should be to overwrite options when building', () => {
    const path = new Path<{ param: string; enabled?: boolean }>(
      '/:param?enabled',
      {
        queryParams: {
          booleanFormat: 'string'
        },
        urlParamsEncoding: 'uriComponent'
      }
    )

    expect(path.build({ param: 'a+b', enabled: true })).toBe(
      '/a%2Bb?enabled=true'
    )
    expect(
      path.build(
        { param: 'a+b', enabled: true },
        {
          queryParams: { booleanFormat: 'empty-true' },
          urlParamsEncoding: 'default'
        }
      )
    ).toBe('/a+b?enabled')
  })

  it('should be to overwrite options when matching', () => {
    const path = new Path<{ param: string; enabled?: boolean }>(
      '/:param?enabled',
      {
        queryParams: {
          booleanFormat: 'string'
        },
        urlParamsEncoding: 'uriComponent'
      }
    )

    expect(path.test('/a+b?enabled')).toEqual({
      param: 'a+b',
      enabled: null
    })
    expect(
      path.test('/a+b?enabled', {
        queryParams: { booleanFormat: 'empty-true' }
      })
    ).toEqual({
      param: 'a+b',
      enabled: true
    })
  })

  it('should match unencoded pipes (Firefox)', () => {
    const path = new Path('/test/:param')

    expect(path.test('/test/1|2')).toEqual({
      param: '1|2'
    })
  })

  it('should support a wide range of characters', () => {
    const path = new Path('/test/:param')

    expect(path.test('/test/1+2=3@*')).toEqual({
      param: '1+2=3@*'
    })
  })

  describe('default encoding', () => {
    const path = new Path<{ param: string }>('/:param')

    it('should build with correct encoding', () => {
      expect(
        path.build({
          param: 'test$@'
        })
      ).toBe('/test$%40')
    })

    it('should match with correct decoding', () => {
      expect(path.test('/test%24%40')).toEqual({
        param: 'test$@'
      })

      expect(path.partialTest('/test$@')).toEqual({
        param: 'test$@'
      })
    })
  })

  describe('uri encoding', () => {
    const path = new Path('/:param', {
      urlParamsEncoding: 'uriComponent'
    })

    it('should build with correct encoding', () => {
      expect(
        path.build({
          param: 'test$@'
        })
      ).toBe('/test%24%40')
    })

    it('should match with correct decoding', () => {
      expect(path.test('/test%24%40')).toEqual({
        param: 'test$@'
      })

      expect(path.partialTest('/test$@')).toEqual({
        param: 'test$@'
      })
    })
  })

  describe('uriComponent encoding', () => {
    const path = new Path('/:param', {
      urlParamsEncoding: 'uri'
    })

    it('should build with correct encoding', () => {
      expect(
        path.build({
          param: 'test$%'
        })
      ).toBe('/test$%25')
    })

    it('should match with correct decoding', () => {
      expect(path.test('/test$%25')).toEqual({
        param: 'test$%'
      })

      expect(path.partialTest('/test$@')).toEqual({
        param: 'test$@'
      })
    })
  })

  describe('no encoding', () => {
    const path = new Path('/:param', {
      urlParamsEncoding: 'none'
    })

    it('should build with correct encoding', () => {
      expect(
        path.build({
          param: 'test$%'
        })
      ).toBe('/test$%')
    })

    it('should match with correct decoding', () => {
      expect(path.test('/test$%25')).toEqual({
        param: 'test$%25'
      })
    })
  })
})
