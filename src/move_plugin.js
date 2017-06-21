const { join } = require('path');
const { renameSync } = require('fs');
const { readJson } = require('./json_file');

module.exports = (targetPath) => {
  const pluginPkg = readJson(`${targetPath}/package.json`);
  const newPath = join(targetPath, '..', pluginPkg.name);
  renameSync(targetPath, newPath);
  return { targetPath: newPath, name: pluginPkg.name };
};
