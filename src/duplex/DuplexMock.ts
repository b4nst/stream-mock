import { Duplex, DuplexOptions } from 'stream';

import applyMixins from '../helpers/applyMixins';
import { ReadableMock } from '../readable';
import { WritableMock } from '../writable';

class DuplexMock extends Duplex implements WritableMock, ReadableMock {
  it: IterableIterator<any>;
  objectMode: boolean;
  readableObjectMode: boolean;
  writableObjectMode: boolean;
  data: any[];
  flatData: any[] | Buffer;
  encoding: string;

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
    } else if (this.readableObjectMode == this.writableObjectMode) {
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
