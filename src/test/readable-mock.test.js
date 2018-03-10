/* eslint-env mocha */
import chai from 'chai';

import ReadableMock from '../main/readable-mock';

describe('ReadableMock', () => {
  const should = chai.should();

  it('should construct when source is iterable', () => {
    const stream = new ReadableMock([]);

    stream.should.be.an.instanceOf(ReadableMock);
  });

  it('should throw when source is not iterable', () => {
    should.throw(() => new ReadableMock({}), TypeError);
  });

  const createStreamTestCases = function (objectMode) {
    const options = { objectMode };

    function assertDataMatch(actual, expected) {
      if (objectMode) {
        actual.should.equal(expected);
      } else {
        actual.equals(Buffer.from(expected.toString())).should.be.true;
      }
    }

    return function () {
      it('should produce data from array source', done => {
        const source = [1, 2, 3, 4, 5];
        const stream = new ReadableMock(source, options);
        let index = 0;

        stream.on('data', data => assertDataMatch(data, source[index++]));
        stream.on('end', done);
      });

      it('should produce data from generator source', done => {
        const arr = [1, 2, 3, 4, 5];
        const gen = function* () {
          for (let i = 0; i < arr.length; i++) {
            yield arr[i];
          }
        };
        const stream = new ReadableMock(gen(), options);
        let index = 0;

        stream.on('data', data => assertDataMatch(data, arr[index++]));
        stream.on('end', done);
      });

      it('should produce data from string source', done => {
        const source = '12345';
        const stream = new ReadableMock(source, options);
        let index = 0;

        stream.on('data', data => assertDataMatch(data, source[index++]));
        stream.on('end', done);
      });
    };
  };

  describe('Object mode', createStreamTestCases(true));
  describe('Normal (Buffer) mode', createStreamTestCases(false));
});
