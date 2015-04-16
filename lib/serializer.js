(function () { 'use strict';

var exception, jsonrpc, util;

util      = require('util');
exception = require('./exceptions');

var isString = function(obj) {
    return typeof(obj) == 'string';
}

var isNumber = function(obj) {
    return typeof(obj) == 'number';
}

var isObject = function(obj) {
    return typeof(obj) == 'object';
}

var isNull = function(obj) {
    return obj === null;
}

var isArray = function(obj) {
    return Array.isArray(obj);
}

function _validateMessageStructure(type, data) {
    var errors, id;

    errors = [];

    function checkId(id) {
        if (!isString(id) && (!isNumber(id) || (isNumber(id) && id % 1 !== 0))) {
            errors.push('An ID must be provided. It must be either a string or an integer (no fractions allowed)');
        }
    }

    function checkErrorId(id) {
        if (!isNull(id) && !isString(id) && (!isNumber(id) || (isNumber(id) && id % 1 !== 0))) {
            errors.push('An ID must be provided. It must be either a string or an integer (no fractions allowed)');
        }
    }

    function checkMethod(method) {
        if (!isString(data.method)) {
            errors.push('Method should be a string. Received ' + typeof data.method + ' instead');
        }
    }

    function checkResult(result) {
        if (undefined === result) {
            errors.push('Result must exist for success Response objects');
        }
    }

    function checkError(error) {
        var code, message;

        if (!isObject(error)) {
            errors.push('Error must be an object conforming to the JSON-RPC 2.0 error object specs');
            return;
        }

        if (!(error instanceof jsonrpc.err.JsonRpcError)) {
            errors.push('Error must be an instance of JsonRpcError, or any derivatives of it');
            return;
        }

        code    = error.code;
        message = error.message;

        if (!isNumber(code) && (isNumber(code) && code % 1 !== 0)) {
            errors.push('Invalid error code. It MUST be an integer.');
        }

        if (!isString(message)) {
            errors.push('Message must exist or must be a string.');
        }
    }

    switch (type) {
        case 'request' :
            checkId(data.id);
            checkMethod(data.method);
            break;

        case 'notification' :
            checkMethod(data.method);
            break;

        case 'success' :
            checkId(data.id);
            checkResult(data.result);
            break;

        case 'error' :
            checkErrorId(data.id);
            checkError(data.error);
            break;
    }

    return (errors.length > 0) ? errors : null;
}

module.exports = jsonrpc = {
    err          : exception,       // custom error types
    errorHandler : null,            // custom error handler

    /**
     * Creates a JSON-RPC 2.0 serialized request following this format:
     *
     * **jsonrpc**
     * 
     *     A String specifying the version of the JSON-RPC protocol. MUST be 
     *     exactly "2.0"
     *
     * **id**
     * 
     *     An identifier established by the Client that MUST contain a String, 
     *     Number, or NULL value if included. If it is not included it is 
     *     assumed to be a notification. The value SHOULD normally not be Null 
     *     and Numbers SHOULD NOT contain fractional parts
     *
     * **method**
     * 
     *     A String containing the name of the method to be invoked. Method 
     *     names that begin with the word rpc followed by a period character 
     *     (U+002E or ASCII 46) are reserved for rpc-internal methods and 
     *     extensions and MUST NOT be used for anything else.
     *
     * **params**
     * 
     *     A Structured value that holds the parameter values to be used during
     *     the invocation of the method. This member MAY be omitted. If
     *     resent, parameters for the rpc call MUST be provided as a Structured 
     *     value. Either by-position through an Array or by-name through an 
     *     Object.
     *
     *     by-position: params MUST be an Array, containing the values in the 
     *                  Server expected order.
     *
     *     by-name:     params MUST be an Object, with member names that match 
     *                  the Server expected parameter names. The absence of 
     *                  expected names MAY result in an error being generated. 
     *                  The names MUST match exactly, including case, to the 
     *                  method's expected parameters.
     * 
     * @param  {String} id        
     * @param  {String} method       
     * @param  {Object|Array} params 
     * @return {String} serialized version of the request object
     */
    request : function (id, method, params) {
        // Make sure params is either an array or object
        if (params && !isObject(params) && !isArray(params)) {
            params = [params];
        }

        var errors = _validateMessageStructure('request', {
            id     : id,
            method : method,
            params : params
        });

        if (errors) {
            if (this.errorHandler) {
                this.errorHandler(errors);
            }

            return errors;
        }

        return JSON.stringify(this.requestObject(id, method, params));
    },

    /**
     * Creates a JSON-RPC 2.0 request object. 
     *
     * @param  {String} id        
     * @param  {String} method       
     * @param  {Object|Array} params 
     * @return {Object} request object
     */
    requestObject : function (id, method, params) {
        var req = { 
            jsonrpc : '2.0',
            id      : id,
            method  : method
        };

        if (params) {
            req.params = params;
        }

        return req;
    },


    /**
     * Creates a JSON-RPC 2.0 serialized notification following this format:
     *
     * **jsonrpc**
     * 
     *     A String specifying the version of the JSON-RPC protocol. MUST be 
     *     exactly "2.0"
     *
     * **method**
     * 
     *     A String containing the name of the method to be invoked. Method 
     *     names that begin with the word rpc followed by a period character 
     *     (U+002E or ASCII 46) are reserved for rpc-internal methods and 
     *     extensions and MUST NOT be used for anything else.
     *
     * **params**
     * 
     *     A Structured value that holds the parameter values to be used during
     *     the invocation of the method. This member MAY be omitted. If
     *     resent, parameters for the rpc call MUST be provided as a Structured 
     *     value. Either by-position through an Array or by-name through an 
     *     Object.
     *
     *     by-position: params MUST be an Array, containing the values in the 
     *                  Server expected order.
     *
     *     by-name:     params MUST be an Object, with member names that match 
     *                  the Server expected parameter names. The absence of 
     *                  expected names MAY result in an error being generated. 
     *                  The names MUST match exactly, including case, to the 
     *                  method's expected parameters.
     * 
     * @param  {String} method       
     * @param  {Object|Array} params 
     * @return {String} serialized version of the notification object
     */
    notification : function (method, params) {
        var errors = _validateMessageStructure('notification', {
            method : method,
            params : params
        });

        if (errors) {
            if (this.errorHandler) {
                this.errorHandler(errors);
            }

            return errors;
        }

        return JSON.stringify(this.notificationObject(method, params));
    },

    /**
     * Creates a JSON-RPC 2.0 notification object. 
     *
     * @param  {String} method       
     * @param  {Object|Array} params 
     * @return {Object} notification object
     */
    notificationObject : function (method, params) {      
        var notification = { 
            jsonrpc : '2.0',
            method  : method
        };

        if (params) {
            notification.params = params;
        }

        return notification;
    },

    /**
     * Creates a JSON-RPC 2.0 serialized success response following this
     * format:
     *
     * **jsonrpc**
     * 
     *     A String specifying the version of the JSON-RPC protocol. MUST be 
     *     exactly "2.0"
     *
     * **id**
     *
     *     This member is REQUIRED. It MUST be the same as the value of the id 
     *     member in the Request Object. If there was an error in detecting the 
     *     id in the Request object (e.g. Parse error/Invalid Request), it MUST 
     *     be Null.
     *
     * **result**
     *
     *     This member is REQUIRED on success. This member MUST NOT exist if 
     *     there was an error invoking the method. The value of this member is 
     *     determined by the method invoked on the Server.
     * 
     * @param  {String} id    
     * @param  {Mixed} result
     * @return {String} serialized version of this response object
     */
    success : function (id, result) {
        var errors = _validateMessageStructure('success', {
            id     : id,
            result : result
        });

        if (errors) {
            if (this.errorHandler) {
                this.errorHandler(errors);
            }

            return errors;
        }

        return JSON.stringify(this.successObject(id, result));
    },

    /**
     * Creates a JSON-RPC 2.0 success response object. 
     *
     * @param  {String} id    
     * @param  {Mixed} result
     * @return {Object} success response object
     */
    successObject : function (id, result) {
        var success = { 
            jsonrpc : '2.0',
            id      : id,
            result  : result
        };

        return success;
    },

    /**
     * Creates a JSON-RPC 2.0 serialized error response following this
     * format:
     *
     * **jsonrpc**
     * 
     *     A String specifying the version of the JSON-RPC protocol. MUST be 
     *     exactly "2.0"
     *
     * **id**
     *
     *     This member is REQUIRED. It MUST be the same as the value of the id 
     *     member in the Request Object. If there was an error in detecting the 
     *     id in the Request object (e.g. Parse error/Invalid Request), it MUST 
     *     be Null.
     *
     * **error**
     *
     *     This member is REQUIRED on error. This member MUST NOT exist if 
     *     there was no error triggered during invocation. The value for this 
     *     member MUST be an Object as defined in section 5.1.
     *
     *     **code**
     *     
     *         A Number that indicates the error type that occurred. This MUST 
     *         be an integer.
     *         
     *     **message**
     *
     *         A String providing a short description of the error. The message 
     *         SHOULD be limited to a concise single sentence.
     *
     *     **data**
     *     
     *         A Primitive or Structured value that contains additional 
     *         information about the error. This may be omitted. The value of 
     *         this member is defined by the Server (e.g. detailed error 
     *         information, nested errors etc.).
     * 
     * @param  {String} id    
     * @param  {Mixed} error
     * @return {String} serialized version of this response object
     */
    error : function (id, error) {
        var errors = _validateMessageStructure('error', {
            id    : id,
            error : error
        });

        if (errors) {
            if (this.errorHandler) {
                this.errorHandler(errors);
            }

            return errors;
        }

        return JSON.stringify(this.errorObject(id, error));
    },

    /**
     * Creates a JSON-RPC 2.0 success response object. 
     *
     * @param  {String} id    
     * @param  {Mixed} error
     * @return {Object} error response object
     */
    errorObject : function (id, error) {
        var error = {
            jsonrpc : '2.0',
            id      : id,
            error   : error
        };

        return error;
    },

    /**
     * Takes a JSON-RPC 2.0 payload (string) and tries to parse it into a JSON.
     * If successful, determine what object is it (response, notification, 
     * success, or failure), and return its type and properly formatted object.
     * 
     * @param  {String} msg
     * @return {Object} an object of this format:
     *
     *  {
     *      type    : <Enum, request|notification|success|error>
     *      payload : <Object>
     *  }
     */
    deserialize : function (msg) {
        var obj;

        try {
            obj = JSON.parse(msg);
        } catch(err) {
            if (this.errorHandler) {
                this.errorHandler(msg);
            }

            return new jsonrpc.err.ParseError(msg);
        }

        return this.deserializeObject(obj);
    },

    /**
     * Takes a JSON-RPC 2.0 payload (object) and tries to parse it into a JSON.
     * If successful, determine what object is it (response, notification, 
     * success, or failure), and return its type and properly formatted object.
     * 
     * @param  {Object} obj
     * @return {Object} an object of this format:
     *
     *  {
     *      type    : <Enum, request|notification|success|error>
     *      payload : <Object>
     *  }
     */
    deserializeObject : function (obj) {
        // Check for jsonrpc
        if (obj.jsonrpc !== '2.0') {
            if (this.errorHandler) {
                this.errorHandler(obj);
            }

            return new jsonrpc.err.InvalidRequestError(obj);
        }

        // Check if it is a notification
        if (obj.id === void 0) {
            return {
                type    : 'notification',
                payload : {
                    method : obj.method,
                    params : obj.params
                }
            }
        }

        // Check if it is a request
        if (isString(obj.method)) {
            return {
                type    : 'request',
                payload : {
                    id     : obj.id,
                    method : obj.method,
                    params : obj.params
                }
            }
        }

        // Check if it is a success
        if (obj.hasOwnProperty('result')) {
            return {
                type    : 'success',
                payload : {
                    id     : obj.id,
                    result : obj.result
                }
            }
        }

        // Check if it is an error
        if (obj.error) {
            return {
                type    : 'error',
                payload : {
                    id    : obj.id,
                    error : obj.error
                }
            }
        }

        // Not sure what the fuck this is
        if (this.errorHandler) {
            this.errorHandler(obj);
        }

        return new jsonrpc.err.InvalidRequestError(obj);
    }
};
    
})();
