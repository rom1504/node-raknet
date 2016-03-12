var raknet = require('../index');

var parser = raknet.createSpecialDeserializer();
var serializer = raknet.createSpecialSerializer();

serializer.write({
  name: "block_address",
  params: {
    address: "111.111.111.111",
    timeout: 1000
  }
});

serializer.pipe(parser);

parser.on('error', function(err) {
  console.log(err.stack);
})

parser.on('data', function(chunk) {
  console.log(JSON.stringify(chunk, null, 2));
});