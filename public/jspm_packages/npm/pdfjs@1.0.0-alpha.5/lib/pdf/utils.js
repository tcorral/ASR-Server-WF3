/* */ 
(function(Buffer) {
  exports.inherits = function(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {constructor: {
        value: ctor,
        enumerable: false
      }});
  };
  exports.toHex = function(n) {
    if (n < 16)
      return '0' + n.toString(16);
    return n.toString(16);
  };
  exports.asHex = function(ab) {
    var view = new Uint8Array(ab),
        hex = '';
    for (var i = 0,
        len = ab.byteLength; i < len; ++i) {
      hex += exports.toHex(view[i]);
    }
    return hex;
  };
  exports.toArrayBuffer = function(buf) {
    var isArrayBuffer = buf instanceof ArrayBuffer;
    var isBuffer = typeof GLOBAL !== 'undefined' && buf instanceof GLOBAL[('Buffer').toString()];
    if (!isArrayBuffer && !isBuffer) {
      throw new TypeError('Data must be provided as either Buffer or Arraybuffer.');
    }
    if (buf instanceof ArrayBuffer) {
      return buf;
    }
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
    }
    return ab;
  };
  exports.uint8ToString = function(u8a) {
    var CHUNK_SZ = 0x8000;
    var c = [];
    for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
    }
    return c.join('');
  };
  exports.formatDate = function(date) {
    var str = 'D:' + date.getFullYear() + ('00' + (date.getMonth() + 1)).slice(-2) + ('00' + date.getDate()).slice(-2) + ('00' + date.getHours()).slice(-2) + ('00' + date.getMinutes()).slice(-2) + ('00' + date.getSeconds()).slice(-2);
    var offset = date.getTimezoneOffset();
    var rel = offset === 0 ? 'Z' : (offset > 0 ? '-' : '+');
    offset = Math.abs(offset);
    var hoursOffset = Math.floor(offset / 60);
    var minutesOffset = offset - hoursOffset * 60;
    str += rel + ('00' + hoursOffset).slice(-2) + '\'' + ('00' + minutesOffset).slice(-2) + '\'';
    return str;
  };
  exports.colorToRgb = function(hex) {
    if (typeof hex === 'string') {
      hex = parseInt(hex.replace('#', ''), 16);
    }
    var r = (hex >> 16) / 255;
    var g = ((hex >> 8) & 255) / 255;
    var b = (hex & 255) / 255;
    return [r, g, b];
  };
  exports.isRelative = function(n) {
    if (typeof n === 'number') {
      return false;
    }
    return String(n).indexOf('%') > -1;
  };
  exports.resolveWidth = function(width, maxWidth) {
    if (!width) {
      return maxWidth;
    }
    var isRelative = exports.isRelative(width);
    width = parseFloat(width);
    if (isRelative) {
      if (width >= 100)
        return maxWidth;
      return (width / 100) * maxWidth;
    } else {
      if (width > maxWidth)
        return maxWidth;
      else
        return width;
    }
  };
})(require('buffer').Buffer);
