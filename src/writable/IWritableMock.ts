/**
 * @module writable
 */
import { Writable } from 'stream';

export default interface IWritableMock extends Writable {
  data: any[] | Buffer;
  flatData: any[] | Buffer;
}
