const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
const generateReleaseNotes = require('./releaseNotes');

async function run() {
  core.debug('Starting...');
  const github = new GitHub(process.env.GITHUB_TOKEN);

  const releaseNotes = generateReleaseNotes(github, context);

  core.debug(releaseNotes);
}

module.exports = run;
