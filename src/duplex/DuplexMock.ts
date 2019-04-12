/**
 * @module duplex
 */
import { Duplex, DuplexOptions } from 'stream';

import applyMixins from '../helpers/applyMixins';
import { ReadableMock } from '../readable';
import { WritableMock } from '../writable';

/**
 * DuplexMock extends both [[WritableMock]] and [[ReadableMock]].
 * If no source is provided, the DuplexMock will try to work in linked mode : the writer output will be linked to the reader input.
 * This special mode is only available if writer and reader are in same mode (object or buffer).
 *
 * @example
 * ```typescript
 * import { DuplexMock } from 'stream-mock';
 *
 * // Not linked
 * const duplex = new DuplexMock([1, 2, 3], { objectMode: true });
 * duplex.write(7, err => {
 *     if(!err) {
 *         const res = duplex.read() // res == 1
 *     }
 * })
 *
 * //Linked
 * const lduplex = new DuplexMock(null, { objectMode: true });
 * lduplex.write(7, err => {
 *     if(!err) {
 *         const res = duplex.read() // res == 7
 *     }
 * })
 * ```
 */
class DuplexMock extends Duplex implements WritableMock, ReadableMock {
  public it: IterableIterator<any>;
  public objectMode: boolean;
  public readableObjectMode: boolean;
  public writableObjectMode: boolean;
  public data: any[];
  public flatData: any[] | Buffer;
  public encoding: string;

  /**
   * @param source Source data for reader. If null will be linked to writer output
   * @param options Duplex options.
   */
  constructor(
    source?: Iterable<any> | ArrayLike<any>,
    options: DuplexOptions = {}
  ) {
    super(options);
    this.objectMode = options.objectMode;
    this.readableObjectMode = options.objectMode || options.readableObjectMode;
    this.writableObjectMode = options.objectMode || options.writableObjectMode;
    this.data = [];
    if (source) {
      this.it = source[Symbol.iterator]();
    } else if (this.readableObjectMode === this.writableObjectMode) {
      this.it = this.data[Symbol.iterator]();
    } else {
      throw new Error(
        'Reader and writer should be either in full object mode or full buffer mode to be linked'
      );
    }
  }
}

applyMixins(DuplexMock, [ReadableMock, WritableMock]);

export default DuplexMock;
