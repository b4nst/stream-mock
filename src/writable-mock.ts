import { Writable, WritableOptions } from 'stream';

class WritableMock extends Writable {
  private _data: any[];
  private _buff: Buffer;
  private _writableState: WritableOptions;

  constructor(options) {
    super(options);
    this._data = [];
  }

  _write(
    chunk: any,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {
    if (!this._writableState.decodeStrings || this._writableState.objectMode)
      this._data.push(chunk);
    else this._data.push(Buffer.from(chunk, encoding));
    callback();
  }

  _writev(
    chunks: Array<{ chunk: any; encoding: string }>,
    callback: (error?: Error | null) => void
  ) {
    this._data = this._data.concat(chunks.map(c => c.chunk));
    callback();
  }

  _final(callback) {
    if (!this._writableState.objectMode) {
      const length = this._data.reduce((acc, curr) => {
        acc += curr.length;
        return acc;
      }, 0);
      const buf = Buffer.alloc(length);
      let offset = 0;
      for (const d of this.data) {
        d.copy(buf, offset);
        offset += d.length;
      }
      this._buff = buf;
    }
    callback();
  }

  get data() {
    return this._writableState.objectMode ? this._data : this._buff;
  }

  get flatData() {
    return this._writableState.objectMode
      ? [].concat(...this._data)
      : this._buff;
  }
}

export default WritableMock;
