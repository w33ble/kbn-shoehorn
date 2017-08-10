/* eslint no-console: 0 */
const questions = require('./questions');
const download = require('./download');
const loadFile = require('./load_file');
const setVersion = require('./set_version');
const movePlugin = require('./move_plugin');
const depInstall = require('./dep_install');

function getPlugin(props) {
  if (typeof props.filePath === 'string') return loadFile(props.filePath, props.targetPath);
  return download.repo(props.url, props.branch, props.targetPath);
}

questions.prompt()
.then((answers) => {
  // get dirname from the last part of the url name
  const pluginName = answers.url ? answers.url.split('/').reverse()[0] : '';

  const props = Object.assign({
    targetPath: `${answers.kibanaPath}/plugins/${pluginName}`,
  }, answers);

  return getPlugin(props)
  .then((targetPath) => {
    if (props.setVersion) setVersion(targetPath, props.kibanaPath);
    return (props.setPath) ? movePlugin(targetPath).targetPath : targetPath;
  })
  .then((targetPath) => {
    depInstall(targetPath);
    console.log(`Plugin installed: ${targetPath}`);
  });
})
.catch(err => console.error('FAILED:', err));
