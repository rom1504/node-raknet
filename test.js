raknet = require('./index');

raknet.serializer.write({
  name: "ACK"
})

raknet.serializer.pipe(raknet.parser)

raknet.parser.on('data', function(chunk) {
  console.log(JSON.stringify(chunk, null, 2))
});