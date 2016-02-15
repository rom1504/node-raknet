var raknet = require('../index');

raknet.serializer.write({
  name: "NACK",
  params: []
});
raknet.serializer.pipe(raknet.parser)

raknet.parser.on('data', function (chunk) {
  console.log(JSON.stringify(chunk, null, 2));
});