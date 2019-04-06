/**
 * @module readable-mock
 * @requires stream.Readable
 */
import { Readable } from 'stream';

/**
 * ReadableMock take it's input from an iterable instance and emit data for each value.
 * @class
 * @extends stream.Readable
 * @memberof module:readable-mock
 */
class ReadableMock extends Readable {
  /**
   * @constructs
   * @param {*} source Source of the reader. Must be iterable.
   * @param {object} options Nodejs {@link https://nodejs.org/api/stream.html#stream_readable_streams stream.Readable} options.
   */
  constructor(source, options) {
    super(options);
    if (source === null || typeof source[Symbol.iterator] !== 'function') {
      throw new TypeError('Source must be iterable');
    }
    this._it = source[Symbol.iterator]();
  }

  /**
   * @private
   * @see {@link https://nodejs.org/api/stream.html#stream_readable_read_size_1 Nodejs documentation}
   */
  _read() {
    const next = this._it.next();
    if (next.done) {
      this.push(null);
    } else if (this._readableState.objectMode) {
      this.push(next.value);
    } else {
      const buf = Buffer.from(next.value.toString(), this._readableState.encoding);
      this.push(buf);
    }
  }
}

export default ReadableMock;
