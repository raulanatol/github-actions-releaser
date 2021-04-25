import * as core from '@actions/core';
import { releaseNotes } from './releaseNotes';
import { context, getOctokit } from '@actions/github';
import { createRelease } from './createRelease';
import { GitHub } from '@actions/github/lib/utils';

const getGithubClient = () => {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error('Invalid GITHUB_TOKEN');
  }
  return getOctokit(githubToken);
};

const initialize = ({ repo, owner }) =>
  ({ github: getGithubClient(), repo, owner });

async function run(): Promise<void> {
  try {
    const init = initialize(context.repo);
    const github: InstanceType<typeof GitHub> = init.github;
    const notes = await releaseNotes(github, init.repo, init.owner);
    await createRelease(github, context, notes);

    core.debug(`Notes: ${notes}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
