import * as core from '@actions/core';
import { GitHub } from '@actions/github';

const getClosedIssues = async (github: GitHub, previousReleaseDate: string, repo: string, owner: string) => {
  return await github.issues.listForRepo({
    owner,
    repo,
    state: 'closed',
    since: previousReleaseDate
  });
};

const getLatestReleaseDate = async (github: GitHub, repo: string, owner: string): Promise<string> => {
  const lastRelease = await github.repos.getLatestRelease({ owner, repo });
  const response = {
    createdAt: lastRelease.data.created_at,
    publishedAt: lastRelease.data.published_at,
    name: lastRelease.data.name,
    tagName: lastRelease.data.tag_name
  };
  core.debug(`LastRelease: ${JSON.stringify(response)}`);
  return response.publishedAt;
};

export const releaseNotes = async (github: GitHub, repo: string, owner: string) => {
  const previousReleaseDate = await getLatestReleaseDate(github, repo, owner);
  const closedIssues = await getClosedIssues(github, previousReleaseDate, repo, owner);

  core.debug(`Found ${JSON.stringify(closedIssues)} closed issues`);
  core.debug(`Found ${closedIssues.data.length} closed issues`);

  return '# NEW CHANGES';
};
