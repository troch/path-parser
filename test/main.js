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

    it('should parse a path into tokens', function () {
        var path = new Path('/users/profile/:id-:id2.html');

        path.match('/users/profile/123-abc.html').should.eql({ id: '123', id2: 'abc' });
        path.match('/users/profile/123-abc.html?what').should.be.false;
        path.partialMatch('/users/profile/123-abc.html?what').should.eql({ id: '123', id2: 'abc' });

        path.build({ id: '123', id2: 'abc' }).should.equal('/users/profile/123-abc.html')
    });
});
