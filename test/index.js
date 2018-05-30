'use strict'

const Path = require('../modules/Path').default
const should = require('should')

require('mocha')

describe('Path', () => {
    it('should throw an error when instantiated without parameter', () => {
        should.throws(() => new Path())
    })

    it('should throw an error if Path is used like a function', () => {
        should.throws(() => Path())
    })

    it('should throw an error if a path cannot be tokenised', () => {
        should.throws(() => new Path('/!#'))
    })

    it('should return a path if createPath is used', () => {
        should.exist(Path.createPath('/users'))
    })

    it('should match and build paths with url parameters', () => {
        const path = new Path('/users/profile/:id-:id2.html')
        // Successful match & partial match
        path
            .test('/users/profile/123-abc.html')
            .should.eql({ id: '123', id2: 'abc' })
        path
            .partialTest('/users/profile/123-abc.html?what')
            .should.eql({ id: '123', id2: 'abc' })
        // Unsuccessful match
        should.not.exist(path.test('/users/details/123-abc'))
        should.not.exist(path.test('/users/details/123-abc.html'))
        should.not.exist(path.test('/users/profile/123-abc.html?what'))

        path
            .build({ id: '123', id2: 'abc' })
            .should.equal('/users/profile/123-abc.html')
        ;(function() {
            path.build({ id: '123' })
        }.should.throw(
            "Cannot build path: '/users/profile/:id-:id2.html' requires missing parameters { id2 }"
        ))
    })

    it('should match and build paths with query parameters', () => {
        const path = new Path('/users?offset&limit')
        // Successful match & partial match
        path.test('/users?limit=15').should.eql({ limit: '15' })
        path
            .test('/users?offset=31&limit=15')
            .should.eql({ offset: '31', limit: '15' })
        path
            .test('/users?offset=31&offset=30&limit=15')
            .should.eql({ offset: ['31', '30'], limit: '15' })
        path
            .partialTest('/users?offset=true&limits=1', {
                queryParams: { booleanFormat: 'string' }
            })
            .should.eql({ offset: true })
        path
            .partialTest('/users?offset=1&offset=2%202&limits=1')
            .should.eql({ offset: ['1', '2 2'] })
        path.partialTest('/users').should.eql({})

        // Unsuccessful match
        should.not.exist(path.test('/users?offset=31&order=asc'))
        should.not.exist(path.test('/users?offset=31&limit=10&order=asc'))

        path
            .build({ offset: 31, limit: '15 15' })
            .should.equal('/users?offset=31&limit=15%2015')
        path.build({ offset: 31 }).should.equal('/users?offset=31')
        path
            .build({ offset: 31, limit: '' })
            .should.equal('/users?offset=31&limit=')
        path
            .build({ offset: 31, limit: undefined })
            .should.equal('/users?offset=31')
        path
            .build({ offset: 31, limit: false })
            .should.equal('/users?offset=31&limit=false')
        path
            .build({ offset: 31, limit: true })
            .should.equal('/users?offset=31&limit=true')
        path
            .build({ offset: [31, 30], limit: false })
            .should.equal('/users?offset=31&offset=30&limit=false')
        path
            .build({ offset: 31, limit: 15 }, { ignoreSearch: true })
            .should.equal('/users')
    })

    it('should match and build paths of query parameters with square brackets', () => {
        const path = new Path('/users?offset&limit')
        path
            .build(
                { offset: 31, limit: ['15'] },
                { queryParams: { arrayFormat: 'brackets' } }
            )
            .should.equal('/users?offset=31&limit[]=15')
        path
            .build(
                { offset: 31, limit: ['15', '16'] },
                { queryParams: { arrayFormat: 'brackets' } }
            )
            .should.equal('/users?offset=31&limit[]=15&limit[]=16')

        path
            .test('/users?offset=31&limit[]=15')
            .should.eql({ offset: '31', limit: ['15'] })
        path
            .test('/users?offset=31&limit[]=15&limit[]=16')
            .should.eql({ offset: '31', limit: ['15', '16'] })
    })

    it('should match and build paths with url and query parameters', () => {
        const path = new Path('/users/profile/:id-:id2?:id3')
        path.hasQueryParams.should.be.true
        // Successful match & partial match
        path
            .test('/users/profile/123-456?id3=789')
            .should.eql({ id: '123', id2: '456', id3: '789' })
        path
            .partialTest('/users/profile/123-456')
            .should.eql({ id: '123', id2: '456' })
        // Un,successful match
        should.not.exist(path.test('/users/details/123-456'))
        should.not.exist(path.test('/users/profile/123-456?id3=789&id4=000'))

        path
            .build({ id: '123', id2: '456', id3: '789' })
            .should.equal('/users/profile/123-456?id3=789')
    })

    it('should match and build paths with splat parameters', () => {
        const path = new Path('/users/*splat')
        path.hasSpatParam.should.be.true
        // Successful match
        path.test('/users/profile/123').should.eql({ splat: 'profile/123' })
        path
            .test('/users/admin/manage/view/123')
            .should.eql({ splat: 'admin/manage/view/123' })
        // Build path
        path.build({ splat: 'profile/123' }).should.equal('/users/profile/123')
    })

    it('should match and build paths with splat and url parameters', () => {
        const path = new Path('/users/*splat/view/:id')
        path.hasSpatParam.should.be.true
        // Successful match
        path
            .test('/users/profile/view/123')
            .should.eql({ splat: 'profile', id: '123' })
        path
            .test('/users/admin/manage/view/123')
            .should.eql({ splat: 'admin/manage', id: '123' })
    })

    it('should match and build paths with url, splat and query parameters', () => {
        const path = new Path('/:section/*splat?id')
        path.hasSpatParam.should.be.true
        // Successful match
        path
            .test('/users/profile/view?id=123')
            .should.eql({ section: 'users', splat: 'profile/view', id: '123' })
        path
            .build({ section: 'users', splat: 'profile/view', id: '123' })
            .should.equal('/users/profile/view?id=123')
    })

    it('should match and build paths with matrix parameters', () => {
        const path = new Path('/users/;section;id')
        path.hasMatrixParams.should.be.true
        // Build path
        path
            .build({ section: 'profile', id: '123' })
            .should.equal('/users/;section=profile;id=123')
        // Successful match
        path
            .test('/users/;section=profile;id=123')
            .should.eql({ section: 'profile', id: '123' })
    })

    it('should match and build paths with constrained parameters', () => {
        let path = new Path('/users/:id<\\d+>')
        // Build path
        path.build({ id: 99 }).should.equal('/users/99')
        // Match path
        path.test('/users/11').should.eql({ id: '11' })
        should.not.exist(path.test('/users/thomas'))

        path = new Path('/users/;id<[A-F0-9]{6}>')
        // Build path
        path.build({ id: 'A76FE4' }).should.equal('/users/;id=A76FE4')
        // Error because of incorrect parameter format
        ;(function() {
            path.build({ id: 'incorrect-param' })
        }.should.throw())
        // Force
        path
            .build({ id: 'fake' }, { ignoreConstraints: true })
            .should.equal('/users/;id=fake')

        // Match path
        path.test('/users/;id=A76FE4').should.eql({ id: 'A76FE4' })
        should.not.exist(path.test('/users;id=Z12345'))
    })

    it('should match paths with optional trailing slashes', () => {
        let path = new Path('/my-path')
        should.not.exist(path.test('/my-path/', { strictTrailingSlash: true }))
        path.test('/my-path/', { strictTrailingSlash: false }).should.eql({})

        path = new Path('/my-path/')
        should.not.exist(path.test('/my-path', { strictTrailingSlash: true }))
        path.test('/my-path', { strictTrailingSlash: false }).should.eql({})

        path = new Path('/')
        should.not.exist(path.test('', { strictTrailingSlash: true }))
        should.not.exist(path.test('', { strictTrailingSlash: false }))
        path.test('/', { strictTrailingSlash: true }).should.eql({})
    })

    it('should match paths with encoded values', () => {
        const path = new Path('/test/:id')

        path.partialTest('/test/%7B123-456%7D').should.eql({ id: '{123-456}' })
    })

    it('should encoded values and build paths', () => {
        const path = new Path('/test/:id')

        path.build({ id: '{123-456}' }).should.equal('/test/%7B123-456%7D')
    })

    it('should partial match up to a delimiter', () => {
        const path = new Path('/univers')

        should.not.exist(path.partialTest('/university'))
        path.partialTest('/university', { delimited: false }).should.eql({})
        path.partialTest('/univers/hello').should.eql({})
    })

    it('should match with special characters in path', () => {
        const path = new Path('/test/:name/test2')

        path.partialTest('/test/he:re/test2').should.eql({ name: 'he:re' })
        path.partialTest("/test/he're/test2").should.eql({ name: "he're" })

        path.build({ name: 'he:re' }).should.eql('/test/he:re/test2')
        path.build({ name: "he're" }).should.eql("/test/he're/test2")
    })

    it('should be case insensitive', () => {
        const path = new Path('/test')

        path.test('/test').should.eql({})
        path.test('/Test').should.eql({})
        should.not.exist(path.test('/TEST', { caseSensitive: true }))
    })

    it('should match unencoded pipes (Firefox)', () => {
        const path = new Path('/test/:param')

        path.test('/test/1|2').should.eql({
            param: '1|2'
        })
    })
})
