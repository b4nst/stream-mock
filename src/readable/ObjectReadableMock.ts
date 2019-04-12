/**
 * @module readable
 */
import { Readable, ReadableOptions } from 'stream';

import IReadableMock from './IReadableMock';

/**
 * ObjectReadableMock is a readable stream working in object mode.
 *
 * @example
 * ```typescript
 * import { ObjectReadableMock } from 'stream-mock';
 *
 * const reader = new ObjectReadableMock([1, 2, 3]);
 * reader.on('data', console.log);
 * ```
 */
export default class ObjectReadableMock extends Readable
  implements IReadableMock {
  public it: IterableIterator<any>;

  /**
   *
   * @param source Reader source
   * @param options Readable stream options. objectMode will be overrited to true.
   */
  constructor(
    source: Iterable<any> | ArrayLike<any>,
    options: ReadableOptions = {}
  ) {
    options.objectMode = true;
    super(options);
    this.it = source[Symbol.iterator]();
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _read() {
    const next = this.it.next();
    this.push(next.done ? null : next.value);
  }
}
