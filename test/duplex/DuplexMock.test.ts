import * as sinon from 'sinon';

import { DuplexMock } from '../../src';
import { assertEqualsOB } from '../assertions/objectMode';

const testReadable = (
  stream: DuplexMock,
  source: Iterable<any> | ArrayLike<any>,
  objectMode: boolean,
  cb: () => void
) => {
  const expectedIt = source[Symbol.iterator]();

  const tester = objectMode
    ? assertEqualsOB(expectedIt)
    : data => expect(data).toEqual(Buffer.from([expectedIt.next().value]));

  stream.on('data', tester);
  stream.on('end', cb);
};

const testWritable = (
  stream: DuplexMock,
  data: any,
  objectMode: boolean,
  cb: () => void
) => {
  const spy = sinon.spy();

  for (var i = 0; i < data.length; i++) {
    stream.write(
      typeof data == 'string' ? Buffer.from(data.charAt(i)) : data[i],
      spy
    );
  }
  stream.end();

  stream.on('finish', () => {
    expect(spy.callCount).toEqual(data.length);
    const res = stream.flatData;
    if (res instanceof Buffer) expect(res.toString()).toEqual(data);
    else expect(res).toEqual(data);
    cb();
  });
};

const cbWhenCount = (count: number, cb: () => void) => {
  let current = 0;
  return () => {
    current++;
    if (current >= count) cb();
  };
};

describe('DuplexMock', () => {
  test('should construct when source is iterable', () => {
    const stream = new DuplexMock([], { objectMode: true });

    expect(stream).toBeInstanceOf(DuplexMock);
  });

  describe('Half-duplex writable', () => {
    test('with array as source (Object mode)', done => {
      // Given
      const data = [1, 2, 3, 4, 5];
      const duplex = new DuplexMock([], { writableObjectMode: true });

      testWritable(duplex, data, true, done);
    });

    test('with buffer as source (Buffer mode)', done => {
      // Given
      const data = "I'm a proud string";
      const duplex = new DuplexMock([]);

      testWritable(duplex, data, false, done);
    });
  });

  describe('Half-duplex readable', () => {
    test('with array as source (Object mode)', done => {
      const source = [1, 2, 3, 4, 5];
      const stream = new DuplexMock(source, { readableObjectMode: true });

      testReadable(stream, source, true, done);
    });

    test('with buffer as source (Object mode)', done => {
      const source = Buffer.from('test');
      const stream = new DuplexMock(source);

      testReadable(stream, source, false, done);
    });
  });

  describe('Full-duplex unlinked', () => {
    test('Both mode object', done => {
      const source = [1, 2, 3, 4, 5];
      const data = [1, 2, 3, 4, 5];
      const duplex = new DuplexMock(source, { objectMode: true });
      const doneCb = cbWhenCount(2, done);

      testReadable(duplex, source, true, doneCb);
      testWritable(duplex, data, true, doneCb);
    });

    test('Both buffer', done => {
      const source = Buffer.from('test');
      const data = "I'm a proud string";
      const duplex = new DuplexMock(source);
      const doneCb = cbWhenCount(2, done);

      testReadable(duplex, source, false, doneCb);
      testWritable(duplex, data, false, doneCb);
    });

    test('Read buffer, Write object', done => {
      const source = Buffer.from('test');
      const data = [1, 2, 3, 4, 5];
      const cb = sinon.spy();
      const duplex = new DuplexMock(source, { writableObjectMode: true });
      const expectedIt = source[Symbol.iterator]();
      let oneDone = false;

      duplex.on('data', data =>
        expect(data).toEqual(Buffer.from([expectedIt.next().value]))
      );
      duplex.on('end', () => {
        if (oneDone) done();
        else oneDone = true;
      });

      data.forEach(d => duplex.write(d, cb));
      duplex.end();
      duplex.on('finish', () => {
        expect(cb.callCount).toEqual(data.length);
        const res = duplex.data;
        expect(res).toBeInstanceOf(Array);
        expect(res).toEqual(data);
        if (oneDone) done();
        else oneDone = true;
      });
    });

    test('Read object, Write buffer', done => {
      const source = [1, 2, 3, 4, 5];
      const data = "I'm a proud string";
      const cb = sinon.spy();
      const duplex = new DuplexMock(source, { readableObjectMode: true });
      const expectedIt = source[Symbol.iterator]();
      let oneDone = false;

      duplex.on('data', assertEqualsOB(expectedIt));
      duplex.on('end', () => {
        if (oneDone) done();
        else oneDone = true;
      });

      for (var i = 0; i < data.length; i++) {
        duplex.write(Buffer.from(data.charAt(i)), cb);
      }
      duplex.end();
      // Then
      duplex.on('finish', () => {
        expect(cb.callCount).toEqual(data.length);
        const buffRes = duplex.flatData;
        expect(buffRes).toBeInstanceOf(Buffer);
        expect(buffRes.toString()).toEqual(data);
        if (oneDone) done();
        else oneDone = true;
      });
    });
  });

  describe('Full-duplex linked', () => {
    test('Both mode object', done => {
      const data = [1, 2, 3, 4, 5];
      const duplex = new DuplexMock(null, { objectMode: true });

      const read = () => {
        data.forEach(d => expect(duplex.read()).toEqual(d));
        expect(duplex.read()).toBeNull();
        done();
      };
      const writeCb = cbWhenCount(data.length, read);
      data.forEach(d =>
        duplex.write(d, err => {
          expect(err).toBeUndefined();
          writeCb();
        })
      );
    });

    test('Both mode buffer', done => {
      const data = Array.from("I'm a proud string");
      const duplex = new DuplexMock(null);

      const read = () => {
        data.forEach(d => expect(duplex.read()).toEqual(Buffer.from(d)));
        expect(duplex.read()).toBeNull();
        done();
      };
      const writeCb = cbWhenCount(data.length, read);
      data.forEach(d =>
        duplex.write(d, err => {
          expect(err).toBeUndefined();
          writeCb();
        })
      );
    });

    test('Should failed if readable mode !== writable mode', () => {
      expect(
        () => new DuplexMock(null, { readableObjectMode: true })
      ).toThrowError(
        'Reader and writer should be either in full object mode or full buffer mode to be linked'
      );

      expect(
        () => new DuplexMock(null, { writableObjectMode: true })
      ).toThrowError(
        'Reader and writer should be either in full object mode or full buffer mode to be linked'
      );
    });
  });
});
