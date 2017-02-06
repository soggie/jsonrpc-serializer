const inherits = require('inherits')

// Add a serialize() method to the prototype chain to ensure that the
// serialization happens properly
const JsonRpcError = function JsonRpcError(msg) {
  this.name      = 'JsonRpcError'
  this.code      = -32603
  this.message   = msg
  this.data      = Array.prototype.slice.call(arguments).splice(1)
}

JsonRpcError.prototype.serialize = function serialize() {
  return JSON.stringify({
    name    : this.name,
    message : this.message,
    code    : this.code,
    data    : this.data
  });
}

const ParseError = function ParseError() { 
  this.name    = 'ParseError'
  this.message = 'Unable to parse payload as a JSON.'
  this.code    = -32700
  this.data    = Array.prototype.slice.call(arguments).splice(0)
}

const InvalidRequestError = function InvalidRequestError() {
  this.name    = 'InvalidRequestError'
  this.message = 'The request object is not a valid JSON-RPC 2.0 object.'
  this.code    = -32600
  this.data    = Array.prototype.slice.call(arguments).splice(0)
}

const MethodNotFoundError = function MethodNotFoundError() {
  this.name    = 'MethodNotFoundError'
  this.message = 'The JSON-RPC method does not exist, or is an invalid one.'
  this.code    = -32601
  this.data    = Array.prototype.slice.call(arguments).splice(0)
}

const InvalidParamsError = function InvalidParamsError() {
  this.name    = 'InvalidParamsError'
  this.message = 'The JSON-RPC method\'s parameters are invalid.'
  this.code    = -32602
  this.data    = Array.prototype.slice.call(arguments).splice(0)
}

inherits(JsonRpcError, Error)
inherits(ParseError, JsonRpcError)
inherits(InvalidRequestError, JsonRpcError)
inherits(MethodNotFoundError, JsonRpcError)
inherits(InvalidParamsError, JsonRpcError)

module.exports = {
  JsonRpcError        : JsonRpcError,
  ParseError          : ParseError,
  InvalidRequestError : InvalidRequestError,
  MethodNotFoundError : MethodNotFoundError,
  InvalidParamsError  : InvalidParamsError  
}
