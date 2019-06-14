/**
 * @module writable
 */
import {Writable, WritableOptions} from 'stream'

import {chunk2Buffer} from '../helpers'

import IWritableMock from './IWritableMock'

/**
 * BufferWritableMock is a writable stream working in normal (buffer) mode.
 *
 * @example
 * ```typescript
 * import { BufferWritableMock } from 'stream-mock';
 *
 * const writer = new BufferWritableMock();
 * writer.write('l', err => {
 *   if (!err) console.log(writer.data);
 * });
 * writer.end();
 * writer.on('finish', () => console.log(writer.flatData.toString()));
 * ```
 * ```bash
 * >
 * [ <Buffer 6c> ]
 * l
 * ```
 */
export default class BufferWritableMock extends Writable
  implements IWritableMock {
  /**
   * Internal buffer, filled on every write
   */
  public data: Buffer[];
  /**
   * Data flattern, filled on final callback (when [[BufferWritableMock.end]]) is called.
   */
  public flatData: Buffer;

  /**
   * @param options Writable options. objectMode will be overwritten to false.
   */
  constructor(options: WritableOptions = {}) {
    options.objectMode = false;
    super(options);
    this.data = [];
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _write(
    chunk: Buffer | string,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    this.data.push(chunk2Buffer({ chunk, encoding }));
    callback();
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _writev(
    chunks: { chunk: Buffer | string; encoding: BufferEncoding }[],
    callback: (error?: Error | null) => void
  ) {
    this.data = this.data.concat(chunks.map(chunk2Buffer));
    callback();
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _final(callback: (error?: Error | null) => void) {
    this.flatData = Buffer.concat(this.data);
    callback();
  }
}
