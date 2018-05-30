'use strict'

const tokenise = require('../modules/tokeniser').default
const should = require('should')

require('mocha')

describe('tokenise', () => {
    it('should throw error when no rule is matched', () => {
        should.throws(() => tokenise('$'), Error, 'does not match any rule')
    })
    it('should match rule', () => {
        tokenise('/').should.be.eql([
            {
                type: 'delimiter',
                match: '/',
                val: ['/'],
                otherVal: [],
                regex: new RegExp('/')
            }
        ])
    })
    it('should match multiple rules', () => {
        const urlParams = '/?key1;key2<value2>'
        tokenise(urlParams).should.be.eql([
            {
                type: 'delimiter',
                match: '/',
                val: ['/'],
                otherVal: [],
                regex: new RegExp('/')
            },
            {
                type: 'query-parameter',
                match: '?key1',
                val: ['key1'],
                otherVal: [],
                regex: undefined
            },
            {
                type: 'url-parameter-matrix',
                match: ';key2<value2>',
                val: ['key2'],
                otherVal: ['<value2>', 'value2'],
                regex: new RegExp(';key2=(value2)')
            }
        ])
    })
})
