[![npm Package](https://img.shields.io/npm/v/jsdf.svg?style=flat-square)](https://www.npmjs.org/package/jsdf)
[![Build Status](https://travis-ci.org/kcwiakala/jsdf.svg?branch=master)](https://travis-ci.org/kcwiakala/jsdf)
[![Coverage Status](https://coveralls.io/repos/github/kcwiakala/jsdf/badge.svg?branch=master)](https://coveralls.io/github/kcwiakala/jsdf?branch=master)

# Installation
`jsdf` is published on npm 
```shell
npm install --save jsdf
```

# User Guide

```javascript
const df = require('jsdf');

df('.', (err, out) => {
  console.log(out);
});
```
Should produce output (depending on your filesystem) similar to:
```shell
{ '/': 
   { filesystem: '/dev/sda1',
     blocks: 245084444,
     used: 54700392,
     available: 177864784,
     fill: 0.24 } }
```

## API
`jsdf` module exports single function

### jsdf(options, done)

__options__ argument is optional. If it's omitted df will return statistics for all available 
file systems, with default formatting. If argument is a string, it will be considered as a path
specifying filesystem to be checked.
Otherwise `jsdf` expects an object with following optional parameters:

| Option   | Type   | Description |
|----------|--------|-------------|
| path     | String | Path passed to df, command specifying filesystem to be checked |
| base     | String | Base size unit used for output formatting. Can be __G__, __M__ or __K__ (GB, MB or KB - default) |
| decimals | Number | Number of decimal places for output size rounding |

__done__ is a callback function that will be invoked with formatted output of df command. Expected
signature follows a standard _error first_ pattern: `done(error, output)`. If no error occurred, 
output should be a dictionary object with following structure:

|       | Type   | Description |
|-------|--------|-------------|
| key   | String | Mounting point of a filesystem |
| value | Object | Details of the filesystem size |
| value.filesystem | String | Filesystem name |
| value.blocks | Number | Total size of filesystem blocks (unit depends on formatting) |
| value.used | Number | Size of used filesystem blocks (unit depends on formatting) |
| value.available | Number | Size of available filesystem blocks (unit depends on formatting) |
| value.fill | Number | Filesystem fill ratio |

```javascript
df({path: '.', base: 'G', decimals: '3'}, (err, out) => {
  console.log(out);
});
```

