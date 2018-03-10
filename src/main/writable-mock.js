import { Writable } from 'stream';

export default class WritableMock extends Writable {
  constructor(options) {
    super(options);
    this.data = [];
  }

  _write(chunk, encoding, callback) {
    this.data.push(chunk);
    callback();
  }

  _writev(chunks, encoding, callback) {
    const datas = chunks.map(c => c.chunk);
    this.data = this.data.concat(datas);
    callback();
  }

  _final(callback) {
    if (!this._writableState.objectMode) {
      const length = this.data.reduce((acc, curr) => {
        acc += curr.length;
        return acc;
      }, 0);
      const buf = Buffer.alloc(length);
      let offset = 0;
      for (const d of this.data) {
        d.copy(buf, offset);
        offset += d.length;
      }
      this.data = buf;
    }
    callback();
  }
}
