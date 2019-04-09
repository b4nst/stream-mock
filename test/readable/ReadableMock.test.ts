import { ReadableMock } from '../../src';
import { assertEqualsOB } from '../assertions/objectMode';

describe('ReadableMock', () => {
  test('should construct when source is iterable', () => {
    const stream = new ReadableMock([], { objectMode: true });

    expect(stream).toBeInstanceOf(ReadableMock);
  });

  describe('Object Mode', () => {
    test('with array as source', done => {
      const source = [1, 2, 3, 4, 5];
      const stream = new ReadableMock(source, { objectMode: true });
      const expectedIt = source[Symbol.iterator]();

      stream.on('data', assertEqualsOB(expectedIt));
      stream.on('end', done);
    });

    test('with string as source', done => {
      const source = '12345';
      const stream = new ReadableMock(source, { objectMode: true });
      const expectedIt = source[Symbol.iterator]();

      stream.on('data', assertEqualsOB(expectedIt));
      stream.on('end', done);
    });

    test('with generator as source', done => {
      function* generator() {
        for (let i = 0; i < 5; i++) {
          yield i;
        }
      }
      const source = generator();
      const stream = new ReadableMock(source, { objectMode: true });
      const expectedIt = generator();

      stream.on('data', assertEqualsOB(expectedIt));
      stream.on('end', done);
    });
  });

  describe('Buffer Mode', () => {
    test('with buffer as source', done => {
      const source = Buffer.from('test');
      const stream = new ReadableMock(source);
      const expectedIt = source[Symbol.iterator]();

      stream.on('data', data =>
        expect(data).toEqual(Buffer.from([expectedIt.next().value]))
      );
      stream.on('end', done);
    });

    test('with string as source', done => {
      const source = 'test';
      const stream = new ReadableMock(source);
      const expectedIt = source[Symbol.iterator]();

      stream.on('data', data =>
        expect(data).toEqual(Buffer.from(expectedIt.next().value))
      );
      stream.on('end', done);
    });
  });
});
