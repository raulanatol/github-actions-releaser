const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
const generateReleaseNotes = require('./releaseNotes');

async function run() {
  const releaseNotes = generateReleaseNotes();

  console.log('>>', releaseNotes);
}

module.exports = run;
