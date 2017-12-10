'use strict';

function Mock(object) {
  this.mocked = object;
  this.originals = {};
}

Mock.prototype.replace = function (fname, mocked) {
  this.originals[fname] = this.mocked[fname];
  this.mocked[fname] = mocked;
};

Mock.prototype.restoreAll = function () {
  for(const fname in this.originals) {
    this.mocked[fname] = this.originals[fname];
  }
};

function release(module) {
  delete require.cache[require.resolve(module)];
}

function rerequire(module) {
  release(module);
  return require(module);
}

exports.Mock = Mock;
exports.release = release;
exports.rerequire = rerequire;