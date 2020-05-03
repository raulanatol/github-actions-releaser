import * as core from '@actions/core';
import { GitHub } from '@actions/github';

// _getClosedIssues

// YYYY-MM-DDTHH:MM:SSZ
// const getClosedIssues = async (github: GitHub, previousReleaseDate: string, context: Context) => {
//   const { repo, owner } = context.repo;
//   return await github.issues.listForRepo({
//     owner,
//     repo,
//     state: 'closed',
//     since: previousReleaseDate
//   });
// };

const getLatestReleaseDate = async (github: GitHub, repo: string, owner: string): Promise<string> => {
  const lastRelease = await github.repos.getLatestRelease({ owner, repo });

  const response = {
    createdAt: lastRelease.data.created_at,
    publishedAt: lastRelease.data.published_at,
    name: lastRelease.data.name,
    tagName: lastRelease.data.tag_name
  };
  core.debug(`LastRelease: ${response}`);
  return response.createdAt;
};

export const releaseNotes = async (github: GitHub, repo: string, owner: string) => {
  const previousReleaseDate = await getLatestReleaseDate(github, repo, owner);
  // const closedIssues = getClosedIssues(github, previousReleaseDate, context);

  core.debug(`>> Here: ${previousReleaseDate}`);
  // core.debug(`Owner: ${repo.owner} - Repo: ${JSON.stringify(repo)}`);
  // core.debug(`Context: ${JSON.stringify(context)}`);

  return '# NEW CHANGES';
};
