const { execFileSync } = require('child_process');
const { platform } = require('os');
const { statSync } = require('fs');
const { join } = require('path');

function winCmd(cmd) {
  return /^win/.test(platform()) ? `${cmd}.cmd` : cmd;
}

module.exports = (pluginRoot) => {
  // install packages in plugin
  const options = {
    cwd: pluginRoot,
    stdio: ['ignore', 'ignore', 'pipe'],
  };

  try {
    // use yarn if yarn lockfile is found in the build
    statSync(join(pluginRoot, 'yarn.lock'));
    execFileSync(winCmd('yarn'), ['install', '--production'], options);
  } catch (e) {
    // use npm if there is no yarn lockfile in the build
    execFileSync(winCmd('npm'), ['install', '--production', '--no-bin-links'], options);
  }
};
