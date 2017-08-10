const { statSync } = require('fs');
const { parse, join } = require('path');
const ncp = require('ncp').ncp;
const { readJson } = require('./json_file');

function copyPath(filePath, targetPath) {
  return new Promise((resolve, reject) => {
    try {
      // make sure a package.json file exists
      const pluginPkgFile = join(filePath, 'package.json');
      const { name } = readJson(pluginPkgFile);
      const pluginTarget = join(targetPath, name);

      ncp(filePath, pluginTarget, (err) => {
        if (err) reject(err);
        else resolve(pluginTarget);
      });
    } catch (e) {
      if (e.code === 'ENOENT') reject(new Error('Plugin package.json not found'));
      else reject(e);
    }
  });
}

module.exports = function loadFile(filePath, targetPath) {
  return new Promise((resolve, reject) => {
    try {
      const stat = statSync(filePath);
      if (stat.isFile()) {
        const { ext } = parse(filePath);

        if (ext !== '.zip') {
          reject(`Plugin must be a .zip file, ${ext} is not supported`);
          return;
        }

        reject('Sorry, unpacking zip files is not currently supported');
      } else if (stat.isDirectory()) {
        resolve(copyPath(filePath, targetPath));
      } else {
        reject(`Path must be a file or directory: ${filePath}`);
      }
    } catch (e) {
      reject(e);
    }
  });
};
