var raknet = require('../index');

raknet.serializer.write({
  name: "ADVERTISE_SYSTEM",
  params: {
    pingID: 1,
    serverID: 1,
    magic: 0,
    serverName: "Hello!"
  }
});

raknet.serializer.pipe(raknet.parser)

raknet.parser.on('data', function (chunk) {
  console.log(JSON.stringify(chunk, null, 2));
});