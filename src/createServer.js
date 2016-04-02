'use strict';

var Server = require('./server');

function createServer(options) {
  options = options || {};
  var port = options.port != null ?
    options.port :
    options['server-port'] != null ?
    options['server-port'] :
    19132;

  var host = options.host || '0.0.0.0';

  var server = new Server();
  
  server.on("connection", function (client) {
    client.on("open_connection_request_1",(packet) =>
      client.write("open_connection_reply_1",{
        magic:0,
        serverID:[ 339724, -6627871 ],
        serverSecurity:0,
        mtuSize:1492
      }));

    client.on("open_connection_request_2",packet =>
      client.write("open_connection_reply_2",{ magic: 0,
        serverID: [ 339724, -6627871 ],
        clientAddress: { version: 4, address: client.address, port: client.port },
        mtuSize: 1492,
        serverSecurity: 0 }));
  });

  server.listen(port, host);
  return server;
}

module.exports = createServer;