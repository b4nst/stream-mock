import { Chunk } from '../../types';

export const chunk2Buffer = (chunk: Chunk) =>
  typeof chunk.chunk === 'string'
    ? Buffer.from(chunk.chunk, chunk.encoding)
    : chunk.chunk;
