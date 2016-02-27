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

module.exports = {
  createDeserializer: new Parser(proto, 'packet'),
  createSerializer: new Serializer(proto, 'packet')
}