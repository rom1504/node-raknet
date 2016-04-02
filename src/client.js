'use strict';

var EventEmitter = require('events').EventEmitter;
var debug = require('debug')("raknet");

var createSerializer = require("./transforms/serializer").createSerializer;
var createDeserializer = require("./transforms/serializer").createDeserializer;

class Client extends EventEmitter
{
  constructor(port,address)
  {
    super();
    this.address=address;
    this.port=port;
    this.parser=createDeserializer(true);
    this.serializer=createSerializer(true);
  }

  setSocket(socket)
  {
    this.socket=socket;
    this.serializer.on("data",(chunk) => {
      socket.send(chunk,0,chunk.length,this.port,this.address);
    });

    this.parser.on("data",(parsed) => {
      parsed.metadata.name=parsed.data.name;
      parsed.data=parsed.data.params;
      debug("read packet " + parsed.metadata.name);
      debug(parsed.data);
      this.emit('packet', parsed.data, parsed.metadata);
      this.emit(parsed.metadata.name, parsed.data, parsed.metadata);
      this.emit('raw.' + parsed.metadata.name, parsed.buffer, parsed.metadata);
      this.emit('raw', parsed.buffer, parsed.metadata);
    })
  }

  write(name, params) {
    if(this.ended)
      return;
    debug("writing packet " + name);
    debug(params);
    this.serializer.write({ name, params });
  }

  handleMessage(data)
  {
    this.parser.write(data);
  }
}


module.exports = Client;