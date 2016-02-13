module.exports={
  'magic': [readMagic, writeMagic, 16],
  'ipAddress': [readIpAddress, writeIpAddress, sizeOfIpAddress],
  'triad': [readTriad, writeTriad, 3],
  'ltriad': [readLTriad, writeLTriad, 3]
};

var tryCatch = require('protodef').utils.tryCatch;
var addErrorField = require('protodef').utils.addErrorField;
var pack = require('./utils/pack');
var unpack = require('./utils/unpack');
var substr = require('./utils/substr');

function readMagic(buffer, offset) {
  return {
    value: '\x00\xff\xff\x00\xfe\xfe\xfe\xfe\xfd\xfd\xfd\xfd\x12\x34\x56\x78',
    size: 16 // i think?
  };
}

function writeMagic(value, buffer, offset) {
  buffer.write('\x00\xff\xff\x00\xfe\xfe\xfe\xfe\xfd\xfd\xfd\xfd\x12\x34\x56\x78');
  return offset + 16; // i think?
}

function readIpAddress(buffer, offset) {
  // $addr = ((~$this->getByte()) & 0xff) .".". ((~$this->getByte()) & 0xff) .".". ((~$this->getByte()) & 0xff) .".". ((~$this->getByte()) & 0xff);

  // TODO
}

function writeIpAddress(value, buffer, offset) {
  // foreach(explode(".", $addr) as $b){
  //   $this->putByte((~((int) $b)) & 0xff);
  // }

  // TODO
}

function sizeOfIpAddress(value) {
  return value.length; // i highly doubt this will work.
}

function readTriad(buffer, offset) {
  //return unpack("N", "\x00" . $str)[1];

  // TODO
}

function writeTriad(value, buffer, offset) {
  return substr(pack("N", value), 1); // i think this works
}

function readLTriad(buffer, offset) {
  // return unpack("V", $str . "\x00")[1];

  // TODO
}

function writeLTriad(value, buffer, offset) {
  return substr(pack("V", value), 0, -1); // i think this works
}