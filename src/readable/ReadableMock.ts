import { Readable, ReadableOptions } from 'stream';

import BufferReadableMock from './BufferReadableMock';
import IReadableMock from './IReadableMock';
import ObjectReadableMock from './ObjectReadableMock';

/**
 * ReadableMock take it's input from an iterable instance and emit data for each value.
 */
export default class ReadableMock extends Readable implements IReadableMock {
  private innerReadable: IReadableMock;

  constructor(
    source: ReadonlyArray<any> | Buffer | Uint8Array | string,
    options?: ReadableOptions
  ) {
    super(options);
    this.innerReadable =
      options.objectMode && (typeof source == 'string' || Array.isArray(source))
        ? new ObjectReadableMock(source, options)
        : new BufferReadableMock(source, options);
  }

  _read(size: number) {
    this.innerReadable._read(size);
  }

  get it() {
    return this.innerReadable.it;
  }
}
