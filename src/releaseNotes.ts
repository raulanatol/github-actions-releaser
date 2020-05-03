import * as core from '@actions/core';

export const releaseNotes = (github, context) => {
  const { owner, repo } = context;

  core.debug(`Owner: ${owner} - Repo: ${JSON.stringify(repo)}`);
  core.debug(`Context: ${JSON.stringify(context)}`);

  return '# NEW CHANGES';
};
