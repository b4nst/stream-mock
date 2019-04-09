export const chunk2Buffer = (chunk: {
  chunk: Buffer | string;
  encoding: string;
}) =>
  typeof chunk.chunk == 'string'
    ? Buffer.from(chunk.chunk, chunk.encoding)
    : chunk.chunk;
