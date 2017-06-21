const { resolve } = require('path');
const inquirer = require('inquirer');
const { readJson } = require('./json_file');

const defaultKibanaPath = () => process.cwd();

function validKibanaPath(kibanaPath) {
  try {
    return readJson(`${kibanaPath}/package.json`).name === 'kibana';
  } catch (e) {
    return false;
  }
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
    validate: str => /^(\bbitbucket:|\bgitlab:)?[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/.test(str),
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
.then(ans => Object.assign({ kibanaPath: defaultKibanaPath() }, ans));
