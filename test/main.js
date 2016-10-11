'use strict';

var path      = require('path');
var pkg       = require('../package.json');
var Path      = require('../modules/Path');
var should    = require('should');

require('mocha');

describe('Path', function () {
    it('should throw an error when instanciated without parameter', function () {
        (function () {
            new Path()
        }).should.throw();
    });

    it('should throw an error if Path is used like a function', function () {
        (function () {
            Path()
        }).should.throw();
    });

    it('should throw an error if a path cannot be tokenised', function () {
        (function () {
            new Path('/!#')
        }).should.throw();
    });

    it('should return a path if createPath is used', function () {
        should.exist(Path.createPath('/users'));
    });

    it('should match and build paths with url parameters', function () {
        var path = new Path('/users/profile/:id-:id2.html');
        // Successful match & partial match
        path.match('/users/profile/123-abc.html').should.eql({ id: '123', id2: 'abc' });
        path.partialMatch('/users/profile/123-abc.html?what').should.eql({ id: '123', id2: 'abc' });
        // Unsuccessful match
        should.not.exist(path.match('/users/details/123-abc'));
        should.not.exist(path.match('/users/details/123-abc.html'));
        should.not.exist(path.match('/users/profile/123-abc.html?what'));

        path.build({ id: '123', id2: 'abc' }).should.equal('/users/profile/123-abc.html');
        (function () {
            path.build({ id: '123'});
        }).should.throw('Missing parameters');
    });

    it('should match and build paths with query parameters', function () {
        var path = new Path('/users?offset&limit');
        // Successful match & partial match
        path.match('/users?offset=31&limit=15').should.eql({ offset: '31', limit: '15' });
        path.match('/users?offset=31&offset=30&limit=15').should.eql({ offset: ['31', '30'], limit: '15' });
        path.match('/users?offset&limit=15').should.eql({ offset: true, limit: '15' });
        path.match('/users?limit=15').should.eql({ limit: '15' });
        path.match('/users?limit=15').should.eql({ limit: '15' });
        path.partialMatch('/users?offset&limits=1').should.eql({ offset: true });
        path.partialMatch('/users?offset=1&offset=2%202&limits=1').should.eql({ offset: ['1', '2 2'] });
        path.partialMatch('/users').should.eql({});

        // Unsuccessful match
        should.not.exist(path.match('/users?offset=31&order=asc'));
        should.not.exist(path.match('/users?offset=31&limit=10&order=asc'));

        path.build({ offset: 31, limit: '15 15' }).should.equal('/users?offset=31&limit=15%2015');
        path.build({ offset: 31 }).should.equal('/users?offset=31');
        path.build({ offset: 31, limit: '' }).should.equal('/users?offset=31&limit=');
        path.build({ offset: 31, limit: undefined  }).should.equal('/users?offset=31');
        path.build({ offset: 31, limit: false  }).should.equal('/users?offset=31&limit=false');
        path.build({ offset: 31, limit: true  }).should.equal('/users?offset=31&limit');
        path.build({ offset: [31, 30], limit: false  }).should.equal('/users?offset=31&offset=30&limit=false');
        path.build({ offset: 31, limit: 15 }, {ignoreSearch: true}).should.equal('/users');
    });

    it('should match and build paths of query parameters with square brackets', function () {
        var path = new Path('/users?offset&limit[]');
        path.build({ offset: 31, limit: ['15'] }).should.equal('/users?offset=31&limit[]=15');
        path.build({ offset: 31, limit: ['15', '16'] }).should.equal('/users?offset=31&limit[]=15&limit[]=16');

        path.match('/users?offset=31&limit[]=15').should.eql({ offset: '31', limit: ['15'] });
        path.match('/users?offset=31&limit[]=15&limit[]=16').should.eql({ offset: '31', limit: ['15', '16'] });
    });

    it('should match and build paths with url and query parameters', function () {
        var path = new Path('/users/profile/:id-:id2?:id3');
        path.hasQueryParams.should.be.true;
        // Successful match & partial match
        path.match('/users/profile/123-456?id3=789').should.eql({ id: '123', id2: '456', id3: '789' });
        path.partialMatch('/users/profile/123-456').should.eql({ id: '123', id2: '456' });
        // Un,successful match
        should.not.exist(path.match('/users/details/123-456'));
        should.not.exist(path.match('/users/profile/123-456?id3=789&id4=000'));

        path.build({ id: '123', id2: '456', id3: '789' }).should.equal('/users/profile/123-456?id3=789')
    });

    it('should match and build paths with splat parameters', function () {
        var path = new Path('/users/*splat');
        path.hasSpatParam.should.be.true;
        // Successful match
        path.match('/users/profile/123').should.eql({ splat: 'profile/123'});
        path.match('/users/admin/manage/view/123').should.eql({ splat: 'admin/manage/view/123'});
        // Build path
        path.build({ splat: 'profile/123'}).should.equal('/users/profile/123');
    });

    it('should match and build paths with splat and url parameters', function () {
        var path = new Path('/users/*splat/view/:id');
        path.hasSpatParam.should.be.true;
        // Successful match
        path.match('/users/profile/view/123').should.eql({ splat: 'profile', id: '123' });
        path.match('/users/admin/manage/view/123').should.eql({ splat: 'admin/manage', id: '123' });
    });

    it('should match and build paths with url, splat and query parameters', function () {
        var path = new Path('/:section/*splat?id');
        path.hasSpatParam.should.be.true;
        // Successful match
        path.match('/users/profile/view?id=123').should.eql({ section: 'users', splat: 'profile/view', id: '123' });
        path.build({section: 'users', splat: 'profile/view', id: '123'}).should.equal('/users/profile/view?id=123');
    })

    it('should match and build paths with matrix parameters', function () {
        var path = new Path('/users/;section;id');
        path.hasMatrixParams.should.be.true;
        // Build path
        path.build({ section: 'profile', id: '123'}).should.equal('/users/;section=profile;id=123');
        // Successful match
        path.match('/users/;section=profile;id=123').should.eql({ section: 'profile', id: '123' });
    });

    it('should match and build paths with constrained parameters', function () {
        var path = new Path('/users/:id<\\d+>');
        // Build path
        path.build({id: 99}).should.equal('/users/99');
        // Match path
        path.match('/users/11').should.eql({id: '11'});
        should.not.exist(path.match('/users/thomas'));

        path = new Path('/users/;id<[A-F0-9]{6}>');
        // Build path
        path.build({id: 'A76FE4'}).should.equal('/users/;id=A76FE4');
        // Error because of incorrect parameter format
        (function () {
            path.build({id: 'incorrect-param'});
        }).should.throw();
        // Force
        path.build({id: 'fake'}, {ignoreConstraints: true}).should.equal('/users/;id=fake');


        // Match path
        path.match('/users/;id=A76FE4').should.eql({id: 'A76FE4'});
        should.not.exist(path.match('/users;id=Z12345'));
    });

    it('should match paths with optional trailing slashes', function () {
        var path = new Path('/my-path');
        should.not.exist(path.match('/my-path/'));
        path.match('/my-path/', true).should.eql({});
        path.match('/my-path/', 1).should.eql({});

        path = new Path('/my-path/');
        should.not.exist(path.match('/my-path'));
        path.match('/my-path', true).should.eql({});
        path.match('/my-path', 1).should.eql({});

        path = new Path('/');
        should.not.exist(path.match(''));
        path.match('/', true).should.eql({});
        path.match('', 1).should.eql({});
    });

    it('should match paths with encoded values', function () {
        var path = new Path('/test/:id');

        path.partialMatch('/test/%7B123-456%7D').should.eql({ id: '{123-456}' });
    });

    it('should encoded values and build paths', function () {
        var path = new Path('/test/:id');

        path.build({ id: '{123-456}' }).should.equal('/test/%7B123-456%7D');
    });
});
