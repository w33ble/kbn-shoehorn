const { statSync, readdirSync } = require('fs');
const { parse, join } = require('path');
const ncp = require('ncp').ncp;
const tempDir = require('temp-dir');
const extract = require('./extract');
const { readJson } = require('./json_file');

// paths to ignore when attempting to traverse into plugin
const ignorePaths = [
  '.DS_Store',
];

function readPackageName(dirPath) {
  try {
    const pluginPkgFile = join(dirPath, 'package.json');
    return readJson(pluginPkgFile).name;
  } catch (e) {
    return null;
  }
}

function copyPath(filePath, targetPath) {
  return new Promise((resolve, reject) => {
    const pluginName = readPackageName(filePath);

    // make sure a package.json file exists
    if (!pluginName) {
      reject(new Error('Failed to read name from plugin'));
      return;
    }

    const pluginTarget = join(targetPath, pluginName);

    ncp(filePath, pluginTarget, (err) => {
      if (err) reject(err);
      else resolve(pluginTarget);
    });
  });
}

function unpackZip(filePath, targetPath) {
  const { ext, name } = parse(filePath);
  // unique temp unzip path
  const unpackTarget = join(tempDir, name, String((new Date()).getTime()));
  console.log('unpackTarget', unpackTarget)

  if (ext !== '.zip') {
    return Promise.reject(`Plugin must be a .zip file, ${ext} is not supported`);
  }

  return extract(filePath, { dir: unpackTarget })
  .then(() => {
    // look for name in package.json, traverse if only one path is found
    function getPluginPath(dirPath) {
      const pluginName = readPackageName(dirPath);

      if (!pluginName) {
        const paths = readdirSync(dirPath).filter(path => ignorePaths.indexOf(path) === -1);
        if (paths.length !== 1) throw new Error(`Plugin not found: ${filePath}`);

        const deepDirPath = join(dirPath, paths[0]);
        const stat = statSync(deepDirPath);
        if (!stat.isDirectory()) throw new Error(`Plugin not found: ${filePath}`);

        return getPluginPath(deepDirPath);
      }

      return dirPath;
    }

    return copyPath(getPluginPath(unpackTarget), targetPath);
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
