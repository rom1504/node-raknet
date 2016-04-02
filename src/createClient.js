'use strict';

const dgram=require("dgram");
const dns = require('dns');
const Client = require('./client');
const assert = require('assert');

module.exports = createClient;


function createClient(options) {
  assert.ok(options, "options is required");
  var port = options.port || 19132;
  var host = options.host || 'localhost';
  var password = options.password;

  var client = new Client(options.port,options.host);
  var socket=dgram.createSocket({type: 'udp4'});
  socket.bind();
  socket.on("message",(data,rinfo) => {
    client.handleMessage(data);
  });
  socket.on("listening",() => {
    client.emit("connect");
  });

  client.setSocket(socket);

  client.on("connect",onConnect);
  client.username = options.username;

  function onConnect() {
    client.write('open_connection_request_1', {
      magic:0,
      protocol:6,
      mtuSize:new Buffer(1446).fill(0)
    });

    client.on('open_connection_reply_1', function() {
      client.write('open_connection_request_2', {
        magic:0,
        serverAddress:{ version: 4, address: client.address, port: client.port },
        mtuSize:1426,
        clientID:[ 339724, -6627870 ]
      });
    });

    client.on('open_connection_reply_2',() => {
      client.writeEncapsulated('client_connect',{
        "clientID":[339844,-1917040252],
        "sendPing":[0,43],
        "useSecurity":0,
        "password":new Buffer(options.password ? options.password : 0)
      });
    });

    client.on('server_handshake',() => {
      client.writeEncapsulated('client_handshake',{
        serverAddress:{ version: 4, address: client.address, port: client.port },
        systemAddresses:[
          { version: 4, address: client.socket.address().address, port: /*client.socket.address().port*/12345/*TODO fix this*/ }
        ]
      });
    })
  }

  return client;
}