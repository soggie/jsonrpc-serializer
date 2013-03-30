Object.prototype.isString = function(obj) {
  return typeof(obj) == 'string';
}
Object.prototype.isNumber = function(obj) {
  return typeof(obj) == 'number';
}
Object.prototype.isObject = function(obj) {
  return typeof(obj) == 'object';
}
Object.prototype.isArray = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}
