import { Writable, WritableOptions } from 'stream';

import { WARNINGS } from '../constant';
import { chunk2Buffer } from '../helpers';
import warnOnce from '../helpers/warnOnce';

import IWritableMock from './IWritableMock';

export default class WritableMock extends Writable implements IWritableMock {
  objectMode: boolean;
  writableObjectMode: boolean;
  data: any[];
  flatData: any[] | Buffer;

  constructor(options: WritableOptions = {}) {
    warnOnce(WARNINGS.DEP_WRITABLE_MOCK);
    super(options);
    this.objectMode = options.objectMode;
    this.writableObjectMode = options.objectMode;
    this.data = [];
  }

  _write(
    chunk: any,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {
    this.data.push(
      this.objectMode || this.writableObjectMode
        ? chunk
        : chunk2Buffer({ chunk, encoding })
    );
    callback();
  }

  _writev?(
    chunks: Array<{ chunk: any; encoding: string }>,
    callback: (error?: Error | null) => void
  ) {
    this.data =
      this.objectMode || this.writableObjectMode
        ? this.data.concat(chunks.map(c => c.chunk))
        : this.data.concat(chunks.map(chunk2Buffer));
    callback();
  }

  _final(callback: (error?: Error | null) => void) {
    this.flatData =
      this.objectMode || this.writableObjectMode
        ? [].concat(...this.data)
        : Buffer.concat(this.data);
    callback();
  }
}
