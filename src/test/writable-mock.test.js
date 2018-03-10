/* eslint-env mocha */
import chai from 'chai';
import { Writable } from 'stream';
import sinon from 'sinon';

import WritableMock from '../main/writable-mock';
import ReadableMock from '../main/readable-mock';

describe('WritableMock', () => {
  const should = chai.should();

  it('should construct a stream writer', () => {
    const writer = new WritableMock();

    writer.should.be.an.instanceof(Writable);
  });

  describe('Object mode', () => {
    let writer;

    beforeEach(() => {
      writer = new WritableMock({ objectMode: true });
    });

    afterEach(() => {
      writer.destroy();
    });

    it('should write objects', (done) => {
      // Given
      const cb = sinon.spy();
      const datas = [1, { foo: 'bar' }, 'string', true];
      // When
      for (const data of datas) {
        writer.write(data, cb);
      }
      writer.end();
      // Then
      writer.on('finish', () => {
        cb.callCount.should.equal(datas.length);
        writer.data.should.deep.equal(datas);
        done();
      });
    });

    it('should pipe with reader', (done) => {
      // Given
      const datas = [1, { foo: 'bar' }, 'string', true];
      const reader = new ReadableMock(datas, { objectMode: true });
      // When
      reader.pipe(writer);
      // Then
      writer.on('finish', () => {
        writer.data.should.deep.equal(datas);
        done();
      });
    });
  });

  describe('Normal (buffer) mode', () => {
    let writer;

    beforeEach(() => {
      writer = new WritableMock();
    });

    afterEach(() => {
      writer.destroy();
    });

    it('should write buffer', (done) => {
      // Given
      const cb = sinon.spy();
      const data = "I'm a proud string";
      // When
      writer.write(Buffer.from(data), cb);
      writer.end();
      // Then
      writer.on('finish', () => {
        const actual = writer.data;
        cb.called.should.be.true;
        actual.should.be.an.instanceof(Buffer);
        actual.toString().should.equal(data);
        done();
      });
    });

    it('should pipe with reader', (done) => {
      // Given
      const data = "I'm a proud string";
      const reader = new ReadableMock(data);
      // When
      reader.pipe(writer);
      // Then
      writer.on('finish', () => {
        const actual = writer.data;
        actual.should.be.an.instanceof(Buffer);
        actual.toString().should.equal(data);
        done();
      });
    });
  });
});
