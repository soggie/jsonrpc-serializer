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

## jrs.request( <id>, <method>, <params> ) --> <string>

Serializes a request message. It takes 3 arguments: `id` which takes a string or integer ID, `method` which takes a string referring to the name of the RPC method to call, and `params` which is optional, but can either be (1) a single value of any type except array or object; (2) an array of params; or (3) an key-value object.

### jrs.notification( <method>, <params> ) --> <string>

--todo--

### jrs.success( <id>, <result> ) --> <string>

--todo--

### jrs.error( <id>, <error> ) --> <string>

--todo--

### jrs.deserialize( <msg> ) --> <object>

--todo--

### jrs.err.JsonRpcError( <msg> )

--todo--

### jrs.err.ParseError( <data> )

--todo--

### jrs.err.InvalidRequestError( <data> )

--todo--

### jrs.err.MethodNotFoundError( <data> )

--todo--

### jrs.err.InvalidParamsError( <data> )

--todo--

## License

Copyright (c) 2013 Ruben LZ Tan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.