var ProtoDef = require('protodef').ProtoDef;
var Serializer = require('protodef').Serializer;
var Parser = require('protodef').Parser;

var protocol = require('../data/protocol.json');

function createProtocol(packets) {
  var proto = new ProtoDef();

  proto.addTypes(require('./datatypes'));

  Object.keys(packets).forEach(function (name) {
    proto.addType("packet_" + name, ["container", packets[name].fields]);
  });

  proto.addType("packet", ["container", [{
    "name": "name",
    "type": ["mapper", {
      "type": "ubyte",
      "mappings": Object.keys(packets).reduce(function (acc, name) {
        acc[parseInt(packets[name].id)] = name;
        return acc;
      }, {})
    }]
  }, {
    "name": "params",
    "type": ["switch", {
      "compareTo": "name",
      "fields": Object.keys(packets).reduce(function (acc, name) {
        acc[name] = "packet_" + name;
        return acc;
      }, {})
    }]
  }]]);
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