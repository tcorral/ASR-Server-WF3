/* */ 
var Transform = require('readable-stream/transform'),
    inherits = require('util').inherits,
    xtend = require('xtend');
function noop(chunk, enc, callback) {
  callback(null, chunk);
}
function through2(construct) {
  return function(options, transform, flush) {
    if (typeof options == 'function') {
      flush = transform;
      transform = options;
      options = {};
    }
    if (typeof transform != 'function')
      transform = noop;
    if (typeof flush != 'function')
      flush = null;
    return construct(options, transform, flush);
  };
}
module.exports = through2(function(options, transform, flush) {
  var t2 = new Transform(options);
  t2._transform = transform;
  if (flush)
    t2._flush = flush;
  return t2;
});
module.exports.ctor = through2(function(options, transform, flush) {
  function Through2(override) {
    if (!(this instanceof Through2))
      return new Through2(override);
    this.options = xtend(options, override);
    Transform.call(this, this.options);
  }
  inherits(Through2, Transform);
  Through2.prototype._transform = transform;
  if (flush)
    Through2.prototype._flush = flush;
  return Through2;
});
module.exports.obj = through2(function(options, transform, flush) {
  var t2 = new Transform(xtend({objectMode: true}, options));
  t2._transform = transform;
  if (flush)
    t2._flush = flush;
  return t2;
});
