(function () { 'use strict';

  var should, jrs;

  should = require('should');
  jrs    = require('../lib/jrs');

  describe('test deserialization', function () {
    describe('for invalid parameters', function () {
      var result1, result2;

      result1 = jrs.deserialize();
      result2 = jrs.deserialize(JSON.stringify({ foo : 'bar' }));

      it('for 1 - should return a ParseError', function () {
        result1.should.be.instanceof(jrs.err.ParseError);
      });

      it('for 2 - should return a InvalidRequestError', function () {
        result2.should.be.instanceof(jrs.err.InvalidRequestError);
      });
    });

    describe('for request object', function () {
      var request, result, object;

      request = {
        jsonrpc : '2.0',
        id      : 'id',
        method  : 'method',
        params  : 'params'
      };

      result = jrs.deserialize(JSON.stringify(request));
      object = jrs.deserializeObject(request);

      delete request.jsonrpc;

      it('should return a request object', function () {
        result.type.should.eql('request');
        result.payload.should.eql(request);
      });
      it('deserializeObject() should return a equivalent object', function() {
        result.should.eql.object;
      });
    });

    describe('for notification object', function () {
      var notification, result, object;

      notification = {
        jsonrpc : '2.0',
        method  : 'method',
        params  : 'params'
      };

      result = jrs.deserialize(JSON.stringify(notification));
      object = jrs.deserializeObject(notification);

      delete notification.jsonrpc;

      it('should return a notification object', function () {
        result.type.should.eql('notification');
        result.payload.should.eql(notification);
      });

      it('deserializeObject() should return a equivalent object', function() {
        result.should.eql.object;
      });
    });

    describe('for success object', function () {
      var success, result, object;

      success = {
        jsonrpc : '2.0',
        id      : 'id',
        result  : 'result'
      };

      result = jrs.deserialize(JSON.stringify(success));
      object = jrs.deserializeObject(success);

      delete success.jsonrpc;

      it('should return a success object', function () {
        result.type.should.eql('success');
        result.payload.should.eql(success);
      });

      it('deserializeObject() should return a equivalent object', function() {
        result.should.eql.object;
      });

      it('should deserialize a result of false', function() {
        var success, result;

        success = {
          jsonrpc : '2.0',
          id      : 'id',
          result  : false,
        };
        
        result = jrs.deserialize(JSON.stringify(success));
        delete success.jsonrpc;

        result.payload.should.eql(success);
      });

      it('should deserialize a result of null', function() {
        var success, result;

        success = {
          jsonrpc : '2.0',
          id      : 'id',
          result  : null,
        };
        
        result = jrs.deserialize(JSON.stringify(success));
        delete success.jsonrpc;

        result.payload.should.eql(success);
      });
    });

    describe('for error object', function () {
      var error, result, object;

      error = {
        jsonrpc : '2.0',
        id      : 'id',
        error   : {}
      };

      result = jrs.deserialize(JSON.stringify(error));
      object = jrs.deserializeObject(error);

      delete error.jsonrpc;

      it('should return a error object', function () {
        result.type.should.eql('error');
        result.payload.should.eql(error);
      });

      it('deserializeObject() should return a equivalent object', function() {
        result.should.eql.object;
      });
    });
  });

}).call(this);