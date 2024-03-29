import { GitHubIssue, GitHubPullRequest, IssueToRelease, ReleaseNotesIssuesText } from './models';
import { classifyIssue } from './issueTypeClassifier';
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';

const withUser = issue => issue.user;
const isMerged = pullRequest => Boolean(pullRequest.merged_at);

const issueToReleaseNoteText = (issue: IssueToRelease) =>
  `- ${issue.title} ([#${issue.id}](${issue.url})) @${issue.user}`;

export const issuesToText = (issues: IssueToRelease[]): string =>
  issues.map(issueToReleaseNoteText).join('\n');

const toOthersText = (issues: IssueToRelease[]) =>
  (issues.length ? `\n🛠 Others\n--\n\n${issuesToText(issues)}\n` : '');

const toBugsText = (issues: IssueToRelease[]) =>
  (issues.length ? `\n🐛 Bug Fixes\n--\n\n${issuesToText(issues)}\n` : '');

const toFeaturesText = (issues: IssueToRelease[]) =>
  (issues.length ? `\n🚀 Features\n--\n\n${issuesToText(issues)}\n` : '');

const toEnhancementsText = (issues: IssueToRelease[]) =>
  (issues.length ? `\n💄 Enhancements\n--\n\n${issuesToText(issues)}\n` : '');

export const toReleaseNoteText = ({ bugs, features, enhancements, others }: ReleaseNotesIssuesText) =>
  `# What's changed\n${bugs}${features}${enhancements}${others}`;

const toIssueToRelease = (issue: GitHubIssue): IssueToRelease => ({
  id: issue.number,
  title: issue.title,
  url: issue.html_url,
  user: issue.user!.login,
  type: classifyIssue(issue)
});

const fromPullRequestToIssueToRelease = (pullRequest: GitHubPullRequest): IssueToRelease => ({
  id: pullRequest.number,
  title: pullRequest.title,
  url: pullRequest.html_url,
  user: pullRequest.user!.login,
  type: classifyIssue(pullRequest)
});

const getClosedIssues = async (github: RestEndpointMethods, previousReleaseDate: string | null, repo: string, owner: string): Promise<IssueToRelease[]> => {
  const request: any = {
    owner,
    repo,
    state: 'closed'
  };

  if (previousReleaseDate) {
    request.since = previousReleaseDate;
  }

  const githubClosedIssues = await github.issues.listForRepo(request);
  return githubClosedIssues.data
    .filter(withUser)
    .map(toIssueToRelease);
};

const getMergedPullRequest = async (github: RestEndpointMethods, previousReleaseDate: string | null, repo: string, owner: string): Promise<IssueToRelease[]> => {
  const request: any = {
    owner,
    repo,
    state: 'closed'
  };

  if (previousReleaseDate) {
    request.since = previousReleaseDate;
  }

  const githubPullRequestClosed = await github.pulls.list(request);
  return githubPullRequestClosed.data
    .filter(withUser)
    .filter(isMerged)
    .map(fromPullRequestToIssueToRelease);
};

export const getLatestReleaseDate = async (github: RestEndpointMethods, repo: string, owner: string): Promise<string | null> => {
  try {
    const lastRelease = await github.repos.getLatestRelease({ owner, repo });
    return lastRelease.data.published_at;
  } catch (e) {
    return null;
  }
};

export const toReleaseNotesIssues = (closedIssues: IssueToRelease[] = []): ReleaseNotesIssuesText => {
  const bugs: IssueToRelease[] = [];
  const features: IssueToRelease[] = [];
  const others: IssueToRelease[] = [];
  const enhancements: IssueToRelease[] = [];

  for (const issue of closedIssues) {
    switch (issue.type) {
      case 'feature':
        features.push(issue);
        break;
      case 'bug':
        bugs.push(issue);
        break;
      case 'test':
        enhancements.push(issue);
        break;
      default:
        others.push(issue);
    }
  }

  return {
    others: toOthersText(others),
    bugs: toBugsText(bugs),
    features: toFeaturesText(features),
    enhancements: toEnhancementsText(enhancements)
  };
};

export const issuesToReleaseNotes = (issues: IssueToRelease[]): string => {
  const releaseNotesIssuesText = toReleaseNotesIssues(issues);
  return toReleaseNoteText(releaseNotesIssuesText);
};

export const releaseNotes = async (github: RestEndpointMethods, repo: string, owner: string): Promise<string> => {
  const previousReleaseDate = await getLatestReleaseDate(github, repo, owner);
  const closedIssues = await getClosedIssues(github, previousReleaseDate, repo, owner);
  const mergedPullRequests = await getMergedPullRequest(github, previousReleaseDate, repo, owner);
  return issuesToReleaseNotes([...closedIssues, ...mergedPullRequests]);
};
