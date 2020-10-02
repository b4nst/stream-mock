/**
 * @module readable
 */
import {Readable, ReadableOptions} from 'stream'

import IReadableMock from './IReadableMock'

/**
 * ErrorReadableMock is a readable stream that mocks error.
 *
 * @example
 * ```typescript
 * import { ErrorReadableMock } from 'stream-mock';
 *
 * const reader = new ErrorReadble(new Error("mock error"));
 * reader.on("data", () => console.log('not called'));
 * reader.on("error", e => console.log('called'));
 * ```
 */
export default class ErrorReadableMock extends Readable implements IReadableMock {
  public it: IterableIterator<any> = [][Symbol.iterator]();
  private expectedError: Error;

  /**
   *
   * @param expectedError error to be passed on callback.
   * @param options Readable stream options.
   */
  constructor(
    expectedError: Error,
    options: ReadableOptions = {}
  ) {
    super(options);
    this.expectedError = expectedError;
  }

  // tslint:disable-next-line:function-name Not responsible of this function name
  public _read() {
    this.destroy(this.expectedError);
  }
}
