const { Writable } = require('stream');
const fs = require('fs');
const path = require('path');
const { dirname } = require('path/posix');

class CustomWriteStream extends Writable {
  constructor(fileName) {
    super();
    this.fileName = fileName;
  }

  _construct(cb) {
    fs.open(this.fileName, 'w+', (err, fd) => {
      if (err) {
        cb(err);
      } else {
        this.fd = fd;
        cb();
      }
    });
  }

  _write(chunk, enc, cb) {
    fs.write(this.fd, chunk.toString(), cb);
  }

  _destroy(err, cb) {
    if (this.fd) {
      fs.close(this.fd, (er) => cb(er || err));
    } else {
      cb(err);
    }
  }
}

module.exports = {
  CustomWriteStream,
}
