export const assertEqualsOB = (expected: IterableIterator<any>) => (
  actual: any
) => expect(actual).toBe(expected.next().value);
