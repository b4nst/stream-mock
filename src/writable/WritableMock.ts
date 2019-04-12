/**
 * @module writable
 */
import { Writable, WritableOptions } from 'stream';

import { WARNINGS } from '../constant';
import { chunk2Buffer } from '../helpers';
import warnOnce from '../helpers/warnOnce';
import { IChunk } from '../types';

import IWritableMock from './IWritableMock';

export default class WritableMock extends Writable implements IWritableMock {
  public objectMode: boolean;
  public writableObjectMode: boolean;
  public data: any[];
  public flatData: any[] | Buffer;

  constructor(options: WritableOptions = {}) {
    warnOnce(WARNINGS.DEP_WRITABLE_MOCK);
    super(options);
    this.objectMode = options.objectMode;
    this.writableObjectMode = options.objectMode;
    this.data = [];
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _write(
    chunk: any,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {
    this.data.push(
      this.objectMode || this.writableObjectMode
        ? chunk
        : chunk2Buffer({ chunk, encoding })
    );
    callback();
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _writev?(chunks: IChunk[], callback: (error?: Error | null) => void) {
    this.data =
      this.objectMode || this.writableObjectMode
        ? this.data.concat(chunks.map(c => c.chunk))
        : this.data.concat(chunks.map(chunk2Buffer));
    callback();
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _final(callback: (error?: Error | null) => void) {
    this.flatData =
      this.objectMode || this.writableObjectMode
        ? [].concat(...this.data)
        : Buffer.concat(this.data);
    callback();
  }
}
