import * as core from '@actions/core';
import { releaseNotes } from './releaseNotes';
import { context, getOctokit } from '@actions/github';
import { createRelease } from './createRelease';
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';

const getGithubClient = (): RestEndpointMethods => {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error('Invalid GITHUB_TOKEN');
  }
  return getOctokit(githubToken).rest;
};

const initialize = ({ repo, owner }) =>
  ({ github: getGithubClient(), repo, owner });

async function run(): Promise<void> {
  try {
    const init = initialize(context.repo);
    const github: RestEndpointMethods = init.github;
    const notes = await releaseNotes(github, init.repo, init.owner);
    await createRelease(github, context, notes);

    core.debug(`Notes: ${notes}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run().catch(console.error);
