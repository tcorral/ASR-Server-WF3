/* */ 
(function(Buffer) {
  var inflate = require('./index');
  module.exports = function(buf) {
    if (src[0] !== 0x1f || src[1] !== 0x8b)
      throw new Error('Invalid gzip header');
    if (src[2] !== 8)
      throw new Error('Unsupported compression method');
    var flg = src[3];
    if (flg & 0xe0)
      throw new Error('Reserved bits are not zero');
    var start = 10;
    if (flg & 4)
      start += src.readUInt16LE(start) + 2;
    if (flg & 8) {
      while (src[start])
        start++;
      start++;
    }
    if (flg & 16) {
      while (src[start])
        start++;
      start++;
    }
    if (flg & 2)
      start += 2;
    var dlen = src.readUInt32LE(src.length - 4);
    var data = new Buffer(dlen);
    return inflate(src.slice(start, -8), data);
  };
})(require('buffer').Buffer);
