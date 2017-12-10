'use strict';

const expect = require('chai').expect;
const test = require('./izi-test');
const Mock = require('jsmock').Mock;
const child_process = require('child_process');

describe('df', () => {
  // let mock = new test.Mock(child_process);

  // mock.replace('exec', (command, cb) => {
  //   mock._command = command;
  //   cb(mock._error, mock._stdout, mock._stderr);
  // });

  let mock = new Mock(child_process);
  const df = test.rerequire('../lib/df');

  beforeEach(() => {
    mock._error = null;
    mock._stdout = null;
    mock._stderr = null;
  });

  after(() => {
    mock.cleanup();
    test.release('../lib/df');
  });

  it('Should add arguments from the list to the command', (done) => {
    mock.expectCall('exec')
      .matching(cmd => cmd === 'df -a -b .')
      .willOnce((args, cb) => cb(null, 'df output', null));

    df(['-a', '-b', '.'], (err, out) => mock.verify(done));
  });

  it('Should add arguments from the string to the command', (done) => {
    mock.expectCall('exec')
      .matching(cmd => cmd === 'df -a -b .')
      .willOnce((args, cb) => cb(null, 'df output', null));

    df('-a -b .', (err, out) => {
      expect(out).to.be.equal('df output');
      mock.verify(done);
    });
  });

  it('Should accept empty command argument list', (done) => {
    mock.expectCall('exec')
      .matching(cmd => cmd === 'df')
      .willOnce((args, cb) => cb(null, 'df output', null));

    df([], (err, out) => {
      expect(out).to.be.equal('df output');
      mock.verify(done);
    });
  });

  it('Should perform default action if no arguments provided', (done) => {
    mock.expectCall('exec')
      .matching(cmd => cmd === 'df')
      .willOnce((args, cb) => cb(null, 'df output', null));

    df((err, out) => {
      expect(out).to.be.equal('df output');
      mock.verify(done);
    });
  });

  it('Should propagate error from exec', (done) => {
    const error = new Error('Test Error');
    mock.expectCall('exec')
      .matching(cmd => cmd === 'df')
      .willOnce((args, cb) => cb(error, null, null));

    df((err, out) => {
      expect(err).to.be.equal(error);
      expect(out).to.be.undefined;
      mock.verify(done);
    });
  });

  it('Should return error if stderr is not empty', (done) => {
    mock.expectCall('exec')
      .matching(cmd => cmd === 'df')
      .willOnce((args, cb) => cb(null, 'hello world', 'some error text'));

    df((err, out) => {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.be.contain('some error text');
      expect(out).to.be.undefined;
      mock.verify(done);
    });
  });
});