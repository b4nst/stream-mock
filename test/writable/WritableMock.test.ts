import * as sinon from 'sinon';

import { ReadableMock, WritableMock } from '../../src';

describe('WritableMock', () => {
  test('should construct when source is iterable', () => {
    const stream = new WritableMock({ objectMode: true });

    expect(stream).toBeInstanceOf(WritableMock);
  });

  describe('Object Mode', () => {
    let writer: WritableMock;

    beforeEach(() => {
      writer = new WritableMock({ objectMode: true });
    });

    afterEach(() => {
      writer.destroy();
    });

    test('with array as source', done => {
      // Given
      const cb = sinon.spy();
      const data = [1, 2, 3, 4, 5];
      // When
      data.forEach(d => writer.write(d, cb));
      writer.end();
      // Then
      writer.on('finish', () => {
        expect(cb.callCount).toEqual(data.length);
        const res = writer.data;
        expect(res).toBeInstanceOf(Array);
        expect(res).toEqual(data);
        done();
      });
    });

    test('should flatten data', done => {
      // Given
      const cb = sinon.spy();
      const data = [1, 2, [3, 4, 5]];
      // When
      data.forEach(d => writer.write(d, cb));
      writer.end();
      // Then
      writer.on('finish', () => {
        expect(cb.callCount).toEqual(data.length);
        const res = writer.flatData;
        expect(res).toBeInstanceOf(Array);
        expect(res).toEqual([1, 2, 3, 4, 5]);
        done();
      });
    });

    it('should pipe with reader', done => {
      // Given
      const data = [1, { foo: 'bar' }, 'string', true];
      const reader = new ReadableMock(data, { objectMode: true });
      // When
      reader.pipe(writer);
      // Then
      writer.on('finish', () => {
        const res = writer.data;
        expect(res).toBeInstanceOf(Array);
        expect(res).toEqual(data);
        done();
      });
    });
  });

  describe('Buffer Mode', () => {
    let writer: WritableMock;

    beforeEach(() => {
      writer = new WritableMock();
    });

    afterEach(() => {
      writer.destroy();
    });

    test('should write buffer', done => {
      // Given
      const cb = sinon.spy();
      const data = "I'm a proud string";
      // When
      for (var i = 0; i < data.length; i++) {
        writer.write(Buffer.from(data.charAt(i)), cb);
      }
      writer.end();
      // Then
      writer.on('finish', () => {
        expect(cb.callCount).toEqual(data.length);
        const buffRes = writer.flatData;
        expect(buffRes).toBeInstanceOf(Buffer);
        expect(buffRes.toString()).toEqual(data);
        done();
      });
    });

    it('should pipe with reader', done => {
      // Given
      const data = "I'm a proud string";
      const reader = new ReadableMock(data);
      // When
      reader.pipe(writer);
      // Then
      writer.on('finish', () => {
        const buffRes = writer.flatData;
        expect(buffRes).toBeInstanceOf(Buffer);
        expect(buffRes).toEqual(Buffer.from(data));
        done();
      });
    });
  });
});
