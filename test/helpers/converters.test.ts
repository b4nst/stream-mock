import {chunk2Buffer} from '../../src/helpers/converters'
import {IChunk} from '../../src/types'

describe('Chunk to Buffer convertion', () => {
  test('with string as chunk', () => {
    const chunk: IChunk = { chunk: 'hello', encoding: 'utf-8' };

    const converted = chunk2Buffer(chunk);
    expect(converted).toBeInstanceOf(Buffer);
    expect(converted.toString(chunk.encoding)).toEqual(chunk.chunk);
  });

  test('with buffer as chunk', () => {
    const chunk: IChunk = { chunk: Buffer.from('hello'), encoding: 'utf-8' };

    const converted = chunk2Buffer(chunk);
    expect(converted).toBeInstanceOf(Buffer);
    expect(converted).toEqual(chunk.chunk);
  });
});
