import * as core from '@actions/core';
import { releaseNotes } from './releaseNotes';
import { context, GitHub } from '@actions/github';
import { createRelease } from './createRelease';

const getGithubClient = () => {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error('Invalid GITHUB_TOKEN');
  }
  return new GitHub(githubToken);
};

const initialize = ({ repo, owner }) => ({ github: getGithubClient(), repo, owner });

async function run(): Promise<void> {
  try {
    const { repo, owner, github } = initialize(context.repo);
    const notes = await releaseNotes(github, repo, owner);
    await createRelease(github, context.repo, notes);

    core.debug(`Notes: ${notes}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
