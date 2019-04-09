import { Readable, ReadableOptions } from 'stream';

import IReadableMock from './IReadableMock';

export default class ObjectReadableMock extends Readable
  implements IReadableMock {
  it: IterableIterator<any>;

  constructor(
    source: Iterable<any> | ArrayLike<any>,
    options: ReadableOptions = {}
  ) {
    options.objectMode = true;
    super(options);
    this.it = source[Symbol.iterator]();
  }

  _read() {
    const next = this.it.next();
    this.push(next.done ? null : next.value);
  }
}
