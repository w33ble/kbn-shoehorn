/* eslint no-console: 0 */
const questions = require('./questions');
const download = require('./download');
const setVersion = require('./set_version');
const movePlugin = require('./move_plugin');

questions.prompt()
.then((answers) => {
  // get dirname from the last part of the url name
  const props = Object.assign({
    targetPath: `${answers.kibanaPath}/plugins/${answers.url.split('/').reverse()[0]}`,
  }, answers);

  return download.repo(props.url, props.branch, props.targetPath)
  .then(() => {
    if (props.setVersion) setVersion(props.targetPath, props.kibanaPath);
    if (props.setPath) movePlugin(props.targetPath);
  })
  .then(() => console.log('Plugin installed!'));
})
.catch(err => console.error('FAILED:', err));
