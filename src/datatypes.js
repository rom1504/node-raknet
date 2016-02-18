var tryCatch = require('protodef').utils.tryCatch;
var addErrorField = require('protodef').utils.addErrorField;

function readMagic(buffer, offset) {
  return {
    value: [0x00, 0xff, 0xff, 0x00, 0xfe, 0xfe, 0xfe, 0xfe, 0xfd, 0xfd, 0xfd, 0xfd, 0x12, 0x34, 0x56, 0x78],
    size: 16
  }
}

function writeMagic(value, buffer, offset) {
  new Buffer([0x00, 0xff, 0xff, 0x00, 0xfe, 0xfe, 0xfe, 0xfe, 0xfd, 0xfd, 0xfd, 0xfd, 0x12, 0x34, 0x56, 0x78]).copy(buffer,offset)
  return offset + 16;
}

function readIpAddress(buffer, offset) {
  var address = buffer[offset] + '.' + buffer[offset+1] + '.' + buffer[offset+2] + '.' + buffer[offset+3]
  return {
    size: 4,
    value: address
  }
}

function writeIpAddress(value, buffer, offset) {
  var address = value.split('.');

  address.forEach(function(b) {
    buffer[offset] = parseInt(b);
    offset++;
  });

  return offset;
}

function writeTriad(value, buffer, offset) {
  buffer[offset] = (value >> 16) & 0xFF;
  buffer[offset+1] = (value >> 8) & 0xFF; 
  buffer[offset+2] = value & 0xFF;
  return offset + 3;
}

function readTriad(buffer, offset) {
  return {
    size: 3,
    value: (buffer[offset] << 16) + (buffer[offset+1] << 8) + buffer[offset+2]
  }
}

function writeLTriad(value, buffer, offset) {
  buffer[offset+2] = (value >> 16) & 0xFF;
  buffer[offset+1] = (value >> 8) & 0xFF; 
  buffer[offset] = value & 0xFF;
  return offset + 3;
}

function readLTriad(buffer, offset) {
  return {
    size: 3,
    value: (buffer[offset+2] << 16) + (buffer[offset+1] << 8) + buffer[offset]
  }
}

function readRestBuffer(buffer, offset) {
  return {
    value: buffer.slice(offset),
    size: buffer.length - offset
  };
}

function writeRestBuffer(value, buffer, offset) {
  value.copy(buffer, offset);
  return offset + value.length;
}

function sizeOfRestBuffer(value) {
  return value.length;
}

function readEncapsulatedPacket(buffer, offset, typeArgs) {
  var packet = {};
  var size=0;
  var flags = buffer[offset];

  packet.reliability = ((flags & 0xE0) >> 5);
  packet.hasSplit = (flags & 0x10) > 0;
  offset+=1;
  size+=1;

  var length;

  if (typeArgs.internal) {
    length = length = this.read(buffer, offset, "int").value;
    offset+=4;
    size+=4;
    packet.identifierACK = this.read(buffer, offset, "int").value;
    offset+=4;
    size+=4;
  } else {
    length = Math.ceil((this.read(buffer, offset, "short").value) / 8);
    offset+=3;
    size+=3;
    packet.identifierACK = null;
  }

  if (packet.reliability > 0) {
    if (packet.reliability >= 2 && packet.reliability != 5) {
        packet.messageIndex = this.read(buffer, offset, "ltriad").value;
        offset+=3;
        size+=3;
      }

      if (packet.reliability <= 4 && packet.reliability != 2) {
        packet.orderIndex = this.read(buffer, offset, "ltriad").value;
        offset+=3;
        size+=3;
        packet.orderChannel = buffer[offset];
      }
  }

  if (packet.hasSplit) {
    packet.splitCount = this.read(buffer, offset, "int").value;
    offset+=4;
    size+=4;
    packet.splitID = this.read(buffer, offset, "short").value;
    offset+=2;
    size+=2;
    packet.splitIndex = this.read(buffer, offset, "int").value;
    offset+=4;
    size+=4;
  }

  packet.buffer=buffer.slice(offset,length);
  offset+=length;
  size+=length;

  return {
    value: packet,
    size: size
  }
}

function writeEncapsulatedPacket(value, buffer, offset, typeArgs) {
  offset=this.write((value.reliability << 5) | (value.hasSplit ? 0x10 : 0),buffer, offset, "byte");
  
  if (typeArgs.internal) {
    offset=this.write(buffer.length, buffer, offset, "int");
    offset=this.write((value.identifierACK == null ? 0 : value.identifierACK), buffer, offset, "int");
  } else {
    offset=this.write(buffer.length << 3, buffer, offset, "short");
  }

  if (value.reliability > 0) {
    if (value.reliability >= 2 && value.reliability != 5) {
      offset=this.write((value.messageIndex == null ? 0 : value.messageIndex), buffer, offset, "ltriad");
    }
    if (value.reliability <= 4 && value.reliability != 2) {
      offset=this.write(value.orderIndex, buffer, offset, "ltriad");
      offset=this.write(value.orderChannel & 0xff, buffer, offset, "byte");
    }
  }

  if (value.hasSplit) {
    offset=this.write(value.splitCount, buffer, offset, "int");
    offset=this.write(value.splitID, buffer, offset, "short");
    offset=this.write(value.splitIndex, buffer, offset, "int");
  }

  offset+=value.buffer.copy(buffer, offset);

  return offset;
}

function sizeOfEncapsulatedPacket(value, typeArgs) {
  var size=0;
  size+=this.sizeOf((value.reliability << 5) | (value.hasSplit ? 0x10 : 0), "byte");
  
  if (typeArgs.internal) {
    size+=this.sizeOf(value.buffer.length, "int");
    size+=this.sizeOf((value.identifierACK == null ? 0 : value.identifierACK), "int");
  } else {
    size+=this.sizeOf(value.buffer.length << 3, "short");
  }

  if (value.reliability > 0) {
    if (value.reliability >= 2 && value.reliability != 5) {
      size+=this.sizeOf((value.messageIndex == null ? 0 : value.messageIndex), "ltriad");
    }
    if (value.reliability <= 4 && value.reliability != 2) {
      size+=this.sizeOf(value.orderIndex, "ltriad");
      size+=this.sizeOf(value.orderChannel & 0xff, "byte");
    }
  }

  if (value.hasSplit) {
    size+=this.sizeOf(value.splitCount, "int");
    size+=this.sizeOf(value.splitID, "short");
    size+=this.sizeOf(value.splitIndex, "int");
  }

  size+=value.buffer.length;
  return size;
}

module.exports = {
  'magic': [readMagic, writeMagic, 16],
  'ipAddress': [readIpAddress, writeIpAddress, 4],
  'triad': [readTriad, writeTriad, 3],
  'ltriad': [readLTriad, writeLTriad, 3],
  'restBuffer': [readRestBuffer, writeRestBuffer, sizeOfRestBuffer],
  'EncapsulatedPacket': [readEncapsulatedPacket, writeEncapsulatedPacket, sizeOfEncapsulatedPacket]
};