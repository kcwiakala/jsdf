
function release(module) {
  delete require.cache[require.resolve(module)];
}

function rerequire(module) {
  release(module);
  return require(module);
}

exports.release = release;
exports.rerequire = rerequire;