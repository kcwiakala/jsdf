'use strict';

const df = require('./lib/df');
const parser = require('./lib/parser');

const dividers = { 'M': 1024, 'G': 1024 * 1024 }

function format(result, fmt) {
  const divider = dividers[fmt[0]] || 1;
  const decimals = fmt[1] || 0;
  for(const fs in result) {
    result[fs].blocks = (result[fs].blocks / divider).toFixed(decimals);
    result[fs].used = (result[fs].used / divider).toFixed(decimals);
    result[fs].available = (result[fs].available / divider).toFixed(decimals);
  }
}

module.exports = (options, done) => {
  if(typeof options === 'function') {
    done = options;
    options = {};
  } else if ((typeof options === 'string') || (options instanceof Array)) {
    options = { args: options }
  }
  df(options.args || '', (err, output) => {
    if(err) {
      return done(err);
    }
    try {
      let result = parser.parse(output);
      if(options.format) {
        format(result, options.format);
      } 
      done(null, result);
    } catch (err) {
      return done(err);
    }
  });
}