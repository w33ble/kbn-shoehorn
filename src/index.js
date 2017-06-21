const questions = require('./questions');

questions.prompt()
.then((answers) => {
  console.log(answers);
});
