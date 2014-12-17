var path = require('path')
,   lo   = require('lodash')
,   Telecast;

Telecast = function () {
  this.providers = [];
  this.configure();
};

Telecast.prototype.configure = function (options) {
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
};

Telecast.prototype.provider = function (name) {
  if (1 === this.providers.length || !name) return this.providers[0];

  var retrieved = lo.findLast(this.providers, function (provider) {
    return name === provider.name;
  });

  if (!retrieved) throw new Error('No provider with that name.');

  return retrieved;
};

Telecast.prototype.get = function (input, provider) {
  provider = (provider ? this.provider(provider) : this.provider('local'));
  return provider.get(input);
};

Telecast.prototype.put = function (input, provider) {
  provider = (provider ? this.provider(provider) : this.provider('local'));
  return provider.put(input);
};

Telecast.prototype.del = function (input, provider, done) {
  if ('function' === typeof provider) {
    done     = provider;
    provider = this.provider();
  }
  provider = (provider ? this.provider(provider) : this.provider('local'));
  return provider.del(input, done);
};

module.exports = new Telecast();
