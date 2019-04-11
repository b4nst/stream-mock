import { Readable, ReadableOptions } from 'stream';

import { WARNINGS } from '../constant';
import { any2Buffer } from '../helpers/converters/any2Buffer';
import warnOnce from '../helpers/warnOnce';

import BufferReadableMock from './BufferReadableMock';
import IReadableMock from './IReadableMock';
import ObjectReadableMock from './ObjectReadableMock';

/**
 * ReadableMock take it's input from an iterable instance and emit data for each value.
 */
export default class ReadableMock extends Readable implements IReadableMock {
  it: IterableIterator<any>;
  objectMode: boolean;
  readableObjectMode: boolean;
  encoding: string;

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

  _read(_size: number) {
    const next = this.it.next();

    if (next.done) this.push(null);
    else if (this.objectMode || this.readableObjectMode) this.push(next.value);
    else this.push(any2Buffer(next.value, this.encoding));
  }
}
