import { Duplex, DuplexOptions } from 'stream';

import {
    BufferReadableMock, BufferWritableMock, IReadableMock, IWritableMock, ObjectReadableMock,
    ObjectWritableMock
} from '../';

export default class DuplexMock extends Duplex {
  readerMock: IReadableMock;
  writerMock: IWritableMock;

  constructor(
    source?: Iterable<any> | ArrayLike<any>,
    options: DuplexOptions = {}
  ) {
    super(options);
    this.writerMock =
      options.objectMode || options.writableObjectMode
        ? new ObjectWritableMock(options)
        : new BufferWritableMock(options);
    this.readerMock =
      options.objectMode || options.readableObjectMode
        ? new ObjectReadableMock(source, options)
        : new BufferReadableMock(source, options);
  }

  _read(size: number) {
    this.readerMock._read(size);
  }

  _write(
    chunk: any,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {
    this.writerMock._write(chunk, encoding, callback);
  }

  _writev(
    chunks: Array<{ chunk: any; encoding: string }>,
    callback: (error?: Error | null) => void
  ) {
    this.writerMock._writev(chunks, callback);
  }

  _final(callback: (error?: Error | null) => void) {
    this.writerMock._final(callback);
  }

  get data() {
    return this.writerMock.data;
  }

  get flatData() {
    return this.writerMock.flatData;
  }
}
