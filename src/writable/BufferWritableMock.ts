import { Writable, WritableOptions } from 'stream';

import { chunk2Buffer } from '../helpers';

import IWritableMock from './IWritableMock';

export default class BufferWritableMock extends Writable
  implements IWritableMock {
  data: Buffer[];
  flatData: Buffer;

  constructor(options: WritableOptions = {}) {
    options.objectMode = false;
    super(options);
    this.data = [];
  }

  _write(
    chunk: Buffer | string,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {
    this.data.push(chunk2Buffer({ chunk, encoding }));
    callback();
  }

  _writev(
    chunks: Array<{ chunk: Buffer | string; encoding: string }>,
    callback: (error?: Error | null) => void
  ) {
    this.data = this.data.concat(chunks.map(chunk2Buffer));
    callback();
  }

  _final(callback: (error?: Error | null) => void) {
    this.flatData = Buffer.concat(this.data);
    callback();
  }
}
