var tryCatch = require('protodef').utils.tryCatch;
var addErrorField = require('protodef').utils.addErrorField;

function readMagic(buffer, offset) {
  return {
    value: [0x00, 0xff, 0xff, 0x00, 0xfe, 0xfe, 0xfe, 0xfe, 0xfd, 0xfd, 0xfd, 0xfd, 0x12, 0x34, 0x56, 0x78],
    size: 16
  }
}

function writeMagic(value, buffer, offset) {
  new Buffer([0x00, 0xff, 0xff, 0x00, 0xfe, 0xfe, 0xfe, 0xfe, 0xfd, 0xfd, 0xfd, 0xfd, 0x12, 0x34, 0x56, 0x78]).copy(buffer,offset)
  return offset + 16;
}

function readIpAddress(buffer, offset) {
  var address = buffer[offset] + '.' + buffer[offset+1] + '.' + buffer[offset+2] + '.' + buffer[offset+3]
  return {
    size: 4,
    value: address
  }
}

function writeIpAddress(value, buffer, offset) {
  var address = value.split('.');

  address.forEach(function(b) {
    buffer[offset] = parseInt(b);
    offset++;
  });

  return offset;
}

function writeTriad(value, buffer, offset) {
  buffer[offset] = (value >> 16) & 0xFF;
  buffer[offset+1] = (value >> 8) & 0xFF; 
  buffer[offset+2] = value & 0xFF;
  return offset + 3;
}

function readTriad(buffer, offset) {
  return {
    size: 3,
    value: (buffer[offset] << 16) + (buffer[offset+1] << 8) + buffer[offset+2]
  }
}

function writeLTriad(value, buffer, offset) {
  buffer[offset+2] = (value >> 16) & 0xFF;
  buffer[offset+1] = (value >> 8) & 0xFF; 
  buffer[offset] = value & 0xFF;
  return offset + 3;
}

function readLTriad(buffer, offset) {
  return {
    size: 3,
    value: (buffer[offset+2] << 16) + (buffer[offset+1] << 8) + buffer[offset]
  }
}

function readRestBuffer(buffer, offset) {
  return {
    value: buffer.slice(offset),
    size: buffer.length - offset
  };
}

function writeRestBuffer(value, buffer, offset) {
  value.copy(buffer, offset);
  return offset + value.length;
}

function sizeOfRestBuffer(value) {
  return value.length;
}

module.exports = {
  'magic': [readMagic, writeMagic, 16],
  'ipAddress': [readIpAddress, writeIpAddress, 4],
  'triad': [readTriad, writeTriad, 3],
  'ltriad': [readLTriad, writeLTriad, 3],
  'restBuffer': [readRestBuffer, writeRestBuffer, sizeOfRestBuffer],
};