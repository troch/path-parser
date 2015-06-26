'use strict';

var Path = require('../');
var should = require('should');

require('mocha');

describe('Path', function () {
    it('should throw an error when instanciated without parameter', function () {
        (function () {
            new Path()
        }).should.throw();
    });

    // it('should throw an error if a path cannot be tokenised', function () {
    //     (function () {
    //         new Path('/!#')
    //     }).should.throw();
    // });

    it('should match and build paths with url parameters', function () {
        var path = new Path('/users/profile/:id-:id2.html');
        // Successful match & partial match
        path.match('/users/profile/123-abc.html').should.eql({ id: '123', id2: 'abc' });
        path.partialMatch('/users/profile/123-abc.html?what').should.eql({ id: '123', id2: 'abc' });
        // Unsuccessful match
        path.match('/users/details/123-abc').should.be.false;
        path.match('/users/details/123-abc.html').should.be.false;
        path.match('/users/profile/123-abc.html?what').should.be.false;

        path.build({ id: '123', id2: 'abc' }).should.equal('/users/profile/123-abc.html');
        (function () {
            path.build({ id: '123'});
        }).should.throw('Missing parameters');
    });

    it('should match and build paths with query parameters', function () {
        var path = new Path('/users?offset&limit');
        // Successful match & partial match
        path.match('/users?offset=31&limit=15').should.eql({ offset: '31', limit: '15' });
        // path.partialMatch('/users').should.eql({});
        // Unsuccessful match
        path.match('/users?offset=31').should.be.false;
        path.match('/users?limit=15').should.be.false;

        path.build({ offset: 31, limit: 15 }).should.equal('/users?offset=31&limit=15')
    });

    it('should match and build paths with url and query parameters', function () {
        var path = new Path('/users/profile/:id-:id2?:id3');
        path.hasQueryParams.should.be.true;
        // Successful match & partial match
        path.match('/users/profile/123-456?id3=789').should.eql({ id: '123', id2: '456', id3: '789' });
        path.partialMatch('/users/profile/123-456').should.eql({ id: '123', id2: '456' });
        // Unsuccessful match
        path.match('/users/details/123-456').should.be.false;
        path.match('/users/profile/123-456?id3=789&id4=000').should.be.false;

        path.build({ id: '123', id2: '456', id3: '789' }).should.equal('/users/profile/123-456?id3=789')
    });

    it('should match build paths with splat parameters', function () {
        var path = new Path('/users/*splat');
        path.hasSpatParam.should.be.true;
        // Successful match
        path.match('/users/profile/123').should.eql({ splat: 'profile/123'});
        path.match('/users/admin/manage/view/123').should.eql({ splat: 'admin/manage/view/123'});
        // Build path
        path.build({ splat: 'profile/123'}).should.equal('/users/profile/123');
    });

    it('should match build paths with splat and url parameters', function () {
        var path = new Path('/users/*splat/view/:id');
        path.hasSpatParam.should.be.true;
        // Successful match
        path.match('/users/profile/view/123').should.eql({ splat: 'profile', id: '123' });
        path.match('/users/admin/manage/view/123').should.eql({ splat: 'admin/manage', id: '123' });
    });

    it('should match build paths with url, splat and query parameters', function () {
        var path = new Path('/:section/*splat?id');
        path.hasSpatParam.should.be.true;
        // Successful match
        path.match('/users/profile/view?id=123').should.eql({ section: 'users', splat: 'profile/view', id: '123' });
        path.build({section: 'users', splat: 'profile/view', id: '123'}).should.equal('/users/profile/view?id=123');
    })
});
