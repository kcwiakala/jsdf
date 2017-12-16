
const _ = require('lodash');
const expect = require('chai').expect;
const rereq = require('rereq');
const {Mock, Matcher} = require('jsmock');

describe('package', () => {
  let cpMock = new Mock(require('child_process'));
  let sut = rereq('../index');
  let parserMock = new Mock(require('../lib/parser'));

  const result1 = {
    '/': {
      filesystem: '/dev/sda1',
      blocks: 245084444,
      used: 54700392,
      available: 177864784,
      fill: 0.24 
    }
  }

  after(() => {
    cpMock.cleanup();
    parserMock.cleanup();
  });

  it('Should propagate error from child_process execution', (done) => {
    cpMock.expectCall('exec')
      .willOnceInvoke(new Error('Command not found'));

    sut(err => {
      expect(err).to.be.instanceOf(Error);
      expect(err.message).to.be.equal('Command not found');
      cpMock.verify(done);
    });
  });

  it('Should propagate error from parser', (done) => {
    cpMock.expectCall('exec')
      .willOnceInvoke(null, 'Some test output');

    parserMock.expectCall('parse', 'Some test output')
      .willOnce(() => {
        throw new Error('Something went wrong during parsing')
      });

    sut(err => {
      expect(err).to.be.instanceOf(Error);
      expect(err.message).to.be.equal('Something went wrong during parsing');
      parserMock.verify();
      cpMock.verify(done);
    });
  });

  it('Should call df with no additional parameters if no options provided', (done) => {
    cpMock.expectCall('exec')
      .matching('df', Matcher.FUNCTION)
      .willOnceInvoke(new Error('some error'));

    sut(err => {
      expect(err).to.be.instanceOf(Error);
      cpMock.verify(done);
    });
  });

  it('Should pass first argument to df call if string given', (done) => {
    cpMock.expectCall('exec')
      .matching('df /some/test/path', Matcher.FUNCTION)
      .willOnceInvoke(new Error('some error'));

    sut('/some/test/path', err => {
      expect(err).to.be.instanceOf(Error);
      cpMock.verify(done);
    });
  });

  it('Should pass path argument to df call if provided in option object', (done) => {
    cpMock.expectCall('exec')
      .matching('df /some/test/path', Matcher.FUNCTION)
      .willOnceInvoke(new Error('some error'));
    const options = {path: '/some/test/path'};
    sut(options, err => {
      expect(err).to.be.instanceOf(Error);
      cpMock.verify(done);
    });
  });

  it('Should pass path argument to df call if provided in option object', (done) => {
    cpMock.expectCall('exec')
      .matching('df /some/test/path', Matcher.FUNCTION)
      .willOnceInvoke(new Error('some error'));

    sut({path: '/some/test/path'}, err => {
      expect(err).to.be.instanceOf(Error);
      cpMock.verify(done);
    });
  });

  describe('formatting', () => {
    it('Should change base if provided in option object', done => {
      cpMock.expectCall('exec')
        .matching('df', Matcher.FUNCTION)
        .willTwiceInvoke(null, 'output');

      parserMock.expectCall('parse', 'output')
        .willOnce(_.cloneDeep(result1))
        .willOnce(_.cloneDeep(result1));
    
      sut({base: 'G'}, (err, out) => {
        expect(err).to.be.null;
        expect(out['/'].blocks).to.be.equal(234);
      });

      sut({base: 'M'}, (err, out) => {
        expect(err).to.be.null;
        expect(out['/'].blocks).to.be.equal(239340);

        parserMock.verify();
        cpMock.verify(done);
      });
    });

    it('Should change number of decimal places if provided in option object', done => {
      cpMock.expectCall('exec')
      .matching('df', Matcher.FUNCTION)
      .willTwiceInvoke(null, 'output');

    parserMock.expectCall('parse', 'output')
      .willOnce(_.cloneDeep(result1))
      .willOnce(_.cloneDeep(result1));
  
    sut({base: 'G', decimals: 2}, (err, out) => {
      expect(err).to.be.null;
      expect(out['/'].used).to.be.equal(52.17);
    });

    sut({base: 'M', decimals: 1}, (err, out) => {
      expect(err).to.be.null;
      expect(out['/'].used).to.be.equal(53418.4);

      parserMock.verify();
      cpMock.verify(done);
    });
    });
  });
});