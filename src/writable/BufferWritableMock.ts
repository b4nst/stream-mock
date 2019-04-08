import { Writable, WritableOptions } from 'stream';

import IWritableMock from './IWritableMock';

const chunk2Buffer = (chunk: { chunk: Buffer | string; encoding: string }) =>
  typeof chunk.chunk == 'string'
    ? Buffer.from(chunk.chunk, chunk.encoding)
    : chunk.chunk;

export default class BufferWritableMock extends Writable
  implements IWritableMock {
  private datas: Buffer[];
  data: Buffer;

  constructor(options: WritableOptions = {}) {
    options.objectMode = false;
    super(options);

    this.datas = [];
  }

  _write(
    chunk: Buffer | string,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {
    this.datas.push(chunk2Buffer({ chunk, encoding }));
    callback();
  }

  _writev(
    chunks: Array<{ chunk: Buffer | string; encoding: string }>,
    callback: (error?: Error | null) => void
  ) {
    this.datas = this.datas.concat(chunks.map(chunk2Buffer));
    callback();
  }

  _final(callback: (error?: Error | null) => void) {
    this.data = Buffer.concat(this.datas);
    callback();
  }

  get flatData() {
    return this.data;
  }
}
