const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
const generateReleaseNotes = require('./releaseNotes');

async function run() {
  const github = new GitHub(process.env.GITHUB_TOKEN);

  const releaseNotes = generateReleaseNotes(github, context);

  console.log('>>', releaseNotes);
}

module.exports = run;
