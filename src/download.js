const download = require('download-git-repo');

exports.repo = (url, branch, targetPath) => new Promise((resolve, reject) => {
  download(`${url}#${branch}`, targetPath, (err) => {
    if (err) reject(err);
    else resolve(targetPath);
  });
});
