import { Writable, WritableOptions } from 'stream';

import { WARNINGS } from '../constant';
import warnOnce from '../helpers/warnOnce';

import BufferWritableMock from './BufferWritableMock';
import IWritableMock from './IWritableMock';
import ObjectWritableMock from './ObjectWritableMock';

export default class WritableMock extends Writable implements IWritableMock {
  private innerWritable: IWritableMock;

  constructor(options: WritableOptions = {}) {
    warnOnce(WARNINGS.DEP_WRITABLE_MOCK);
    super(options);
    if (options.objectMode)
      this.innerWritable = new ObjectWritableMock(options);
    else this.innerWritable = new BufferWritableMock(options);
  }

  _write(
    chunk: any,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {
    this.innerWritable._write(chunk, encoding, callback);
  }

  _writev(
    chunks: Array<{ chunk: any; encoding: string }>,
    callback: (error?: Error | null) => void
  ) {
    this.innerWritable._writev(chunks, callback);
  }

  _final(callback: (error?: Error | null) => void) {
    this.innerWritable._final(callback);
  }

  get data() {
    return this.innerWritable.data;
  }

  get flatData() {
    return this.innerWritable.flatData;
  }
}
