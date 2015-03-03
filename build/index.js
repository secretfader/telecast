"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var path = require("path"),
    findLast = require("lodash.findlast");

var Telecast = (function () {
  function Telecast() {
    _classCallCheck(this, Telecast);
  }

  _prototypeProperties(Telecast, {
    configure: {
      value: function configure(options) {
        options = options || {};

        if (Object.keys(options).length && this.providers.length) {
          this.providers = [];
        }

        if (!Object.keys(options).length) options.local = {};

        for (var key in options) {
          this.providers.push(new (require("telecast-" + key))(options[key]));
        }
      },
      writable: true,
      configurable: true
    },
    provider: {
      value: function provider(name) {
        if (1 === this.providers.length || !name) {
          return this.providers[0];
        }var retrieved = findLast(this.providers, function (provider) {
          return name === provider.name;
        });

        if (!retrieved) throw new Error("No provider with that name.");

        return retrieved;
      },
      writable: true,
      configurable: true
    },
    get: {
      value: function get(input, provider) {
        provider = provider ? this.provider(provider) : this.provider("local");
        return provider.get(input);
      },
      writable: true,
      configurable: true
    },
    put: {
      value: function put(input, provider) {
        provider = provider ? this.provider(provider) : this.provider("local");
        return provider.put(input);
      },
      writable: true,
      configurable: true
    },
    del: {
      value: function del(input, provider, done) {
        if ("function" === typeof provider) {
          done = provider;
          provider = this.provider();
        }
        provider = provider ? this.provider(provider) : this.provider("local");
        return provider.del(input, done);
      },
      writable: true,
      configurable: true
    }
  });

  return Telecast;
})();

Telecast.providers = [];

module.exports = Telecast;