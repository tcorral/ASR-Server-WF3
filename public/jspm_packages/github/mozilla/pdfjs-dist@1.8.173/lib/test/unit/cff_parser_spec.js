/* */ 
"format amd";
/* Copyright 2017 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var coreCFFParser = require('../../core/cff_parser.js');
var coreFonts = require('../../core/fonts.js');
var coreStream = require('../../core/stream.js');
var CFFParser = coreCFFParser.CFFParser;
var CFFIndex = coreCFFParser.CFFIndex;
var CFFStrings = coreCFFParser.CFFStrings;
var CFFCompiler = coreCFFParser.CFFCompiler;
var SEAC_ANALYSIS_ENABLED = coreFonts.SEAC_ANALYSIS_ENABLED;
var Stream = coreStream.Stream;
describe('CFFParser', function () {
  function createWithNullProto(obj) {
    var result = Object.create(null);
    for (var i in obj) {
      result[i] = obj[i];
    }
    return result;
  }
  var fontData, parser, cff;
  beforeAll(function (done) {
    var exampleFont = '0100040100010101134142434445462b' + '54696d65732d526f6d616e000101011f' + 'f81b00f81c02f81d03f819041c6f000d' + 'fb3cfb6efa7cfa1605e911b8f1120003' + '01010813183030312e30303754696d65' + '7320526f6d616e54696d657300000002' + '010102030e0e7d99f92a99fb7695f773' + '8b06f79a93fc7c8c077d99f85695f75e' + '9908fb6e8cf87393f7108b09a70adf0b' + 'f78e14';
    var fontArr = [];
    for (var i = 0, ii = exampleFont.length; i < ii; i += 2) {
      var hex = exampleFont.substr(i, 2);
      fontArr.push(parseInt(hex, 16));
    }
    fontData = new Stream(fontArr);
    done();
  });
  afterAll(function () {
    fontData = null;
  });
  beforeEach(function (done) {
    parser = new CFFParser(fontData, {}, SEAC_ANALYSIS_ENABLED);
    cff = parser.parse();
    done();
  });
  afterEach(function (done) {
    parser = cff = null;
    done();
  });
  it('parses header', function () {
    var header = cff.header;
    expect(header.major).toEqual(1);
    expect(header.minor).toEqual(0);
    expect(header.hdrSize).toEqual(4);
    expect(header.offSize).toEqual(1);
  });
  it('parses name index', function () {
    var names = cff.names;
    expect(names.length).toEqual(1);
    expect(names[0]).toEqual('ABCDEF+Times-Roman');
  });
  it('sanitizes name index', function () {
    var index = new CFFIndex();
    index.add(['['.charCodeAt(0), 'a'.charCodeAt(0)]);
    var names = parser.parseNameIndex(index);
    expect(names).toEqual(['_a']);
    index = new CFFIndex();
    var longName = [];
    for (var i = 0; i < 129; i++) {
      longName.push(0);
    }
    index.add(longName);
    names = parser.parseNameIndex(index);
    expect(names[0].length).toEqual(127);
  });
  it('parses string index', function () {
    var strings = cff.strings;
    expect(strings.count).toEqual(3);
    expect(strings.get(0)).toEqual('.notdef');
    expect(strings.get(391)).toEqual('001.007');
  });
  it('parses top dict', function () {
    var topDict = cff.topDict;
    expect(topDict.getByName('version')).toEqual(391);
    expect(topDict.getByName('FullName')).toEqual(392);
    expect(topDict.getByName('FamilyName')).toEqual(393);
    expect(topDict.getByName('Weight')).toEqual(389);
    expect(topDict.getByName('UniqueID')).toEqual(28416);
    expect(topDict.getByName('FontBBox')).toEqual([-168, -218, 1000, 898]);
    expect(topDict.getByName('CharStrings')).toEqual(94);
    expect(topDict.getByName('Private')).toEqual([45, 102]);
  });
  it('refuses to add topDict key with invalid value (bug 1068432)', function () {
    var topDict = cff.topDict;
    var defaultValue = topDict.getByName('UnderlinePosition');
    topDict.setByKey(3075, [NaN]);
    expect(topDict.getByName('UnderlinePosition')).toEqual(defaultValue);
  });
  it('ignores reserved commands in parseDict, and refuses to add privateDict ' + 'keys with invalid values (bug 1308536)', function () {
    var bytes = new Uint8Array([64, 39, 31, 30, 252, 114, 137, 115, 79, 30, 197, 119, 2, 99, 127, 6]);
    parser.bytes = bytes;
    var topDict = cff.topDict;
    topDict.setByName('Private', [bytes.length, 0]);
    var parsePrivateDict = function () {
      parser.parsePrivateDict(topDict);
    };
    expect(parsePrivateDict).not.toThrow();
    var privateDict = topDict.privateDict;
    expect(privateDict.getByName('BlueValues')).toBeNull();
  });
  it('parses a CharString having cntrmask', function () {
    var bytes = new Uint8Array([0, 1, 1, 0, 38, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 1, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 3, 20, 22, 22, 14]);
    parser.bytes = bytes;
    var charStringsIndex = parser.parseIndex(0).obj;
    var charStrings = parser.parseCharStrings(charStringsIndex).charStrings;
    expect(charStrings.count).toEqual(1);
    expect(charStrings.get(0).length).toEqual(38);
  });
  it('parses a CharString endchar with 4 args w/seac enabled', function () {
    var parser = new CFFParser(fontData, {}, true);
    parser.parse();
    var bytes = new Uint8Array([0, 1, 1, 0, 237, 247, 22, 247, 72, 204, 247, 86, 14]);
    parser.bytes = bytes;
    var charStringsIndex = parser.parseIndex(0).obj;
    var result = parser.parseCharStrings(charStringsIndex);
    expect(result.charStrings.count).toEqual(1);
    expect(result.charStrings.get(0).length).toEqual(1);
    expect(result.seacs.length).toEqual(1);
    expect(result.seacs[0].length).toEqual(4);
    expect(result.seacs[0][0]).toEqual(130);
    expect(result.seacs[0][1]).toEqual(180);
    expect(result.seacs[0][2]).toEqual(65);
    expect(result.seacs[0][3]).toEqual(194);
  });
  it('parses a CharString endchar with 4 args w/seac disabled', function () {
    var parser = new CFFParser(fontData, {}, false);
    parser.parse();
    var bytes = new Uint8Array([0, 1, 1, 0, 237, 247, 22, 247, 72, 204, 247, 86, 14]);
    parser.bytes = bytes;
    var charStringsIndex = parser.parseIndex(0).obj;
    var result = parser.parseCharStrings(charStringsIndex);
    expect(result.charStrings.count).toEqual(1);
    expect(result.charStrings.get(0).length).toEqual(9);
    expect(result.seacs.length).toEqual(0);
  });
  it('parses a CharString endchar no args', function () {
    var bytes = new Uint8Array([0, 1, 1, 0, 14]);
    parser.bytes = bytes;
    var charStringsIndex = parser.parseIndex(0).obj;
    var result = parser.parseCharStrings(charStringsIndex);
    expect(result.charStrings.count).toEqual(1);
    expect(result.charStrings.get(0)[0]).toEqual(14);
    expect(result.seacs.length).toEqual(0);
  });
  it('parses predefined charsets', function () {
    var charset = parser.parseCharsets(0, 0, null, true);
    expect(charset.predefined).toEqual(true);
  });
  it('parses charset format 0', function () {
    var bytes = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x02]);
    parser.bytes = bytes;
    var charset = parser.parseCharsets(3, 2, new CFFStrings(), false);
    expect(charset.charset[1]).toEqual('exclam');
    charset = parser.parseCharsets(3, 2, new CFFStrings(), true);
    expect(charset.charset[1]).toEqual(2);
  });
  it('parses charset format 1', function () {
    var bytes = new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x00, 0x08, 0x01]);
    parser.bytes = bytes;
    var charset = parser.parseCharsets(3, 2, new CFFStrings(), false);
    expect(charset.charset).toEqual(['.notdef', 'quoteright', 'parenleft']);
    charset = parser.parseCharsets(3, 2, new CFFStrings(), true);
    expect(charset.charset).toEqual(['.notdef', 8, 9]);
  });
  it('parses charset format 2', function () {
    var bytes = new Uint8Array([0x00, 0x00, 0x00, 0x02, 0x00, 0x08, 0x00, 0x01]);
    parser.bytes = bytes;
    var charset = parser.parseCharsets(3, 2, new CFFStrings(), false);
    expect(charset.charset).toEqual(['.notdef', 'quoteright', 'parenleft']);
    charset = parser.parseCharsets(3, 2, new CFFStrings(), true);
    expect(charset.charset).toEqual(['.notdef', 8, 9]);
  });
  it('parses encoding format 0', function () {
    var bytes = new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x08]);
    parser.bytes = bytes;
    var encoding = parser.parseEncoding(2, {}, new CFFStrings(), null);
    expect(encoding.encoding).toEqual(createWithNullProto({ 0x8: 1 }));
  });
  it('parses encoding format 1', function () {
    var bytes = new Uint8Array([0x00, 0x00, 0x01, 0x01, 0x07, 0x01]);
    parser.bytes = bytes;
    var encoding = parser.parseEncoding(2, {}, new CFFStrings(), null);
    expect(encoding.encoding).toEqual(createWithNullProto({
      0x7: 0x01,
      0x08: 0x02
    }));
  });
  it('parses fdselect format 0', function () {
    var bytes = new Uint8Array([0x00, 0x00, 0x01]);
    parser.bytes = bytes.slice();
    var fdSelect = parser.parseFDSelect(0, 2);
    expect(fdSelect.fdSelect).toEqual([0, 1]);
    expect(fdSelect.raw).toEqual(bytes);
  });
  it('parses fdselect format 3', function () {
    var bytes = new Uint8Array([0x03, 0x00, 0x02, 0x00, 0x00, 0x09, 0x00, 0x02, 0x0a, 0x00, 0x04]);
    parser.bytes = bytes.slice();
    var fdSelect = parser.parseFDSelect(0, 4);
    expect(fdSelect.fdSelect).toEqual([9, 9, 0xa, 0xa]);
    expect(fdSelect.raw).toEqual(bytes);
  });
  it('parses invalid fdselect format 3 (bug 1146106)', function () {
    var bytes = new Uint8Array([0x03, 0x00, 0x02, 0x00, 0x01, 0x09, 0x00, 0x02, 0x0a, 0x00, 0x04]);
    parser.bytes = bytes.slice();
    var fdSelect = parser.parseFDSelect(0, 4);
    expect(fdSelect.fdSelect).toEqual([9, 9, 0xa, 0xa]);
    bytes[3] = bytes[4] = 0x00;
    expect(fdSelect.raw).toEqual(bytes);
  });
});
describe('CFFCompiler', function () {
  it('encodes integers', function () {
    var c = new CFFCompiler();
    expect(c.encodeInteger(0)).toEqual([0x8b]);
    expect(c.encodeInteger(100)).toEqual([0xef]);
    expect(c.encodeInteger(-100)).toEqual([0x27]);
    expect(c.encodeInteger(1000)).toEqual([0xfa, 0x7c]);
    expect(c.encodeInteger(-1000)).toEqual([0xfe, 0x7c]);
    expect(c.encodeInteger(10000)).toEqual([0x1c, 0x27, 0x10]);
    expect(c.encodeInteger(-10000)).toEqual([0x1c, 0xd8, 0xf0]);
    expect(c.encodeInteger(100000)).toEqual([0x1d, 0x00, 0x01, 0x86, 0xa0]);
    expect(c.encodeInteger(-100000)).toEqual([0x1d, 0xff, 0xfe, 0x79, 0x60]);
  });
  it('encodes floats', function () {
    var c = new CFFCompiler();
    expect(c.encodeFloat(-2.25)).toEqual([0x1e, 0xe2, 0xa2, 0x5f]);
    expect(c.encodeFloat(5e-11)).toEqual([0x1e, 0x5c, 0x11, 0xff]);
  });
});