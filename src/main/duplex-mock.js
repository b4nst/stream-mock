/**
 * @module duplex-mock
 * @requires stream.Duplex
 */
import { Duplex } from 'stream';

class DuplexMock extends Duplex {
  constructor(options) {
    super(options);

    /**
     * Contains data written through this stream. If this stream is operating in object mode, it will be an Array of object, otherwise it will be a Buffer.
     * @public
     * @member {(Array.object|Buffer)}
     */
    this.data = [];
  }

  /**
   * @private
   * @see {@link https://nodejs.org/api/stream.html#stream_readable_read_size_1 Nodejs documentation}
   */
  _read() {
    if (this.data.length === 0) {
      this.push(null);
    } else if (this._readableState.objectMode) {
      this.push(this.data.shift());
    } else {
      const buf = Buffer.from(this.data.shift().toString(), this._readableState.encoding);
      this.push(buf);
    }
  }

  /**
   * Write chunk into data.
   * @see {@link https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback_1 Nodejs documentation}
   * @private
   * @param {(Buffer|string|*)} chunk The chunk to be written. Will always be a buffer unless the decodeStrings option was set to false or the stream is operating in object mode.
   * @param {string} encoding  If the chunk is a string, then encoding is the character encoding of that string. If chunk is a Buffer, or if the stream is operating in object mode, encoding may be ignored.
   * @param {function} callback Call this function (optionally with an error argument) when processing is complete for the supplied chunk.
   */
  _write(chunk, encoding, callback) {
    this.data.push(chunk);
    callback();
  }

  /**
   * Write a bunch of chunks into data.
   * @see {@link https://nodejs.org/api/stream.html#stream_writable_writev_chunks_callback Nodejs documentation}
   * @private
   * @param {Array} chunks The chunks to be written. Each chunk has following format: { chunk: ..., encoding: ... }.
   * @param {function} callback A callback function (optionally with an error argument) to be invoked when processing is complete for the supplied chunks.
   */
  _writev(chunks, callback) {
    const datas = chunks.map(c => c.chunk);
    this.data = this.data.concat(datas);
    callback();
  }

  /**
   * If the stream is not in object mode, WritableMock.data will be transformed into a Buffer.
   * @see {@link https://nodejs.org/api/stream.html#stream_writable_final_callback Nodejs documentation}
   * @private
   * @param {function} callback callback function
   */
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

  /**
   * If in object mode return flatten data. Useful for readable that returns arrays (hello ioredis).
   * @returns {(Array.object|Buffer)} The flatten data if object mode, otherwise === data
   */
  get flatData() {
    if (!this._writableState.objectMode) {
      // Buffer mode, alreday flat
      return this.data;
    }
    return [].concat(...this.data);
  }
}

export default DuplexMock;
