
const df = require('./lib/df');
const parser = require('./lib/parser');

const dividers = { 'M': 1024, 'G': 1024 * 1024 };

/** @private
 * 
 * 
 * @param {*} result 
 * @param {*} fmt 
 */
function format(options, result) {
  const divider = dividers[options.base] || 1;
  const decimals = options.decimals || 0;
  for(const fs in result) {
    result[fs].blocks = parseFloat((result[fs].blocks / divider).toFixed(decimals));
    result[fs].used = parseFloat((result[fs].used / divider).toFixed(decimals));
    result[fs].available = parseFloat((result[fs].available / divider).toFixed(decimals));
  }
}

/** @function index
 *  
 * @param {Object|String|Array} options 
 * @param {Function} done 
 * Callback executed with properly formatted results from df command
 * execution. If error occurs it's passed as the first argument to
 * the callback function, otherwise first 
 */
module.exports = (options, done) => {
  if(typeof options === 'function') {
    done = options;
    options = {};
  } else if (typeof options === 'string') {
    options = { path: options }
  }
  df(options.path || '', (err, output) => {
    if(err) {
      return done(err);
    }
    try {
      let result = parser.parse(output);
      format(options, result); 
      done(null, result);
    } catch (err) {
      return done(err);
    }
  });
}