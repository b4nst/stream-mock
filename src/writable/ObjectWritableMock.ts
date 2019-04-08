import { Writable, WritableOptions } from 'stream';

import IWritableMock from './IWritableMock';

export default class ObjectWritableMock extends Writable
  implements IWritableMock {
  data: any[];

  constructor(options: WritableOptions = {}) {
    options.objectMode = false;
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

  get flatData() {
    return [].concat(...this.data);
  }
}
