import {DuplexMock} from './duplex'

const data = [1, 2, 3, 4, 5];
const stream = new DuplexMock([], { writableObjectMode: true });
for (const it of data) {
  stream.write(it);
}
stream.end();

stream.on('finish', () => {
  const res = stream.flatData;
});
