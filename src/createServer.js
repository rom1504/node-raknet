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
    // not sure what to put here
  });

  server.listen(port, host);
  return server;
}

module.exports = createServer;