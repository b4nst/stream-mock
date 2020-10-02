/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { ErrorReadableMock } from '../../src';

describe('ErrorReadableMock', () => {
  test('should construct when source is error', () => {
    const stream = new ErrorReadableMock(new Error());

    expect(stream).toBeInstanceOf(ErrorReadableMock);
  });

  test('should result in streat error with given error', done => {
    const e = new Error("this is error");
    const stream = new ErrorReadableMock(e);
    stream.on('data', e => {
      fail("data callback should not be called")
    });
    stream.on('error', err => {
      expect(err).toBe(e);
      done();
    });
  });
});
