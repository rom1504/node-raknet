module.exports = {
  createDeserializer: require('./serializer').createDeserializer,
  createSerializer: require('./serializer').createSerializer,
  createSpecialDeserializer: require('./special_packet_serializer').createDeserializer,
  createSpecialSerializer: require('./special_packet_serializer').createSerializer
}