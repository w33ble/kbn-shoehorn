const { readFileSync, writeFileSync } = require('fs');

exports.readJson = (path) => {
  return JSON.parse(readFileSync(path));
};

exports.writeJson = (path, content) => {
  return writeFileSync(path, JSON.stringify(content, null, 2));
};
