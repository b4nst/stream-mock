/**
 * @module readable
 */
import {Readable, ReadableOptions} from 'stream'

import {any2Buffer} from '../helpers/converters/any2Buffer'

import IReadableMock from './IReadableMock'

/**
 * BufferReadableMock is a readable stream working in normal (buffer) mode.
 *
 * @example
 * ```typescript
 * import { BufferReadableMock } from 'stream-mock';
 *
 * const reader = new BufferReadableMock('Some text');
 * reader.pipe(process.stdout);
 * ```
 */
export default class BufferReadableMock extends Readable
  implements IReadableMock {
  public it: IterableIterator<any>;
  public encoding: BufferEncoding;

  /**
   *
   * @param source Reader source. Will be transform into buffer
   * @param options Readable stream options. objectMode will be overrited to false.
   */
  constructor(
    source: Iterable<any> | ArrayLike<any>,
    options: ReadableOptions = {}
  ) {
    options.objectMode = false;
    super(options);
    this.it = source[Symbol.iterator]();
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _read() {
    const next = this.it.next();
    if (next.done) {
      this.push(null);
    } else {
      this.push(any2Buffer(next.value, this.encoding));
    }
  }
}
