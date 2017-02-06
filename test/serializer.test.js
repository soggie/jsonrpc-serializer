const ser = require('../lib/serializer')
const test = require('ava')
const chai = require('chai')
chai.should()

test('test request serialization for invalid params', function (t) {
  var result = ser.request()
  result.should.be.an('array');
  result.should.include('An ID must be provided. It must be either a string or an integer (no fractions allowed)');
  result.should.include('Method should be a string. Received undefined instead');
  t.pass()
})

test('test request serialization for valid params', function (t) {
  var result1 = ser.request('id', 'method')
  var result2 = ser.request('id', 'method', 'params')
  var result3 = ser.request('id', 'method', ['param1', 'param2'])
  var result4 = ser.request('id', 'method', { param : 'foo' })

  var object1 = ser.requestObject('id', 'method')
  var object2 = ser.requestObject('id', 'method', 'params')
  var object3 = ser.requestObject('id', 'method', ['param1', 'param2'])
  var object4 = ser.requestObject('id', 'method', { param : 'foo' })

  result1.should.be.a('string')
  result2.should.be.a('string')
  result3.should.be.a('string')
  result4.should.be.a('string')

  JSON.parse(result1).should.eql.object1
  JSON.parse(result2).should.eql.object2
  JSON.parse(result3).should.eql.object3
  JSON.parse(result4).should.eql.object4

  t.pass()
})

test('test notification serialization with invalid params', function (t) {
  var result = ser.notification()
  result.should.be.an('array')
  result.should.include('Method should be a string. Received undefined instead')

  t.pass()
})

test('test notification serialization with valid params', function (t) {
  var result1 = ser.notification('method')
  var result2 = ser.notification('method', 'params')
  var result3 = ser.notification('method', ['param1', 'param2'])
  var result4 = ser.notification('method', { param : 'foo' })

  var object1 = ser.notificationObject('method')
  var object2 = ser.notificationObject('method', 'params')
  var object3 = ser.notificationObject('method', ['param1', 'param2'])
  var object4 = ser.notificationObject('method', { param : 'foo' })

  result1.should.be.a('string')
  result2.should.be.a('string')
  result3.should.be.a('string')
  result4.should.be.a('string')

  JSON.parse(result1).should.eql.object1
  JSON.parse(result2).should.eql.object2
  JSON.parse(result3).should.eql.object3
  JSON.parse(result4).should.eql.object4

  t.pass()
})

test('test success serialization with invalid params', function (t) {
  var result = ser.success()
  result.should.be.an('array')
  result.should.include('An ID must be provided. It must be either a string or an integer (no fractions allowed)')
  result.should.include('Result must exist for success Response objects')

  t.pass()
})

test('test success serialization with valid params', function (t) {
  var result = ser.success('id', 'result')
  var object = ser.successObject('id', 'result')

  result.should.be.a('string')
  JSON.parse(result).should.eql.object

  t.pass()
})

test('test error serialization with invalid params', function (t) {
  var result1 = ser.error()
  var result2 = ser.error('id', {})

  result1.should.be.an('array')
  result1.should.include('An ID must be provided. It must be either a string or an integer (no fractions allowed)')
  result1.should.include('Error must be an object conforming to the JSON-RPC 2.0 error object specs')

  result2.should.be.an('array')
  result2.should.include('Error must be an instance of JsonRpcError, or any derivatives of it')

  t.pass()
})

test('test error serialization with valid params', function (t) {
  var result1 = ser.error('id', new ser.err.JsonRpcError('Crazy error'))
  var result2 = ser.error('id', new ser.err.ParseError())
  var result3 = ser.error('id', new ser.err.InvalidRequestError())
  var result4 = ser.error('id', new ser.err.MethodNotFoundError())
  var result5 = ser.error('id', new ser.err.InvalidParamsError())
  var result6 = ser.error(null, new ser.err.JsonRpcError('Null error'))

  var object1 = ser.errorObject('id', new ser.err.JsonRpcError('Crazy error'))
  var object2 = ser.errorObject('id', new ser.err.ParseError())
  var object3 = ser.errorObject('id', new ser.err.InvalidRequestError())
  var object4 = ser.errorObject('id', new ser.err.MethodNotFoundError())
  var object5 = ser.errorObject('id', new ser.err.InvalidParamsError())
  var object6 = ser.errorObject('id', new ser.err.JsonRpcError('Null error'))

  result1.should.be.a('string')
  result2.should.be.a('string')
  result3.should.be.a('string')
  result4.should.be.a('string')
  result5.should.be.a('string')
  result6.should.be.a('string')

  JSON.parse(result1).should.eql.object1
  JSON.parse(result2).should.eql.object2
  JSON.parse(result3).should.eql.object3
  JSON.parse(result4).should.eql.object4
  JSON.parse(result5).should.eql.object5
  JSON.parse(result6).should.eql.object6

  t.pass()
})

