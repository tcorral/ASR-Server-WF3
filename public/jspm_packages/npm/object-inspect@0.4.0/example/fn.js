/* */ 
var inspect = require('../index');
var obj = [1, 2, function f(n) {
  return n + 5;
}, 4];
console.log(inspect(obj));
