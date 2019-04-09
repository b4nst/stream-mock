/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { ObjectReadableMock } from '../../src';
import { assertEqualsOB } from '../assertions/objectMode';

describe('ObjectReadableMock', () => {
  test('should construct when source is iterable', () => {
    const stream = new ObjectReadableMock([]);

    expect(stream).toBeInstanceOf(ObjectReadableMock);
  });

  test('with array as source', done => {
    const source = [1, 2, 3, 4, 5];
    const stream = new ObjectReadableMock(source);
    const expectedIt = source[Symbol.iterator]();

    stream.on('data', assertEqualsOB(expectedIt));
    stream.on('end', done);
  });

  test('with string as source', done => {
    const source = '12345';
    const stream = new ObjectReadableMock(source);
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
    const stream = new ObjectReadableMock(source);
    const expectedIt = generator();

    stream.on('data', assertEqualsOB(expectedIt));
    stream.on('end', done);
  });
});
