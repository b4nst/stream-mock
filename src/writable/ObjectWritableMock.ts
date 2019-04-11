import { Writable, WritableOptions } from 'stream';

import { IChunk } from '../types';

import IWritableMock from './IWritableMock';

export default class ObjectWritableMock extends Writable
  implements IWritableMock {
  public data: any[];
  public flatData: any[];

  constructor(options: WritableOptions = {}) {
    options.objectMode = true;
    super(options);

    this.data = [];
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _write(
    chunk: any,
    _encoding: string,
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
