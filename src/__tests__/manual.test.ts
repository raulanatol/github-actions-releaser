import { describe, it } from 'vitest';
import * as core from '@actions/core';
import * as github from '@actions/github';

describe.skip('Manual tests', () => {
  it('should ', async () => {
    const token = core.getInput('token') || process.env.GITHUB_TOKEN || '';
    const octokit = github.getOctokit(token);

    let request: any = {
      owner: 'raulanatol',
      repo: 'javascript-example-gar',
      state: 'closed',
    };

    const { data: issues } = await octokit.rest.issues.listForRepo(request);
    const issuesOnly = issues.filter((issue) => {
      return !Boolean(issue.pull_request);
    });

    request = {
      owner: 'raulanatol',
      repo: 'javascript-example-gar',
      state: 'closed',
    };

    const { data: pullRequests } = await octokit.rest.pulls.list(request);
    const mergedPullRequest = pullRequests.filter((pullRequest) => {
      return Boolean(pullRequest.merged_at);
    });
    console.log(issuesOnly, mergedPullRequest);
  });
});
