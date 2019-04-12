/**
 * @module readable
 */
import { Readable, ReadableOptions } from 'stream';

import { WARNINGS } from '../constant';
import { any2Buffer } from '../helpers/converters/any2Buffer';
import warnOnce from '../helpers/warnOnce';

import IReadableMock from './IReadableMock';

/**
 * ReadableMock take it's input from an iterable instance and emit data for each value.
 * @deprecated Please use [[BufferReadableMock]] or [[ObjectReadableMock]] to get a better type accuracy.
 */
export default class ReadableMock extends Readable implements IReadableMock {
  public it: IterableIterator<any>;
  public objectMode: boolean;
  public readableObjectMode: boolean;
  public encoding: string;

  /**
   *
   * @param source Reader source
   * @param options Readable stream options.
   */
  constructor(
    source: Iterable<any> | ArrayLike<any>,
    options: ReadableOptions = {}
  ) {
    warnOnce(WARNINGS.DEP_READABLE_MOCK);
    super(options);
    this.objectMode = options.objectMode;
    this.readableObjectMode = options.objectMode;
    this.encoding = options.encoding ? options.encoding : 'utf8';
    this.it = source[Symbol.iterator]();
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _read(_size: number) {
    const next = this.it.next();

    if (next.done) {
      this.push(null);
    } else if (this.objectMode || this.readableObjectMode) {
      this.push(next.value);
    } else {
      this.push(any2Buffer(next.value, this.encoding));
    }
  }
}
