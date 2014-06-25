(function () { 'use strict';

  var isString, isNumber, isObject, isArray;

  function isString(obj) {
    return (typeof obj === 'string');
  }

  function isNumber(obj) {
    return (typeof obj === 'number');
  }

  function isObject(obj) {
    return (typeof obj === 'object');
  }

  function isArray(obj) {
    return Array.isArray(obj);
  }

  module.exports = {
    isString : isString,
    isNumber : isNumber,
    isObject : isObject,
    isArray  : isArray
  };

}).call(this);