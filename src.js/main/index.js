import readable from './readable-mock';
import writable from './writable-mock';
import duplex from './duplex-mock';

export const ReadableMock = readable;
export const WritableMock = writable;
export const DuplexMock = duplex;

export default {
  ReadableMock: readable,
  WritableMock: writable,
  DuplexMock: duplex
};
