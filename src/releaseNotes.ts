import * as core from '@actions/core';
import { GitHub } from '@actions/github';

const toReleaseNote = (issue: IssueToRelease) => `- ${issue.title}`;

const toReleaseNoteText = (bugs: IssueToRelease[], features: IssueToRelease[], others: IssueToRelease[]) => `
# NEW CHANGES

🐛 Bug Fixes
--
${bugs.map(toReleaseNote)}

🚀 Features
--
${features.map(toReleaseNote)}

--
${others.map(toReleaseNote)}
`;

interface GithubIssueLabel {
  name: string;
}

interface IssueToRelease {
  id: number;
  title: string;
  url: string;
  user: string;
  userURL: string;
  labels: string[];
}

const extractLabels = (labels: GithubIssueLabel[] = []): string[] => labels.map(label => label.name);

const getClosedIssues = async (github: GitHub, previousReleaseDate: string, repo: string, owner: string): Promise<IssueToRelease[]> => {
  const githubClosedIssues = await github.issues.listForRepo({
    owner,
    repo,
    state: 'closed',
    since: previousReleaseDate
  });

  return githubClosedIssues.data.map(issue => ({
    id: issue.id,
    title: issue.title,
    url: issue.html_url,
    user: issue.user.login,
    userURL: issue.user.url,
    labels: extractLabels(issue.labels)
  }));
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
  return toReleaseNoteText(closedIssues, [], []);
};
