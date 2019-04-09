import { BufferReadableMock } from '../../src';

describe('BufferReadableMock', () => {
  test('should construct when source is iterable', () => {
    const stream = new BufferReadableMock([]);

    expect(stream).toBeInstanceOf(BufferReadableMock);
  });

  test('with buffer as source', done => {
    const source = Buffer.from('test');
    const stream = new BufferReadableMock(source);
    const expectedIt = source[Symbol.iterator]();

    stream.on('data', data =>
      expect(data).toEqual(Buffer.from([expectedIt.next().value]))
    );
    stream.on('end', done);
  });

  test('with string as source', done => {
    const source = 'test';
    const stream = new BufferReadableMock(source);
    const expectedIt = source[Symbol.iterator]();

    stream.on('data', data =>
      expect(data).toEqual(Buffer.from(expectedIt.next().value))
    );
    stream.on('end', done);
  });
});
