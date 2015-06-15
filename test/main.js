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
        var path = new Path('/users/profile/:id');
        console.log(path.tokens);
    });
});
