/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai from 'chai';
import sinon from 'sinon';

import DuplexMock from '../main/duplex-mock';
import ReadableMock from '../main/readable-mock';

function assertDataMatch(objectMode, actual, expected) {
  if (objectMode) {
    actual.should.equal(expected);
  } else {
    actual.equals(Buffer.from(expected.toString())).should.be.true;
  }
}

describe('DuplexMock', () => {
  chai.should();

  it('should create a new duplex instance', () => {
    const stream = new DuplexMock();

    stream.should.be.an.instanceOf(DuplexMock);
  });

  describe('Object mode', () => {
    it('should produce data from an object', done => {
      const source = {
        a: 'a',
        b: 'b',
        c: 123
      };

      const stream = new DuplexMock({
        readableObjectMode: true,
        writableObjectMode: true
      });

      stream.on('data', data => assertDataMatch(true, data, source));
      stream.write(source);
      stream.on('end', done);
    });

    it('should produce data from an array', done => {
      const source = [1, 2, 3];

      const stream = new DuplexMock({
        readableObjectMode: true,
        writableObjectMode: true
      });

      stream.on('data', data => assertDataMatch(true, data, source));
      stream.write(source);
      stream.on('end', done);
    });
  });

  describe('Normal (Buffer) mode', () => {
    let stream;

    beforeEach(() => {
      stream = new DuplexMock();
    });

    afterEach(() => {
      stream.end();
      stream.destroy();
    });

    it('should produce data from a buffer', done => {
      const source = Buffer.from('abcd');

      stream.on('data', data => assertDataMatch(false, data, source));
      stream.write(source);
      stream.on('end', done);
    });

    it('should produce data from string source', done => {
      const source = '12345';

      stream.on('data', data => assertDataMatch(false, data, source));
      stream.write(source);
      stream.on('end', done);
    });

    it('should write buffer', done => {
      // Given
      const cb = sinon.spy();
      const data = 'I\'m a proud string';

      stream.on('finish', () => {
        const actual = stream.data;
        cb.called.should.be.true;
        actual.should.be.an.instanceof(Buffer);
        actual.toString().should.equal(data);
        done();
      });

      stream.write(Buffer.from(data), cb);
      stream.end();
    });

    it('should write and read multiple times', done => {
      // Given
      const data = ['a', 'b', 'c'];
      const actualData = [];

      stream.on('data', d => {
        actualData.push(d.toString());
      });

      stream.on('finish', () => {
        data.join('').should.equal(actualData.join(''));
        done();
      });

      data.forEach(d => {
        stream.write(Buffer.from(d));
      });

      stream.end();
    });

    it('should get the same result either flat or not', done => {
      // Given
      const cb = sinon.spy();
      const data = 'I\'m a proud string';

      stream.on('finish', () => {
        const actual = stream.data;
        cb.called.should.be.true;
        actual.should.be.an.instanceof(Buffer);
        actual.toString().should.equal(data);
        stream.flatData.toString().should.equal(data);
        done();
      });

      stream.write(Buffer.from(data), cb);
      stream.end();
    });

    it('should pipe with reader', done => {
      // Given
      const data = 'I\'m a proud string';
      const reader = new ReadableMock(data);
      // When
      reader.pipe(stream);
      // Then
      stream.on('finish', () => {
        const actual = stream.data;
        actual.should.be.an.instanceof(Buffer);
        actual.toString().should.equal(data);
        done();
      });
    });
  });
});
