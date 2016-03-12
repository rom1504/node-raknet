var ProtoDef = require('protodef').ProtoDef;
var Serializer = require('protodef').Serializer;
var Parser = require('protodef').Parser;

var protocol = require('../data/protocol.json');

function createProtocol(packets) {
  var proto = new ProtoDef();

  proto.addTypes(require('./datatypes'));
  proto.addTypes(packets);
  
  return proto;
}

var proto = new createProtocol(protocol);
proto.addTypes(protocol);

function createSerializer() {
  return new Serializer(proto, 'special_packet');
}

function createDeserializer() {
  return new Parser(proto, 'special_packet');
}

module.exports = {
  createDeserializer: createDeserializer,
  createSerializer: createSerializer
}
