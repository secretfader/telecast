"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
* Dependencies
*/
var path = require("path"),
    fs = require("fs"),
    mkdirp = require("mkdirp"),
    Stream = require("stream");

var LocalProvider = (function () {
  function LocalProvider(options) {
    _classCallCheck(this, LocalProvider);

    options = options || {};

    this.name = "local";
    this.root = options.root || path.join(process.cwd(), "uploads");
  }

  _prototypeProperties(LocalProvider, {
    path: {
      value: (function (_path) {
        var _pathWrapper = function path(_x) {
          return _path.apply(this, arguments);
        };

        _pathWrapper.toString = function () {
          return _path.toString();
        };

        return _pathWrapper;
      })(function (input) {
        return path.join(this.root, input);
      }),
      writable: true,
      configurable: true
    },
    get: {
      value: function get(src) {
        return fs.createReadStream(this.path(src));
      },
      writable: true,
      configurable: true
    },
    put: {
      value: function put(src) {
        var self = this,
            handler = new Stream.PassThrough();

        mkdirp(path.dirname(this.path(dest)), function (err) {
          if (err) {
            handler.emit("error", err);
            return handler.end();
          }

          var upload = fs.createWriteStream(self.path(dest));

          upload.once("finish", function () {
            handler.emit("success", { name: dest });
          });

          handler.pipe(upload);
        });

        return handler;
      },
      writable: true,
      configurable: true
    },
    del: {
      value: function del(src) {
        return fs.unlink(this.path(src), done);
      },
      writable: true,
      configurable: true
    }
  });

  return LocalProvider;
})();

module.exports = LocalProvider;