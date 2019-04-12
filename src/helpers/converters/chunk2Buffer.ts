/**
 * @module helpers
 */
import { IChunk } from '../../types';

export const chunk2Buffer = (chunk: IChunk) =>
  typeof chunk.chunk === 'string'
    ? Buffer.from(chunk.chunk, chunk.encoding)
    : chunk.chunk;
