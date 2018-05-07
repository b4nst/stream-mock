class CommonWritable {
  _write(chunk, encoding, callback) {
    this.data.push(chunk);
    callback();
  }

  _writev(chunks, callback) {
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

  flatData() {
    if (!this._writableState.objectMode) {
      // Buffer mode, alreday flat
      return this.data;
    }
    return [].concat(...this.data);
  }
}

export default new CommonWritable();
