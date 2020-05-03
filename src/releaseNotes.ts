import * as core from '@actions/core';

export const releaseNotes = (github, context) => {
  const { owner, repo } = context;

  core.debug(`Owner: ${owner} - Repo: ${repo}`);

  return '# NEW CHANGES';
};
