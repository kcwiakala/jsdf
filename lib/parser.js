'use strict';

const os = require('os');

function parseLine(line) {
  const items = line.split(/\s+/);
  if(items.length != 6) {
    throw new Error('Unexpected number of items in line: ' + line);
  }
  return [items[5], {
    filesystem: items[0],
    blocks: parseInt(items[1]),
    used: parseInt(items[2]),
    available: parseInt(items[3]),
    fill: parseInt(items[4]) / 100
  }];
}

exports.parse = (output) => {
  let result = {};
  const lines = output.trim().split(os.EOL);
  const count = lines.length;
  if(count < 2) {
    throw new Error('Unexpected number of lines in output: ' + count);
  }
  for(let idx = 1; idx < count; idx += 1) {
    const parsed = parseLine(lines[idx]);
    result[parsed[0]] = parsed[1];
  }
  return result;
}