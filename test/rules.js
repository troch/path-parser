'use strict'

const Rules = require('../modules/rules').default
const defaultOrConstrained = require('../modules/rules').defaultOrConstrained
const should = require('should')

require('mocha')

const getRule = name => Rules.find(rule => rule.name === name)

describe('Rules', () => {
    describe('defaultOrConstrained', () => {
        it('should replace "<" with whitespace', () => {
            defaultOrConstrained('<').should.equal('()')
        })
        it('should replace ">" with whitespace', () => {
            defaultOrConstrained('>').should.equal('()')
        })
        it('should replace undefined match with default pattern', () => {
            defaultOrConstrained(undefined).should.equal(
                "([a-zA-Z0-9-_.~%':|]+)"
            )
        })
        it('should replace null match with default pattern', () => {
            defaultOrConstrained(null).should.equal("([a-zA-Z0-9-_.~%':|]+)")
        })
    })

    describe('url-parameter', () => {
        const rule = getRule('url-parameter')
        describe('pattern', () => {
            it('should match rule pattern when valid parameters are defined', () => {
                ':a£'
                    .match(rule.pattern)
                    .slice(0, 4)
                    .should.be.eql([':a', 'a', undefined, undefined])
                ':_aT10£<wqqwq>'
                    .match(rule.pattern)
                    .slice(0, 4)
                    .should.be.eql([':_aT10', '_aT10', undefined, undefined])
                ':_aT10<sasA#sa3322>'
                    .match(rule.pattern)
                    .slice(0, 4)
                    .should.be.eql([
                        ':_aT10<sasA#sa3322>',
                        '_aT10',
                        '<sasA#sa3322>',
                        'sasA#sa3322'
                    ])
                ':_aT10<a1'
                    .match(rule.pattern)
                    .slice(0, 4)
                    .should.be.eql([':_aT10', '_aT10', undefined, undefined])
                ':_aT10<'
                    .match(rule.pattern)
                    .slice(0, 4)
                    .should.be.eql([':_aT10', '_aT10', undefined, undefined])
                ':_aT10<>'
                    .match(rule.pattern)
                    .slice(0, 4)
                    .should.be.eql([':_aT10', '_aT10', undefined, undefined])
            })
            it('should not match rule pattern when valid parameters are defined', () => {
                should(':'.match(rule.pattern)).be.null()
                should(':_'.match(rule.pattern)).be.null()
                should(':<sasasa>'.match(rule.pattern)).be.null()
            })
        })
        describe('regex', () => {
            it('should return default matched pattern when match is not defined', () => {
                rule
                    .regex([undefined, undefined, undefined, undefined])
                    .should.eql(new RegExp("([a-zA-Z0-9-_.~%':|]+)"))
            })
            it('should return matched pattern when match is defined', () => {
                rule
                    .regex([':_aT10<test>', '_aT10', '<test>', 'test'])
                    .should.eql(new RegExp('(test)'))
            })
        })
    })
    describe('url-parameter-splat', () => {
        const rule = getRule('url-parameter-splat')
        describe('pattern', () => {
            it('should match rule pattern when valid parameters are defined', () => {
                '*a£'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['*a', 'a'])
                '*_aT10£'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['*_aT10', '_aT10'])
            })
            it('should not match rule pattern when valid parameters are defined', () => {
                should('*'.match(rule.pattern)).be.null()
                should('*_'.match(rule.pattern)).be.null()
            })
        })
        describe('regex', () => {
            it('should equal regex that matches anything that does not start with a question mark', () => {
                rule.regex.should.eql(/([^?]*)/)
            })
        })
    })
    describe('url-parameter-matrix', () => {
        const rule = getRule('url-parameter-matrix')
        describe('pattern', () => {
            it('should match rule pattern when valid parameters are defined', () => {
                ';a£'
                    .match(rule.pattern)
                    .slice(0, 4)
                    .should.be.eql([';a', 'a', undefined, undefined])
                ';_aT10£<wqqwq>'
                    .match(rule.pattern)
                    .slice(0, 4)
                    .should.be.eql([';_aT10', '_aT10', undefined, undefined])
                ';_aT10<sasA#sa3322>'
                    .match(rule.pattern)
                    .slice(0, 4)
                    .should.be.eql([
                        ';_aT10<sasA#sa3322>',
                        '_aT10',
                        '<sasA#sa3322>',
                        'sasA#sa3322'
                    ])
                ';_aT10<a1'
                    .match(rule.pattern)
                    .slice(0, 4)
                    .should.be.eql([';_aT10', '_aT10', undefined, undefined])
                ';_aT10<'
                    .match(rule.pattern)
                    .slice(0, 4)
                    .should.be.eql([';_aT10', '_aT10', undefined, undefined])
                ';_aT10<>'
                    .match(rule.pattern)
                    .slice(0, 4)
                    .should.be.eql([';_aT10', '_aT10', undefined, undefined])
            })
            it('should not match rule pattern when valid parameters are defined', () => {
                should(';'.match(rule.pattern)).be.null()
                should(';_'.match(rule.pattern)).be.null()
                should(';<sasasa>'.match(rule.pattern)).be.null()
            })
        })
        describe('regex', () => {
            it('should return default matched pattern when match is not defined', () => {
                rule
                    .regex([';_aT10', '_aT10', undefined, undefined])
                    .should.eql(new RegExp(";_aT10=([a-zA-Z0-9-_.~%':|]+)"))
            })
            it('should return matched pattern when match is defined', () => {
                rule
                    .regex([';_aT10<test>', '_aT10', '<test>', 'test'])
                    .should.eql(new RegExp(';_aT10=(test)'))
            })
        })
    })
    describe('query-parameter', () => {
        const rule = getRule('query-parameter')
        describe('pattern', () => {
            it('should match rule pattern when valid parameters are defined', () => {
                '?a£'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['?a', 'a'])
                '?:a£'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['?:a', 'a'])
                '&a£'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['&a', 'a'])
                '&:a£'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['&:a', 'a'])
                '?_aT10£'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['?_aT10', '_aT10'])
                '?:_aT10£'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['?:_aT10', '_aT10'])
                '&_aT10£'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['&_aT10', '_aT10'])
                '&:_aT10£'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['&:_aT10', '_aT10'])
            })
            it('should not match rule pattern when valid parameters are defined', () => {
                should('?'.match(rule.pattern)).be.null()
                should('?:'.match(rule.pattern)).be.null()
                should('?:_'.match(rule.pattern)).be.null()
                should('&'.match(rule.pattern)).be.null()
                should('&:'.match(rule.pattern)).be.null()
                should('&:_'.match(rule.pattern)).be.null()
            })
        })
        describe('regex', () => {
            it('should not be defined', () => {
                should(rule.regex).be.undefined()
            })
        })
    })
    describe('delimiter', () => {
        const rule = getRule('delimiter')
        describe('pattern', () => {
            it('should match rule pattern when valid parameters are defined', () => {
                '/A'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['/', '/'])
                '?A'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['?', '?'])
            })
        })
        describe('regex', () => {
            it('Should return regex matched string', () => {
                rule.regex(['/', '/']).should.eql(new RegExp('\\/'))
            })
        })
    })
    describe('sub-delimiter', () => {
        const rule = getRule('sub-delimiter')
        describe('pattern', () => {
            it('should match rule pattern when valid parameters are defined', () => {
                '!A'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['!', '!'])
                '&A'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['&', '&'])
                '-A'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['-', '-'])
                '_A'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['_', '_'])
                '.'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['.', '.'])
                ';'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql([';', ';'])
            })
        })
        describe('regex', () => {
            it('Should return regex matched string', () => {
                rule.regex(['_', '_']).should.eql(new RegExp('_'))
            })
        })
    })
    describe('fragment', () => {
        const rule = getRule('fragment')
        describe('pattern', () => {
            it('should match rule pattern when valid parameters are defined', () => {
                '102abcdABCD'
                    .match(rule.pattern)
                    .slice(0, 2)
                    .should.be.eql(['102abcdABCD', '102abcdABCD'])
            })
        })
        describe('regex', () => {
            it('Should return regex matched string', () => {
                rule
                    .regex(['102abcdABCD', '102abcdABCD'])
                    .should.eql(new RegExp('102abcdABCD'))
            })
        })
    })
})
