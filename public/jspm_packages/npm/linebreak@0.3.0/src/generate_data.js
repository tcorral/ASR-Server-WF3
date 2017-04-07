/* */ 
(function() {
  var UnicodeTrieBuilder,
      classes,
      fs,
      request;
  fs = require('fs');
  request = require('request');
  classes = require('./classes');
  UnicodeTrieBuilder = require('unicode-trie/builder');
  request('http://www.unicode.org/Public/7.0.0/ucd/LineBreak.txt', function(err, res, data) {
    var end,
        match,
        matches,
        rangeEnd,
        rangeStart,
        rangeType,
        start,
        trie,
        type,
        _i,
        _len;
    matches = data.match(/^[0-9A-F]+(\.\.[0-9A-F]+)?;[A-Z][A-Z0-9]/gm);
    start = null;
    end = null;
    type = null;
    trie = new UnicodeTrieBuilder(classes.XX);
    for (_i = 0, _len = matches.length; _i < _len; _i++) {
      match = matches[_i];
      match = match.split(/;|\.\./);
      rangeStart = match[0];
      if (match.length === 3) {
        rangeEnd = match[1];
        rangeType = match[2];
      } else {
        rangeEnd = rangeStart;
        rangeType = match[1];
      }
      if ((type != null) && rangeType !== type) {
        trie.setRange(parseInt(start, 16), parseInt(end, 16), classes[type], true);
        type = null;
      }
      if (type == null) {
        start = rangeStart;
        type = rangeType;
      }
      end = rangeEnd;
    }
    trie.setRange(parseInt(start, 16), parseInt(end, 16), classes[type], true);
    return fs.writeFile(__dirname + '/classes.trie', trie.toBuffer());
  });
}).call(this);
