# Telecast

Simple, powerful file uploads for Node.js applications. Configure once, and upload from anywhere in your application.

Telecast sets the standard for upload managers by allowing you to:

* Configure the directory and provider where file uploads are stored once, and use that location anywhere in your application

* Forget writing ```mkdirp``` commands, even when streaming, while writing to your local filesystem.

* Upload to multiple cloud storage providers (even at the same time) for redundancy.

* Interact with those providers through the *one true interface for file transfer*... a.k.a. Node Streams.

* Seamlessly integrate streaming multipart-parsers (like [Busboy](http://github.com/mscdex/busboy)) into your application with little or no hassle.

## Usage

### Uploading

```javascript
var fs       = require('fs')
,   telecast = require('telecast');
,   src      = fs.createReadStream(/*...*/)
,   upload   = telecast.put('audio.aiff');

upload.once('success', function (stored) {
  console.log('Success! ' + stored);
});

upload.on('error', function (err) {
  //...
});

src.pipe(upload);
```

### Downloading

```javascript
telecast.get('audio.aiff').pipe(fs.createWriteStream(/*...*/);

```

### Deleting

```javascript
telecast.del('audio.aiff', function (err) {
  //...
});
```
### Configuration

```javascript
telecast.configure({
  aws: {
    key: '',
    secret: '',
    root: 'uploads'
  }
});
```
For detailed usage instructions, see the [Example Application](http://github.com/originalmachine/telecast-example).

## Additional Packages

If you intend to use [Amazon S3](http://aws.amazon.com/s3) or [Rackspace Cloud Files](http://rackspace.com/cloud/files), you'll need to require one or more of the following packages:

* [telecast-aws](http://github.com/originalmachine/telecast-aws)

Make sure the relevant packages are in your ```package.json```, and Telecast will do the rest.

## License

Copyright (C) Original Machine LLC.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
