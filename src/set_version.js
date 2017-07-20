const { readJson, writeJson } = require('./json_file');

module.exports = (targetPath, kibanaPath) => {
  const kibanaPkg = readJson(`${kibanaPath}/package.json`);
  const pluginPkg = readJson(`${targetPath}/package.json`);

  // add the kibana property if it's missing
  if (!pluginPkg.kibana) {
    pluginPkg.kibana = {};
  }

  // set the kibana.version
  pluginPkg.kibana.version = kibanaPkg.version;

  // clean up incorrect use of kibana.version
  delete pluginPkg['kibana.version'];

  writeJson(`${targetPath}/package.json`, pluginPkg);

  return { version: kibanaPkg.version };
};
