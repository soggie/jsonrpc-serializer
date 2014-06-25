(function () { 'use strict';

  var should, jrs;

  should = require('should');
  jrs    = require('../lib/jrs');

  describe('# serializer test suite', function () {

    describe('test request serialization', function () {
      describe('for invalid parameters', function () {
        var result = jrs.request();

        it('should return an error object', function () {
          result.should.be.an.Array;
          result.should.containEql('An ID must be provided. It must be either a string or an integer (no fractions allowed)');
          result.should.containEql('Method should be a string. Received undefined instead');
        });
      });

      describe('for valid parameters', function () {
        var object1, object2, object3, object4, result1, result2, result3, result4;

        object1 = jrs.request('id', 'method');
        object2 = jrs.request('id', 'method', 'params');
        object3 = jrs.request('id', 'method', ['param1', 'param2']);
        object4 = jrs.request('id', 'method', { param : 'foo' });

        result1 = jrs.request('id', 'method').toString();
        result2 = jrs.request('id', 'method', 'params').toString();
        result3 = jrs.request('id', 'method', ['param1', 'param2']).toString();
        result4 = jrs.request('id', 'method', { param : 'foo' }).toString();

        it('should return a serialized string', function () {
          result1.should.be.a.String;
          result2.should.be.a.String;
          result3.should.be.a.String;
          result4.should.be.a.String;
        });

        it('requestObject() should return a equivalent object', function() {
          JSON.parse(result1).should.eql.object1;
          JSON.parse(result2).should.eql.object2;
          JSON.parse(result3).should.eql.object3;
          JSON.parse(result4).should.eql.object4;
        });
      });

    });

    describe('test notificaiton serialization', function () {
      describe('for invalid parameters', function () {
        var result = jrs.notification();

        it('should return an error object', function () {
          result.should.be.an.Array;
          result.should.containEql('Method should be a string. Received undefined instead');
        });
      });

      describe('for valid parameters', function () {
        var result1, result2, result3, result4, object1, object2, object3, object4;

        object1 = jrs.notification('method');
        object2 = jrs.notification('method', 'params');
        object3 = jrs.notification('method', ['param1', 'param2']);
        object4 = jrs.notification('method', { param : 'foo' });
        
        result1 = jrs.notification('method').toString();
        result2 = jrs.notification('method', 'params').toString();
        result3 = jrs.notification('method', ['param1', 'param2']).toString();
        result4 = jrs.notification('method', { param : 'foo' }).toString();

        it('should return a serialized string', function () {
          result1.should.be.a.String;
          result2.should.be.a.String;
          result3.should.be.a.String;
          result4.should.be.a.String;
        });

        it('notificationObject() should return a equivalent object', function() {
          JSON.parse(result1).should.eql.object1;
          JSON.parse(result2).should.eql.object2;
          JSON.parse(result3).should.eql.object3;
          JSON.parse(result4).should.eql.object4;
        });
      });
    });

    describe('test success serialization', function () {
      describe('for invalid parameters', function () {
        var result = jrs.success();

        it('should return an error object', function () {
          result.should.be.an.Array;
          result.should.containEql('An ID must be provided. It must be either a string or an integer (no fractions allowed)');
          result.should.containEql('Result must exist for success Response objects');
        }); 
      });

      describe('for valid parameters', function () {
        var object, result;

        object = jrs.success('id', 'result');
        result = jrs.success('id', 'result').toString();

        it('should return a serialized string', function () {
          result.should.be.a.String;
        });

        it('successObject() should return a equivalent object', function() {
          JSON.parse(result).should.eql.object;
        });

      });
    });

    describe('test error serialization', function () {
      describe('for invalid parameters', function () {
        var result1, result2;

        result1 = jrs.error();
        result2 = jrs.error('id', {});

        it('for 1 - should return an error object', function () {
          result1.should.be.an.Array;
          result1.should.containEql('An ID must be provided. It must be either a string or an integer (no fractions allowed)');
          result1.should.containEql('Error must be an object conforming to the JSON-RPC 2.0 error object specs');
        });

        it('for 2 - should return an error object', function () {
          result2.should.be.an.Array;
          result2.should.containEql('Error must be an instance of JsonRpcError, or any derivatives of it');
        });
      });

      describe('for valid parameters', function () {
        var object1, object2, object3, object4, object5, 
            result1, result2, result3, result4, result5;

        object1 = jrs.error('id', new jrs.err.JsonRpcError('Crazy error'));
        object2 = jrs.error('id', new jrs.err.ParseError());
        object3 = jrs.error('id', new jrs.err.InvalidRequestError());
        object4 = jrs.error('id', new jrs.err.MethodNotFoundError());
        object5 = jrs.error('id', new jrs.err.InvalidParamsError());

        result1 = jrs.error('id', new jrs.err.JsonRpcError('Crazy error')).toString();
        result2 = jrs.error('id', new jrs.err.ParseError()).toString();
        result3 = jrs.error('id', new jrs.err.InvalidRequestError()).toString();
        result4 = jrs.error('id', new jrs.err.MethodNotFoundError()).toString();
        result5 = jrs.error('id', new jrs.err.InvalidParamsError()).toString();

        it('should return a serialized string', function () {
          result1.should.be.a.String;
          result2.should.be.a.String;
          result3.should.be.a.String;
          result4.should.be.a.String;
          result5.should.be.a.String;
        });

        it('errorObject() should return a equivalent object', function() {
          JSON.parse(result1).should.eql.object1;
          JSON.parse(result2).should.eql.object2;
          JSON.parse(result3).should.eql.object3;
          JSON.parse(result4).should.eql.object4;
          JSON.parse(result5).should.eql.object5;
        });
      });
    });

  });

}).call(this);