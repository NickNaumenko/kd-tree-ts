const fs = require('fs');

const readInput = (n, src) => {
  const readStream = fs.createReadStream(src, 'ascii');

  const parseStr = str =>
    str
      .trim()
      .split(' ')
      .map(char => parseFloat(char));
  const parseData = data =>
    data
      .trim()
      .split('\n')
      .map(parseStr);

  return new Promise(res => {
    let data = '';
    readStream.on('data', chunk => (data += chunk));
    readStream.on('end', () => res(parseData(data)));
  });
};

module.exports = readInput;
