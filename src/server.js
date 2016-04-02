'use strict';

const dgram=require("dgram");
const EventEmitter = require('events').EventEmitter;
const debug = require('debug')('raknet');
const Client = require("./client");

class Server extends EventEmitter
{
  constructor()
  {
    super();
    this.ipPortToClient={};
  }

  listen(port,address)
  {
    this.address=address;
    this.port=port;
    this.socket=dgram.createSocket({type: 'udp4'});
    this.socket.bind(this.port,this.address);

    this.socket.on("message",(data,rinfo) => {
      const ipPort=rinfo.address+":"+rinfo.port;
      let client;
      if(!this.ipPortToClient[ipPort])
      {
        client=new Client(rinfo.port,rinfo.address);
        client.setSocket(this.socket);
        this.ipPortToClient[ipPort]=client;
        this.emit("connection",client);
      }
      else
        client=this.ipPortToClient[ipPort];
      client.handleMessage(data);
    });
  }
}

module.exports = Server;