(function () { 'use strict';

var util, JsonRpcError, ParseError, InvalidRequestError, MethodNotFoundError, InvalidParamsError;

util = require('util');

// Add a serialize() method to the prototype chain to ensure that the
// serialization happens properly
JsonRpcError = function JsonRpcError(msg) {
    this.name    = 'JsonRpcError';
    this.code    = -32603;
    this.message = msg;
    this.data    = Array.prototype.slice.call(arguments).splice();
};

JsonRpcError.prototype.serialize = function serialize() {
    return JSON.stringify({
        name    : this.name,
        message : this.message,
        code    : this.code,
        data    : this.data
    });
}

ParseError = function ParseError() { 
    this.name    = 'ParseError';
    this.message = 'Unable to parse payload as a JSON.';
    this.code    = -32700;
    this.data    = Array.prototype.slice.call(arguments).splice();
};

InvalidRequestError = function InvalidRequestError() {
    this.name    = 'InvalidRequestError';
    this.message = 'The request object is not a valid JSON-RPC 2.0 object.';
    this.code    = -32600;
    this.data    = Array.prototype.slice.call(arguments).splice();
};

MethodNotFoundError = function MethodNotFoundError() {
    this.name    = 'MethodNotFoundError';
    this.message = 'The JSON-RPC method does not exist, or is an invalid one.';
    this.code    = -32601;
    this.data    = Array.prototype.slice.call(arguments).splice();
};

InvalidParamsError  = function InvalidParamsError() {
    this.name    = 'InvalidParamsError';
    this.message = 'The JSON-RPC method\'s parameters are invalid.';
    this.code    = -32602;
    this.data    = Array.prototype.slice.call(arguments).splice();
};

util.inherits(JsonRpcError, Error);
util.inherits(ParseError, JsonRpcError);
util.inherits(InvalidRequestError, JsonRpcError);
util.inherits(MethodNotFoundError, JsonRpcError);
util.inherits(InvalidParamsError, JsonRpcError);

module.exports = {
    JsonRpcError        : JsonRpcError,
    ParseError          : ParseError,
    InvalidRequestError : InvalidRequestError,
    MethodNotFoundError : MethodNotFoundError,
    InvalidParamsError  : InvalidParamsError  
};

})();
