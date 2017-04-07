/* */ 
(function(process) {
  var evaluate = require('../index');
  var parse = require('esprima').parse;
  var src = process.argv.slice(2).join(' ');
  var ast = parse(src).body[0].expression;
  console.log(evaluate(ast));
})(require('process'));
