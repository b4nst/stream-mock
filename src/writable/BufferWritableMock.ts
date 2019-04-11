import { Writable, WritableOptions } from 'stream';

import { chunk2Buffer } from '../helpers';

import IWritableMock from './IWritableMock';

export default class BufferWritableMock extends Writable
  implements IWritableMock {
  public data: Buffer[];
  public flatData: Buffer;

  constructor(options: WritableOptions = {}) {
    options.objectMode = false;
    super(options);
    this.data = [];
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _write(
    chunk: Buffer | string,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {
    this.data.push(chunk2Buffer({ chunk, encoding }));
    callback();
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _writev(
    chunks: { chunk: Buffer | string; encoding: string }[],
    callback: (error?: Error | null) => void
  ) {
    this.data = this.data.concat(chunks.map(chunk2Buffer));
    callback();
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _final(callback: (error?: Error | null) => void) {
    this.flatData = Buffer.concat(this.data);
    callback();
  }
}
