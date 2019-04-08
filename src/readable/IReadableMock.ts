import { Readable } from 'stream';

export default interface IReadableMock extends Readable {
  it: IterableIterator<any>;
}
