import { Writable, WritableOptions } from 'stream';

import IWritableMock from './IWritableMock';

export default class ObjectWritableMock extends Writable
  implements IWritableMock {
  data: any[];
  flatData: any[];

  constructor(options: WritableOptions = {}) {
    options.objectMode = true;
    super(options);

    this.data = [];
  }

  _write(
    chunk: any,
    _encoding: string,
    callback: (error?: Error | null) => void
  ) {
    this.data.push(chunk);
    callback();
  }

  _writev(
    chunks: Array<{ chunk: any; encoding: string }>,
    callback: (error?: Error | null) => void
  ) {
    this.data = this.data.concat(chunks.map(c => c.chunk));
    callback();
  }

  _final(callback: (error?: Error | null) => void) {
    this.flatData = [].concat(...this.data);
    callback();
  }
}
