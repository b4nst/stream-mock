# Stream Mock

[![Travis (.org)](https://img.shields.io/travis/b4nst/stream-mock.svg?logo=travis-ci)](https://travis-ci.org/b4nst/stream-mock)
[![npm](https://img.shields.io/npm/v/stream-mock.svg?logo=npm)](https://www.npmjs.com/package/stream-mock)
[![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/b4nst/stream-mock.svg?logo=snyk)](https://github.com/b4nst/stream-mock/network/alerts)
[![Code Climate coverage](https://img.shields.io/codeclimate/coverage/b4nst/stream-mock.svg?logo=code-climate)](https://codeclimate.com/github/b4nst/stream-mock)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/b4nst/stream-mock.svg?logo=code-climate)](https://codeclimate.com/github/b4nst/stream-mock)
[![Greenkeeper badge](https://img.shields.io/badge/-enabled-green.svg?logo=greenkeeper&color=grey)](https://greenkeeper.io/)
![node](https://img.shields.io/node/v/stream-mock.svg?label=&logo=node.js&color=grey)
![npm type definitions](https://img.shields.io/npm/types/stream-mock.svg)
![GitHub](https://img.shields.io/github/license/b4nst/stream-mock.svg)

Mock nodejs streams.

## Features

- Create a
  [readable stream](https://nodejs.org/api/stream.html#stream_readable_streams)
  from any iterable.
- Create a
  [writable stream](https://nodejs.org/api/stream.html#stream_writable_streams)
  that puts its data at your disposal.
- Create a
  [duplex stream](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams)
  that combines a readable and writable stream together.
- Can operate both in
  [object](https://nodejs.org/api/stream.html#stream_object_mode) and normal
  ( [Buffer](https://nodejs.org/api/buffer.html#buffer_buf_length) ) mode.

## Quick start

```shell
yarn add stream-mock
```

Or, if you are more a `npm` person

```shell
npm i stream-mock
```

### Basic usage

You are building an awesome brand new 
[Transform stream](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams)
that rounds all your values.

```javascript
import { Transform } from 'stream';

export default class Rounder extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(Math.round(chunk));
    callback();
  }
}
```

Now you need / want to test it.

```javascript
import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';
import chai from 'chai';

import Rounder from 'the/seven/bloody/hells';

chai.should();

describe('Test me if you can', (done) => {
    it('Round me like one of your french girls', {
        // Given
        const input = [1.2, 2.6, 3.7];
        const transform = new Rounder({objectMode: true});
        const reader = new ObjectReadableMock(input);
        const writer = new ObjectWritableMock();
        // When
        reader.pipe(transform).pipe(writer);
        // Then
        writer.on('finish', ()=>{
            writer.data.should.deep.equal(input.map(Math.round));
        })
    });
});
```

![magic](https://media.giphy.com/media/12NUbkX6p4xOO4/giphy.gif)

### API documentation

Full API doc is hosted [here](https://bastienar.github.io/stream-mock/)

----------------

## License

MIT
