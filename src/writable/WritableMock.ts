import { Writable, WritableOptions } from 'stream';

import { WARNINGS } from '../constant';
import { chunk2Buffer } from '../helpers';
import warnOnce from '../helpers/warnOnce';

import IWritableMock from './IWritableMock';

export default class WritableMock extends Writable implements IWritableMock {
  objectMode: boolean;
  data: any[];
  flatData: any[] | Buffer;

  constructor(options: WritableOptions = {}) {
    warnOnce(WARNINGS.DEP_WRITABLE_MOCK);
    super(options);
    this.objectMode = options.objectMode;
    this.data = [];
  }

  _write(
    chunk: any,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {
    this.data.push(this.objectMode ? chunk : chunk2Buffer({ chunk, encoding }));
    callback();
  }

  _writev(
    chunks: Array<{ chunk: any; encoding: string }>,
    callback: (error?: Error | null) => void
  ) {
    this.data = this.objectMode
      ? this.data.concat(chunks.map(c => c.chunk))
      : this.data.concat(chunks.map(chunk2Buffer));
    callback();
  }

  _final(callback: (error?: Error | null) => void) {
    this.flatData = this.objectMode
      ? [].concat(...this.data)
      : Buffer.concat(this.data);
    callback();
  }
}
