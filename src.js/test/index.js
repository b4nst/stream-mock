/* eslint-env mocha */
/* eslint-disable import/no-named-as-default-member */
import { Readable, Writable } from 'stream';
import chai from 'chai';

import mock, { ReadableMock as RM, WritableMock as WM } from '../main';
import ReadableMock from '../main/readable-mock';
import WritableMock from '../main/writable-mock';

chai.should();

describe('Main module', () => {
  it('should export ReadableMock', () => {
    // Given
    const rm = new RM([]);
    // Then
    rm.should.be.an.instanceOf(ReadableMock);
    rm.should.be.an.instanceOf(Readable);
  });

  it('should export WritableMock', () => {
    // Given
    const wm = new WM();
    // Then
    wm.should.be.an.instanceOf(WritableMock);
    wm.should.be.an.instanceOf(Writable);
  });

  it('should export {ReadableMock, WritableMock} as default', () => {
    (new mock.ReadableMock([])).should.be.an.instanceOf(ReadableMock);
    (new mock.WritableMock()).should.be.an.instanceOf(WritableMock);
  });
});
