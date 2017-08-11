const { statSync } = require('fs');
const { parse, join } = require('path');
const ncp = require('ncp').ncp;
const tempDir = require('temp-dir');
const extract = require('extract-zip');
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

function unpackZip(filePath, targetPath) {
  return new Promise((resolve, reject) => {
    const { ext, name } = parse(filePath);
    const unpackTarget = join(tempDir, name, String((new Date()).getTime())); // unique temp unzip path

    if (ext !== '.zip') {
      reject(`Plugin must be a .zip file, ${ext} is not supported`);
      return;
    }

    extract(filePath, { dir: unpackTarget }, (err) => {
      if (err) reject(err);
      else resolve(copyPath(unpackTarget, targetPath));
    });
  });
}

module.exports = function loadFile(filePath, targetPath) {
  return new Promise((resolve, reject) => {
    try {
      const stat = statSync(filePath);
      if (stat.isFile()) {
        resolve(unpackZip(filePath, targetPath));
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
