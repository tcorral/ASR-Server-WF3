/* */ 
var Objects = [];
exports.parse = function(xref, lexer) {
  if (!Objects.length) {
    Objects.push.apply(Objects, [require('./boolean'), require('./null'), require('./name'), require('./dictionary'), require('./string'), require('./array'), require('./reference'), require('./number')]);
  }
  for (var i = 0; i < Objects.length; ++i) {
    var value = Objects[i].parse(xref, lexer, true);
    if (value !== undefined) {
      return value;
    }
  }
  lexer._error('Invalid value');
  return undefined;
};
