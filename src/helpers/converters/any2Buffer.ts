/**
 * @module helpers
 */
export const any2Buffer = (value: any, encoding: BufferEncoding): Buffer =>
  Number.isInteger(value) ? Buffer.from([value]) : Buffer.from(value, encoding);
