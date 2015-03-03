var path     = require('path')
,   findLast = require('lodash.findlast');

class Telecast {
  static configure (options) {
    options = options || {};

    if (Object.keys(options).length && this.providers.length) {
      this.providers = [];
    }

    if (!Object.keys(options).length) options.local = {};

    for (var key in options) {
      this.providers.push(
        new (require('telecast-' + key))(options[key])
      );
    }
  }

  static provider (name) {
    if (1 === this.providers.length || !name) return this.providers[0];

    var retrieved = findLast(this.providers, function (provider) {
      return name === provider.name;
    });

    if (!retrieved) throw new Error('No provider with that name.');

    return retrieved;
  }

  static get (input, provider) {
    provider = (provider ? this.provider(provider) : this.provider('local'));
    return provider.get(input);
  }

  static put (input, provider) {
    provider = (provider ? this.provider(provider) : this.provider('local'));
    return provider.put(input);
  }

  static del (input, provider, done) {
    if ('function' === typeof provider) {
      done     = provider;
      provider = this.provider();
    }
    provider = (provider ? this.provider(provider) : this.provider('local'));
    return provider.del(input, done);
  }
}

Telecast.providers = [];

module.exports = Telecast;
