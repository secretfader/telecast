/**
* Dependencies
*/
var path    = require('path')
,   fs      = require('fs')
,   mkdirp  = require('mkdirp')
,   Stream  = require('stream');

class LocalProvider {
  constructor (options) {
    options = options || {};

    this.name = 'local';
    this.root = options.root || path.join(process.cwd(), 'uploads');
  }

  static path (input) {
    return path.join(this.root, input);
  }

  static get (src) {
    return fs.createReadStream(this.path(src));
  }

  static put (src) {
    var self    = this
    ,   handler = new Stream.PassThrough();

    mkdirp(path.dirname(this.path(dest)), function (err) {
      if (err) {
        handler.emit('error', err);
        return handler.end();
      }

      var upload = fs.createWriteStream(self.path(dest));

      upload.once('finish', function () {
        handler.emit('success', { name: dest });
      });

      handler.pipe(upload);
    });

    return handler;
  }

  static del (src) {
    return fs.unlink(this.path(src), done);
  }
}

module.exports = LocalProvider;
