import * as sinon from 'sinon';

import { BufferReadableMock, ObjectReadableMock, ObjectWritableMock } from '../../src';

describe('BufferWritableMock', () => {
  let writer: ObjectWritableMock;

  beforeEach(() => {
    writer = new ObjectWritableMock();
  });

  afterEach(() => {
    writer.destroy();
  });

  test('should write array', done => {
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
    const reader = new ObjectReadableMock(data, { objectMode: true });
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
