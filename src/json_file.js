const { readFileSync, writeFileSync } = require('fs');

exports.readJson = path => JSON.parse(readFileSync(path));

exports.writeJson = (path, content) => writeFileSync(path, JSON.stringify(content, null, 2));
