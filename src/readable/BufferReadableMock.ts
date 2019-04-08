import { Readable, ReadableOptions } from 'stream';

import IReadableMock from './IReadableMock';

export default class BufferReadableMock extends Readable
  implements IReadableMock {
  it: IterableIterator<any>;
  private encoding: string;

  constructor(
    source: ReadonlyArray<any> | Buffer | Uint8Array | string,
    options: ReadableOptions = {}
  ) {
    options.objectMode = false;
    super(options);
    this.encoding = options.encoding ? options.encoding : 'utf8';
    this.it = source[Symbol.iterator]();
  }

  _read() {
    const next = this.it.next();
    this.push(
      next.done ? null : Buffer.from(next.value.toString(), this.encoding)
    );
  }
}
