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
    this.readableObjectMode = options.readableObjectMode;
    this.writableObjectMode = options.writableObjectMode;
    this.data = [];
    this.it = source ? source[Symbol.iterator]() : this.data[Symbol.iterator]();
  }
}

applyMixins(DuplexMock, [ReadableMock, WritableMock]);

export default DuplexMock;
