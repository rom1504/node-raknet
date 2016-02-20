var ProtoDef = require('protodef').ProtoDef;
var Serializer = require('protodef').Serializer;
var Parser = require('protodef').Parser;

var protocol = require('../data/protocol.json');

function createProtocol(packets) {
  var proto = new ProtoDef();

  proto.addTypes(require('./datatypes'));
  proto.addType("string",["pstring",{ countType:"i16"}]);
  
  proto.addTypes(packets);
  
  return proto;
}

var proto = new createProtocol(protocol);
proto.addTypes(protocol);
var parser = new Parser(proto, 'packet');
var serializer = new Serializer(proto, 'packet');

module.exports = {
  parser: parser,
  serializer: serializer
}
