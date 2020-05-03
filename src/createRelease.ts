import * as core from '@actions/core';

export const createRelease = (github, notes) => {
  // const createRelease = await github.repos.createRelease({
  //   owner,
  // })
  core.debug(`CreateRelease: ${notes}`);
};
