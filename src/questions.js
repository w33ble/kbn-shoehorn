const { resolve } = require('path');
const inquirer = require('inquirer');
const minimist = require('minimist');
const { readJson } = require('./json_file');

const defaultKibanaPath = () => process.cwd();
const argv = minimist(process.argv.slice(2));
const pluginName = () => argv._[0];

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

function nonInteractive() {
  return Boolean(argv.y);
}

function loadFromFile() {
  return argv.f && (typeof argv.f !== 'boolean') && argv.f.length;
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
    when: () => !loadFromFile() && !validPluginRepo(pluginName()),
    validate: validPluginRepo,
  },
  {
    name: 'branch',
    message: 'Repo branch:',
    default: 'master',
    when: () => !loadFromFile() && !argv.branch && !nonInteractive(),
  },
  {
    name: 'setVersion',
    type: 'confirm',
    message: 'Overwrite the plugin version?',
    default: true,
    when: () => !nonInteractive(),
  },
  {
    name: 'setPath',
    type: 'confirm',
    message: 'Use plugin name as folder name?',
    default: true,
    when: () => !nonInteractive(),
  },
];

exports.prompt = () => inquirer.prompt(exports.values)
.then(ans => Object.assign({
  kibanaPath: defaultKibanaPath(),
  url: pluginName(),
  branch: argv.branch || 'master',
  filePath: argv.f,
  setVersion: true,
  setPath: true,
}, ans));
