/**
 * @module writable
 */
import {Writable, WritableOptions} from 'stream'

import {IChunk} from '../types'

import IWritableMock from './IWritableMock'

/**
 * ObjectWritableMock is a readable stream working in object mode.
 *
 * @example
 * ```typescript
 * import { ObjectWritableMock } from 'stream-mock';
 *
 * const writer = new ObjectWritableMock();
 * writer.write([1], err => {
 *   if (!err) console.log(writer.data);
 * });
 * writer.end();
 * writer.on('finish', () => console.log(writer.flatData));
 * ```
 * ```bash
 * >
 * [ [ 1 ] ]
 * [ 1 ]
 * ```
 */
export default class ObjectWritableMock extends Writable
  implements IWritableMock {
  /**
   * Internal buffer, filled on every write
   */
  public data: any[];
  /**
   * Data flattern, filled on final callback (when [[ObjectWritableMock.end]]) is called.
   */
  public flatData: any[];

  constructor(options: WritableOptions = {}) {
    options.objectMode = true;
    super(options);

    this.data = [];
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _write(
    chunk: any,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    this.data.push(chunk);
    callback();
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _writev(chunks: IChunk[], callback: (error?: Error | null) => void) {
    this.data = this.data.concat(chunks.map(c => c.chunk));
    callback();
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _final(callback: (error?: Error | null) => void) {
    this.flatData = [].concat(...this.data);
    callback();
  }
}
