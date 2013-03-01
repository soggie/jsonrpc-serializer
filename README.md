[![Build Status](https://secure.travis-ci.org/soggie/jsonrpc-serializer.png)](http://travis-ci.org/soggie/jsonrpc-serializer)

# JSON-RPC serializer

This is a simple library to perform serialization/deserialization of JSON-RPC 2.0 messages. It has full support for Date and Error objects, comforms to the [JSON-RPC 2.0 specifications](http://jsonrpc.org/specification), and allows plugins (in the near future) to extend the library.

## Why?

JSON-RPC 2.0 is transport agnostic, but unfortunately this is not the case for most JSON-RPC modules in the NPM. Thus, when I needed a library to use JSON-RPC 2.0 over hook.io and 0MQ, I ran into a brick wall, and ended up writing this library.

It's small. It's simple. And I hope this will be useful to you as well.

## How to install?

    npm install jsonrpc-serializer

## How to use?

    var jrs = require('jsonrpc-serializer');

    var request = jrs.request('request-id', 'request-method');

    // ---> "{\"jsonrpc\":\"2.0\",\"id\":\"request-id\",\"method:\":\"request-method\"}"

    var ok = "{\"jsonrpc\":\"2.0\",\"id\":\"request-id\",\"result\":\"success!!\"}";

    var response = jrs.deserialize(ok);

    // ---> 
    //  {
    //      type    : 'success',
    //      payload : {
    //          id     : 'request-id',
    //          result : 'success!!'
    //      }
    //  }

## That was too fast... can I haz API reference plz?

The library works on serializing objects to JSON-RPC 2.0 (henceforth known as JR2) messages, and deserializing them back. There are 4 different kinds of objects that can be serialized: `request`, `notification`, `success` and `error` ([JSON-RPC 2.0 Specs](http://www.jsonrpc.org/specification)).

### jrs.request( id, method, params ) --> string

Serializes a request message. It takes 3 arguments: `id` which takes a string or integer ID, `method` which takes a string referring to the name of the RPC method to call, and `params` which is optional, but can either be (1) a single value of any type except array or object; (2) an array of params; or (3) a key-value object.

* **id** (_required_, _string_ or _integer_) - the ID to attach to this JSON-RPC message
* **method** (_required_, _string_) - the method to invoke on the server side
* **params** (_optional_, _string_, _object_ or _array_) - parameters to pass into the method on the server side

### jrs.notification( method, params ) --> string

Serializes a notification message. A notification message is the same as a `request` message, with the only difference being that it does not contain an `id` field, and thus does not expect a reply from the server. This also exempts notifications from receiving errors if any.

* **method** (_required_, _string_) - the method to invoke on the server side
* **params** (_string_, _object_ or _array_) - parameters to pass into the method on the server side

### jrs.success( id, result ) --> string

Serializes a success message. This is usually used on the server side to send results back to the client after receiving the RPC method call. It consists of an `id` and a `result` field.

* **id** (_required_, _string_ or _integer_) - the ID to attach to this JSON-RPC message
* **result** (_required_, _mixed_) - the results to pass back to the client. This can be anything: number, string, null, boolean, undefined, object, etc

### jrs.error( id, error ) --> string

Serializes an error message. This is the same as the success message, except instead of `result` we have `error`. The `error` field MUST be an object, and it MUST conform to the `error` object spec mentioned in the JSON-RPC 2.0 Specs.

See the [specs](http://www.jsonrpc.org/specification) for the exact format for error objects, but for the convenience of developers using this module, I've abstracted the defined ones into a few classes:

| Namespace | Code | Description |
|-----------|------|-------------|
| `jrs.err.JsonRpcError( msg )` | `-32603` | This is the base class for all the other custom RPC error objects. Please note that when integrating this module, make sure to derive from this base class if you want to create more custom errors. This will ensure that all serialization of error objects are consistent. |
| `jrs.err.ParseError( ... )` | `-32700` | This is thrown when the deserializer fails to recognize the message as a proper JSON entity. |
| `jrs.err.InvalidRequestError( ... )` | `-32600` | This is thrown when the deserializer successfully parses the message into JSON, but realizes it is not a proper JSON-RPC 2.0 message.
| `jrs.err.MethodNotFoundError( ... )` | `-32601` | This is what you use when the required method is not found. |
| `jrs.err.InvalidParamsError( ... )` | `-32602` | This is what you use when the parameters provided is not compatible with the methods being invoked |

### jrs.deserialize( msg ) --> object

This method takes a message in `msg`, parses it, and tries to figure out which of the four JSON-RPC 2.0 objects it is: `request`, `notification`, `success` or `error`. If it cannot figure out, or the message is faulty, it will instead return an appropriate instance (or child instance) of `JsonRpcError`.

The object returned if successful looks like this:

    {
        type    : 'request',
        payload : {
            id     : 'id',
            method : 'method'
        }
    }
    
Where `type` is one of the four types (request, notification, success or error) and `payload` is the actual JSON-RPC message in JSON format itself, with the property `jsonrpc="2.0"` removed.

### jrs.err.JsonRpcError( msg )

The message in `msg` is appended to the internal data structure as `message`:

    var err = new jrs.err.JsonRpcError('This is an error');
    var str = err.serialize();
    
    //  str = {
    //      code    : -32603,
    //      message : 'This is an error',
    //      name    : 'JsonRpcError',
    //      data    : ['This is an error']
    //  };

### jrs.err.ParseError( … )

### jrs.err.InvalidRequestError( … )

### jrs.err.MethodNotFoundError( ... )

### jrs.err.InvalidParamsError( ... )

Since all four of these errors are the same, I'll go through them together. They are essentially the same format as `JsonRpcError`, with the right `serialize()` method, but the difference is that the `message` property is fixed. Therefore, any params passed in the constructor will be saved into an array inside the `data` property, instead of changing the `message` property itself. Here's an example:

    var err = new jrs.err.ParseError('This is an error');
    var str = err.serialize();
    
    //  str = {
    //      code    : -32700,
    //      message : 'Unable to parse payload as a JSON.',
    //      name    : 'ParseError',
    //      data    : ['This is an error']
    //  };

## License

Copyright (c) 2013 Ruben LZ Tan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.