export const any2Buffer = (value: any, encoding: string): Buffer =>
  Number.isInteger(value) ? Buffer.from([value]) : Buffer.from(value, encoding);
