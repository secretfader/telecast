/**
* Dependencies
*/
var path    = require('path')
,   fs      = require('fs')
,   mkdirp  = require('mkdirp')
,   Stream  = require('stream');

/**
* Create LocalProvider constructor.
*/
var LocalProvider = function (options) {
  options   = options || {};

  this.name = 'local';
  this.root = options.root || path.join(process.cwd(), 'uploads');

  /**
   * Helpers
   */
  this.path = function (input) {
    return path.join(this.root, input);
  };
};

/**
 * Return a stream of the requested file.
 */
LocalProvider.prototype.get = function (src) {
  return fs.createReadStream(this.path(src));
};

/**
 * Re-route a stream to the file system, and create
 * new directories if required.
 */
LocalProvider.prototype.put = function (dest) {
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
};

/**
 * Remove a file from the file system.
 */
LocalProvider.prototype.del = function (src, done) {
  return fs.unlink(this.path(src), done);
};

module.exports = LocalProvider;
