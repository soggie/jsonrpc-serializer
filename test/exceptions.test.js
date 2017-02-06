const err = require('../lib/exceptions')
const test = require('ava')
const chai = require('chai')
chai.should()

// https://github.com/soggie/jsonrpc-serializer/issues/13
test('test variable length data in JsonRpcError', function (t) {
  const error = new err.JsonRpcError('error message', 1, 2, 3)
  error.should.be.an('object')
  error.message.should.be.equal('error message')
  error.data.should.be.an('array')
  error.data.should.include(1)
  error.data.should.include(2)
  error.data.should.include(3)
  t.pass()
})

test('test variable length data in ParseError', function (t) {
  const error = new err.ParseError(1, 2, 3)
  error.should.be.an('object')
  error.data.should.be.an('array')
  error.data.should.include(1)
  error.data.should.include(2)
  error.data.should.include(3)
  t.pass()
})

test('test variable length data in InvalidRequestError', function (t) {
  const error = new err.InvalidRequestError(1, 2, 3)
  error.should.be.an('object')
  error.data.should.be.an('array')
  error.data.should.include(1)
  error.data.should.include(2)
  error.data.should.include(3)
  t.pass()
})

test('test variable length data in MethodNotFoundError', function (t) {
  const error = new err.MethodNotFoundError(1, 2, 3)
  error.should.be.an('object')
  error.data.should.be.an('array')
  error.data.should.include(1)
  error.data.should.include(2)
  error.data.should.include(3)
  t.pass()
})

test('test variable length data in InvalidParamsError', function (t) {
  const error = new err.InvalidParamsError(1, 2, 3)
  error.should.be.an('object')
  error.data.should.be.an('array')
  error.data.should.include(1)
  error.data.should.include(2)
  error.data.should.include(3)
  t.pass()
})