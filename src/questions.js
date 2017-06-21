const { resolve } = require('path');
const { readFileSync } = require('fs');
const inquirer = require('inquirer');

exports.values = [
  {
    name: 'kibanaPath',
    message: 'Kibana path (relative path is ok):',
    default: () => resolve(__dirname, '..', '..', 'kibana'),
    filter: str => resolve(__dirname, '..', str),
    validate: (kibanaPath) => {
      try {
        const pkg = JSON.parse(readFileSync(`${kibanaPath}/package.json`));
        return pkg.name === 'kibana';
      } catch (e) {
        return false;
      }
    },
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

exports.prompt = () => inquirer.prompt(exports.values);
