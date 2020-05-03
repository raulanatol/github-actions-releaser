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

async function run(): Promise<void> {
  try {
    const github = getGithubClient();
    const notes = releaseNotes(github, context);
    createRelease(github, notes);

    core.debug(`Notes: ${notes}`);
    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
