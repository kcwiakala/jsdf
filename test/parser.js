'use strict';

const expect = require('chai').expect;
const test = require('./izi-test');

describe('parser', () => {
  const parser = test.rerequire('../lib/parser');

  it('Should throw exception on wrong number of output lines', () => {
    const output = 'line1';
    expect(parser.parse.bind(null, output)).to.throw(Error, 'number of lines');
  });

  it('Should throw exception on wrong number items in output line', () => {
    const output1 = 'Filesystem     1024-blocks     Used Available Capacity Mounted on\n'
      + 'udev               8090228        0   8090228       0% /dev\n'
      + 'tmpfs              1623344    10336   1613008       1% /run blablabla\n'
      + '/dev/sda1        245084444 52346272 180218904      23% /';
    expect(parser.parse.bind(null, output1)).to.throw(Error, 'number of items in line');

    const output2 = 'Filesystem     1024-blocks     Used Available Capacity Mounted on\n'
    + 'udev               8090228        0   8090228       0% /dev\n'
    + 'tmpfs              1623344   1613008       1% /run\n'
    + '/dev/sda1        245084444 52346272 180218904      23% /';
    expect(parser.parse.bind(null, output2)).to.throw(Error, 'number of items in line');
  });

  it('Should parse valid full output', () => {
    const output = 'Filesystem     1024-blocks     Used Available Capacity Mounted on\n'
      + 'udev               8090228        0   8090228       0% /dev\n'
      + 'tmpfs              1623344    10336   1613008       1% /run\n'
      + '/dev/sda1        245084444 52346272 180218904      23% /\n'
      + 'tmpfs              8116700   187768   7928932       3% /dev/shm\n'
      + 'tmpfs                 5120        4      5116       1% /run/lock\n';
    const result = parser.parse(output);
    expect(result).to.have.all.keys('/', '/dev', '/run', '/dev/shm', '/run/lock');
    expect(result['/dev/shm']).to.deep.equal({
      filesystem: 'tmpfs',
      blocks: 8116700,
      used: 187768,
      available: 7928932,
      fill: 0.03
    });
    expect(result['/']).to.deep.equal({
      filesystem: '/dev/sda1',
      blocks: 245084444,
      used: 52346272,
      available: 180218904,
      fill: 0.23
    });
  });
});