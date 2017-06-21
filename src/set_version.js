const { readJson, writeJson } = require('./json_file');

module.exports = (targetPath, kibanaPath) => {
  const kibanaPkg = readJson(`${kibanaPath}/package.json`);
  const pluginPkg = readJson(`${targetPath}/package.json`);

  if (pluginPkg.kibana && pluginPkg.kibana.version) {
    pluginPkg.kibana.version = kibanaPkg.version;
  } else {
    pluginPkg.version = kibanaPkg.version;
  }

  writeJson(`${targetPath}/package.json`, pluginPkg);
};
