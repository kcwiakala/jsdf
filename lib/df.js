'use strict';

const exec = require('child_process').exec;
 
module.exports = function(args, done) {
  if(typeof args === 'function') {
    done = args;
    args = '';
  } else if (typeof args !== 'string') {
    args = args.join(' ');
  }
  const command = 'df' + ((args.length > 0) ? (' ' + args) : '');
  exec(command, (err, stdout, stderr) => {
    if(err) {
      done(err);
    } else if(stderr && stderr.length > 0) {
      done(new Error('Command produced stderr output: ' + stderr));
    } else {
      done(null, stdout);
    }
  });
}