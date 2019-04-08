/**
 * @module readable-mock
 * @requires stream.Readable
 */
import { Readable, ReadableOptions } from 'stream';

/**
 * ReadableMock take it's input from an iterable instance and emit data for each value.
 */
class ReadableMock extends Readable {
  private it: IterableIterator<any>;

  /**
   * @constructs
   * @param source Source of the reader. Must be iterable.
   * @param options Nodejs {@link https://nodejs.org/api/stream.html#stream_readable_streams stream.Readable} options.
   */
  constructor(source: ReadonlyArray<any> | String, options?: ReadableOptions) {
    super(options);
    if (source === null || typeof source[Symbol.iterator] !== 'function') {
      throw new TypeError('Source must be iterable');
    }
    this.it = source[Symbol.iterator]();
  }

  /**
   * @private
   * @see {@link https://nodejs.org/api/stream.html#stream_readable_read_size_1 Nodejs documentation}
   */
  _read() {
    const next = this.it.next();
    // @ts-ignore: Need an implementation to get readable state publicly
    const readableState: any = this._readableState;

    let value;
    if (next.done) {
      value = null;
    } else if (readableState.objectMode) {
      value = next.value;
    } else {
      const encoding: string = readableState.decoder
        ? readableState.decoder.encoding
        : readableState.defaultEncoding;
      Buffer.from(next.value.toString(), encoding);
    }

    this.push(value);
  }
}

export default ReadableMock;
