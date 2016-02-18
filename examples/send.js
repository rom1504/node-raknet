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
    seqNumber: 1234,
    encapsulatedPackets: [{
      buffer: new Buffer([0x01,0x02,0x03,0x04]),
      reliability: 0,
      hasSplit: 0,
      identifierACK: 1,
      messageIndex: 1234,
      orderIndex: 1234,
      orderChannel: 1234,
      splitCount: 1,
      splitID: 1,
      splitIndex: 1
    }]
  }
});

raknet.serializer.pipe(raknet.parser)

raknet.parser.on('error', function(err) {
  console.log(err.stack);
})

raknet.parser.on('data', function(chunk) {
  console.log(JSON.stringify(chunk, null, 2));
});