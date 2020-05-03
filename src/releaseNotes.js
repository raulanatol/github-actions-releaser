const core = require('@actions/core');

function generateReleaseNotes(github, context) {


  const { owner, repo } = context.repo;
  core.debug(context);
  core.debug(owner);
  core.debug(repo);


  return '# What\'s changed';


}

module.exports = generateReleaseNotes;
