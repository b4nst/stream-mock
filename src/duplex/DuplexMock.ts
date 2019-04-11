import { Duplex, DuplexOptions } from 'stream';

import {
    BufferReadableMock, BufferWritableMock, IReadableMock, IWritableMock, ObjectReadableMock,
    ObjectWritableMock
} from '../';

export default class DuplexMock extends Duplex {
  objectMode: boolean;
  writeObjectMode: boolean;
  readObjectMode: boolean;
  data: any[];
  flatData: any[];

  constructor(
    source?: Iterable<any> | ArrayLike<any>,
    options: DuplexOptions = {}
  ) {
    super(options);
  }

  _read(size: number) {}

  _write(
    chunk: any,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {}

  _writev(
    chunks: Array<{ chunk: any; encoding: string }>,
    callback: (error?: Error | null) => void
  ) {}

  _final(callback: (error?: Error | null) => void) {}
}
