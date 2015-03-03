var telecast = require('../')
,   fs       = require('fs')
,   path     = require('path')
,   async    = require('async')
,   expect   = require('chai').expect
,   Readable = require('stream').Readable
,   Through  = require('stream').PassThrough;

telecast.configure();

describe('Telecast: Defaults', function () {
  it('should require the local provider', function () {
    expect(telecast.provider().name).to.equal('local');
  });

  it('should use a default root directory', function () {
    expect(telecast.provider().root)
      .to.equal(path.join(process.cwd(), 'uploads'));
  });
});

describe('Telecast: Configuration', function () {
  /**
   * Setup
   */
  before(function () {
    telecast.configure({
      local: { root: path.join(__dirname, 'tmp') }
    });
  });

  it('should accept configuration for each provider', function () {
    expect(telecast.provider().root)
      .to.equal(path.join(__dirname, 'tmp'));

    expect(telecast.provider('local').root)
      .to.equal(path.join(__dirname, 'tmp'));
  });

  it('should expose provider options', function () {
    expect(telecast.provider().name).to.equal('local');
    expect(telecast.provider().root).to.equal(path.join(__dirname, 'tmp'));
  });

  it('should allow accessing the path for a given object', function () {
    expect(telecast.provider().path('hello.txt'))
      .to.equal(path.join(__dirname, 'tmp/hello.txt'));
  });
});

describe('Telecast: File Upload', function () {
  /**
   * Setup
   */
  before(function () {
    telecast.configure({
      local: { root: path.join(__dirname, 'tmp') }
    });
  });

  /**
   * Teardown
   */
  after(function (done) {
    async.series([
      function (next) {
        fs.unlink(path.join(__dirname, 'tmp/test.txt'), next);
      },
      function (next) {
        fs.rmdir(path.join(__dirname, 'tmp'), next);
      }
    ], done);
  });

  describe('#put', function () {
    it('should return a writable stream', function (done) {
      var input  = path.join(__dirname, 'support/data.txt')
      ,   output = path.join(__dirname, 'tmp/hello.txt')
      ,   upload;

      upload = telecast.put('hello.txt');

      expect(upload instanceof Through).to.equal(true);

      upload.on('success', function (stored) {
        expect(stored.name).to.not.equal(null);
        fs.exists(output, function (exists) {
          expect(exists).to.not.equal(false);
          done();
        });
      });

      fs.createReadStream(input).pipe(upload);
    });
  });

  describe('#get', function () {
    it('should return a readable stream', function () {
      expect(telecast.get('hello.txt') instanceof Readable).to.equal(true);
    });

    it('should be pipable', function (done) {
      var output   = path.join(__dirname, 'tmp/test.txt')
      ,   download = fs.createWriteStream(output);

      download.on('error', function (err) {
        return done(err);
      });

      download.on('finish', function () {
        fs.exists(output, function (exists) {
          expect(exists).to.equal(true);
          done();
        });
      });

      telecast.get('hello.txt').pipe(download);
    })
  });

  describe('#del', function () {
    it('should not return an error when a file is deleted', function (done) {
      telecast.del('hello.txt', function (err) {
        expect(err).to.equal(null);
        done();
      });
    });

    it('should return an error if the file does not exist', function (done) {
      telecast.del('howdy.txt', function (err) {
        expect(err).to.not.equal(null);
        done();
      });
    });
  });
});
