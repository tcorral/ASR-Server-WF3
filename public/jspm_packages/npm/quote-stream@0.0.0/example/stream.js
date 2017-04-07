/* */ 
(function(process) {
  var quote = require('../index');
  process.stdin.pipe(quote()).pipe(process.stdout);
})(require('process'));