test('test deserialization with invalid params', function (t) {
  var result1 = ser.deserialize()
  var result2 = ser.deserialize(JSON.stringify({ foo : 'bar' }))

  result1.should.be.instanceof(ser.err.ParseError)
  result2.should.be.instanceof(ser.err.InvalidRequestError)

  t.pass()
})

test('test deserialization for request object', function (t) {
  var request = {
    jsonrpc : '2.0',
    id      : 'id',
    method  : 'method',
    params  : 'params'
  }

  var result = ser.deserialize(JSON.stringify(request))
  var object = ser.deserializeObject(request)

  delete request.jsonrpc

  result.type.should.eql('request')
  result.payload.should.eql(request)
  result.should.eql.object
  t.pass()
})

test('test deserialization where it should deserialize a id of 0', function(t) {
  var request = {
    jsonrpc : '2.0',
    id      : 0,
    method  : 'method',
    params  : 'params'
  }

  var result = ser.deserialize(JSON.stringify(request))

  delete request.jsonrpc

  result.type.should.eql('request')
  result.payload.should.eql(request)
  t.pass()
})

test('test deserialization where it should deserialize a id of empty string', function(t) {
  var request = {
    jsonrpc : '2.0',
    id      : '',
    method  : 'method',
    params  : 'params'
  }

  var result = ser.deserialize(JSON.stringify(request))

  delete request.jsonrpc

  result.type.should.eql('request')
  result.payload.should.eql(request)
  t.pass()
})

test('test deserialization where it should deserialize a id of null', function(t) {
  var request = {
    jsonrpc : '2.0',
    id      : null,
    method  : 'method',
    params  : 'params'
  }

  var result = ser.deserialize(JSON.stringify(request))

  delete request.jsonrpc

  result.type.should.eql('request')
  result.payload.should.eql(request)
  t.pass()
})

test('test deserialization where it should return a notification object', function (t) {
  var notification = {
    jsonrpc : '2.0',
    method  : 'method',
    params  : 'params'
  };

  var result = ser.deserialize(JSON.stringify(notification));
  var object = ser.deserializeObject(notification);

  delete notification.jsonrpc;

  result.type.should.eql('notification');
  result.payload.should.eql(notification);
  result.should.eql.object;

  t.pass()
});

test('test deserialization where it should return a success object', function (t) {
  var success = {
    jsonrpc : '2.0',
    id      : 'id',
    result  : 'result'
  }

  var result = ser.deserialize(JSON.stringify(success))
  var object = ser.deserializeObject(success)
  delete success.jsonrpc

  result.type.should.eql('success')
  result.payload.should.eql(success)
  result.should.eql.object

  t.pass()
})

test('test deserialization where it should deserialize a result of false', function(t) {
  var success = {
    jsonrpc : '2.0',
    id      : 'id',
    result  : false,
  }

  var result = ser.deserialize(JSON.stringify(success))
  delete success.jsonrpc

  result.payload.should.eql(success)

  t.pass()
})
  
test('test deserialization where it should deserialize a result of null', function(t) {
  var success = {
    jsonrpc : '2.0',
    id      : 'id',
    result  : null,
  }

  var result = ser.deserialize(JSON.stringify(success))
  delete success.jsonrpc

  result.payload.should.eql(success)

  t.pass()
})

test('test deserialization where it for error object', function (t) {
  var error = {
    jsonrpc : '2.0',
    id      : 'id',
    error   : {}
  }

  var result = ser.deserialize(JSON.stringify(error))
  var object = ser.deserializeObject(error)

  delete error.jsonrpc

  result.type.should.eql('error')
  result.payload.should.eql(error)
  result.should.eql.object

  t.pass()
})
