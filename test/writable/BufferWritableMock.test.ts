import * as sinon from 'sinon';

import { BufferReadableMock, BufferWritableMock } from '../../src';

describe('BufferWritableMock', () => {
  let writer: BufferWritableMock;

  beforeEach(() => {
    writer = new BufferWritableMock();
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
    const reader = new BufferReadableMock(data);
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
