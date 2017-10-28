/*
  Heavily aped from https://github.com/elastic/kibana/blob/5.6/src/cli_plugin/install/zip.js

  Modified for local eslint rules and fancy ES6 syntax
*/

const { createWriteStream } = require('fs');
const { join, dirname } = require('path');
const yauzl = require('yauzl');
const mkdirp = require('mkdirp');

const isDirectory = filename => /(\/|\\)$/.test(filename);

const createPath = p => new Promise((resolve, reject) => {
  mkdirp(p, (err) => {
    if (err) reject(err);
    else resolve(p);
  });
});

const openZip = (zip, opts = {}) => new Promise((resolve, reject) => {
  yauzl.open(zip, opts, (err, zipfile) => {
    if (err) reject(err);
    else resolve(zipfile);
  });
});

const writeEntity = (zipfile, entity, fileName) => {
  return new Promise((resolve, reject) => {
    // write the file using the streaming output interface
    zipfile.openReadStream(entity, (err, readStream) => {
      if (err) {
        reject(err);
        return;
      }

      // ensure parent directory exists
      createPath(dirname(fileName)).then(() => {
        // write the target file
        readStream.pipe(createWriteStream(fileName));

        // on completion, process next file in zip
        readStream.on('end', resolve());
      }).catch(e => reject(e));
    });
  });
};

module.exports = function extractArchive(zip, opts) {
  const targetDir = opts.dir;
  const zipOpts = { lazyEntries: opts.lazyEntries || true };

  if (!targetDir) return Promise.reject('No target dir specified for unzippping');

  return new Promise((resolve, reject) => {
    openZip(zip, zipOpts).then((zipfile) => {
      const processNextFile = () => zipfile.readEntry();

      zipfile.on('close', resolve);

      zipfile.on('entry', (entry) => {
        const fileName = join(targetDir, entry.fileName);

        const chain = isDirectory(fileName)
          ? createPath(fileName)
          : writeEntity(zipfile, entry, fileName);

        chain.then(processNextFile).catch(err => reject(err));
      });

      // kick off the zip file processing
      processNextFile();
    });
  });
};
