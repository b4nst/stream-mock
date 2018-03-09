import { Readable } from 'stream';

export default class ReadableMock extends Readable {
  constructor(source, options) {
    super(options);
    if (source === null || typeof source[Symbol.iterator] !== 'function') {
      throw new TypeError('Source must be iterable');
    }
    this._it = source[Symbol.iterator]();
  }

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
