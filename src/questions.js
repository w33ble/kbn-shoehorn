const { resolve } = require('path');
const inquirer = require('inquirer');
const { readJson } = require('./json_file');

const defaultKibanaPath = () => process.cwd();
const pluginName = () => process.argv[2];

function validKibanaPath(kibanaPath) {
  try {
    return readJson(`${kibanaPath}/package.json`).name === 'kibana';
  } catch (e) {
    return false;
  }
}

function validPluginRepo(str) {
  return /^(\bbitbucket:|\bgitlab:)?[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/.test(str);
}

exports.values = [
  {
    name: 'kibanaPath',
    message: 'Kibana path (relative path is ok):',
    filter: str => resolve(__dirname, '..', str),
    when: () => !validKibanaPath(defaultKibanaPath()),
    validate: validKibanaPath,
  },
  {
    name: 'url',
    message: 'The plugin username/repo:',
    when: () => !validPluginRepo(pluginName()),
    validate: validPluginRepo,
  },
  {
    name: 'branch',
    message: 'Repo branch:',
    default: 'master',
  },
  {
    name: 'setVersion',
    type: 'confirm',
    message: 'Overwrite the plugin version?',
    default: true,
  },
  {
    name: 'setPath',
    type: 'confirm',
    message: 'Use plugin name as folder name?',
    default: true,
  },
];

exports.prompt = () => inquirer.prompt(exports.values)
.then(ans => Object.assign({
  kibanaPath: defaultKibanaPath(),
  url: pluginName(),
}, ans));
