# Stream Mock

[![Build Status](https://travis-ci.org/BastienAr/stream-mock.svg?branch=master)](https://travis-ci.org/BastienAr/stream-mock)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a2f2d69c643398bef333/test_coverage)](https://codeclimate.com/github/BastienAr/stream-mock/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/a2f2d69c643398bef333/maintainability)](https://codeclimate.com/github/BastienAr/stream-mock/maintainability)
[![dependencies Status](https://david-dm.org/BastienAr/stream-mock/status.svg)](https://david-dm.org/BastienAr/stream-mock)

Mock nodejs streams.

## Features

- Create a [readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) from any iterable
- Create a [writable stream](https://nodejs.org/api/stream.html#stream_writable_streams) that puts its data at your disposal
- Can operate both in [object](https://nodejs.org/api/stream.html#stream_object_mode) and normal ( [Buffer](https://nodejs.org/api/buffer.html#buffer_buf_length) ) mode

## Quick start

```shell
yarn install --dev stream-mock
```

Or, if you are more a `npm` person

```shell
npm -i -D stream-mock
```

### Basic usage

You are building an awesome brand new [Transform stream](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams) that rounds all your values.

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
import {ReadableMock, WritableMock } from 'stream-mock';
import chai from 'chai';

import Rounder from 'the/seven/bloody/hells';

chai.should();

describe('Test me if you can', (done) => {
    it('Round me like one of your french girls', {
        // Given
        const input = [1.2, 2.6, 3.7];
        const reader = new ReadableMock(input, {objectMode: true});
        const writer = new WritableMock({objectMode: true});
        const transform = new Rounder({objectMode: true});
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

## Contributing

stream-mock is currently on early stage. I'm happily receiving new PR or discussing about new features, improvement or bug report. If you need something that this module is lacking (related to Nodejs stream mock obviously), do not hesitate to raise an issue.

### Developper side

If you have to write code in that repository, please be kind to run unit tests and lint before pushing. Yeah the linter is quite strict, but it's for the best !

```shell
yarn run test
yarn run lint
```

![Thats all folks](https://media.giphy.com/media/lD76yTC5zxZPG/giphy.gif)

----------------

## License

MIT