var raknet = require('../index');

// writing a 'normal' packet
// raknet.serializer.write({
//   name: "ADVERTISE_SYSTEM",
//   params: {
//     pingID: 1,
//     serverID: 1,
//     magic: 0,
//     serverName: "Hello!"
//   }
// });

// writing an encapsulatedpacket
raknet.serializer.write({
  name: "DATA_PACKET_0",
  params: {
    seqNumber: 12344,
    encapsulatedPackets: [{
      reliability: 3,
      hasSplit: 16,
      length:4,
      identifierACK: 1,
      messageIndex: 1234,
      orderIndex: 1234,
      orderChannel: 10,
      splitCount: 1,
      splitID: 1,
      splitIndex: 1,
      buffer: new Buffer([0x01,0x02,0x03,0x04])
    }]
  }
});
raknet.serializer.on('data', function(chunk) {
  console.log(chunk);
});

raknet.serializer.pipe(raknet.parser)

raknet.parser.on('error', function(err) {
  console.log(err.stack);
})

raknet.parser.on('data', function(chunk) {
  console.log(JSON.stringify(chunk, null, 2));
});