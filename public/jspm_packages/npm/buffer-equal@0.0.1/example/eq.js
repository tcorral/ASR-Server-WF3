/* */ 
(function(Buffer) {
  var bufferEqual = require('../index');
  console.dir(bufferEqual(new Buffer([253, 254, 255]), new Buffer([253, 254, 255])));
  console.dir(bufferEqual(new Buffer('abc'), new Buffer('abcd')));
  console.dir(bufferEqual(new Buffer('abc'), 'abc'));
})(require('buffer').Buffer);
