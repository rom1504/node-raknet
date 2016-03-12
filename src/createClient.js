'use strict';

var udp = require('datagram-stream');
var dns = require('dns');
var net = require('net');
var Client = require('./client');
var assert = require('assert');

module.exports = createClient;

Client.prototype.connect = function(port, host) {
  var self = this;

  if(net.isIP(host) === 0) {
    dns.resolveSrv(host, function(err, addresses) {
      if(addresses && addresses.length > 0) {
        var stream = udp({
          address: '0.0.0.0', 
          unicast: addresses[0].name,
          port: addresses[0].port,
          reuseAddr: true,
        });
        self.setSocket(stream);
      } else {
        var stream = udp({
          address: '0.0.0.0', 
          unicast: host,
          port: port,
          reuseAddr: true, 
        });
        self.setSocket(stream);
      }
    });
  } else {
    var stream = udp({
      address: '0.0.0.0', 
      unicast: host,
      port: port,
      reuseAddr: true, 
    });
    self.setSocket(stream);
  }
};

function createClient(options) {
  assert.ok(options, "options is required");
  var port = options.port || 19132;
  var host = options.host || 'localhost';

  var client = new Client();

  client.on('connect', onConnect);
  client.username = options.username;
  client.connect(port, host);

  function onConnect() {
    // no idea what to put here
  }

  return client;
}