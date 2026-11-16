import {
  GitHubIssue,
  GitHubPullRequest,
  GitHubClient,
  IssueToRelease,
  ReleaseNotesIssuesText,
} from './models';
import { classifyIssue } from './issueTypeClassifier';

const withUser = (issue) => issue.user;
const isMerged = (pullRequest) => Boolean(pullRequest.merged_at);

const issueToReleaseNoteText = (issue: IssueToRelease) =>
  `- ${issue.title} ([#${issue.id}](${issue.url})) @${issue.user}`;

export const issuesToText = (issues: IssueToRelease[]): string =>
  issues.map(issueToReleaseNoteText).join('\n');

const toOthersText = (issues: IssueToRelease[]) =>
  issues.length ? `\n🛠 Others\n--\n\n${issuesToText(issues)}\n` : '';

const toBugsText = (issues: IssueToRelease[]) =>
  issues.length ? `\n🐛 Bug Fixes\n--\n\n${issuesToText(issues)}\n` : '';

const toFeaturesText = (issues: IssueToRelease[]) =>
  issues.length ? `\n🚀 Features\n--\n\n${issuesToText(issues)}\n` : '';

const toEnhancementsText = (issues: IssueToRelease[]) =>
  issues.length ? `\n💄 Enhancements\n--\n\n${issuesToText(issues)}\n` : '';

export const toReleaseNoteText = ({
  bugs,
  features,
  enhancements,
  others,
}: ReleaseNotesIssuesText) => `# What's changed\n${bugs}${features}${enhancements}${others}`;

const toIssueToRelease = (issue: GitHubIssue): IssueToRelease => ({
  id: issue.number,
  title: issue.title,
  url: issue.html_url,
  user: issue.user!.login,
  type: classifyIssue(issue),
});

const fromPullRequestToIssueToRelease = (pullRequest: GitHubPullRequest): IssueToRelease => ({
  id: pullRequest.number,
  title: pullRequest.title,
  url: pullRequest.html_url,
  user: pullRequest.user!.login,
  type: classifyIssue(pullRequest),
});

const isAfter = (date: string | null | undefined, since: string | null): boolean =>
  Boolean(date) && (!since || Date.parse(date!) > Date.parse(since));

// `issues.listForRepo` also returns pull requests (every pull request is an issue
// for the API), and its `since` filters by `updated_at`, not `closed_at`.
export const getClosedIssues = async (
  github: GitHubClient,
  previousReleaseDate: string | null,
  repo: string,
  owner: string,
): Promise<IssueToRelease[]> => {
  const request: Parameters<GitHubClient['rest']['issues']['listForRepo']>[0] = {
    owner,
    repo,
    state: 'closed',
    per_page: 100,
  };

  if (previousReleaseDate) {
    request.since = previousReleaseDate;
  }

  const issues = await github.paginate(github.rest.issues.listForRepo, request);
  return issues
    .filter((issue) => !issue.pull_request)
    .filter((issue) => isAfter(issue.closed_at, previousReleaseDate))
    .filter(withUser)
    .map(toIssueToRelease);
};

// `pulls.list` has no `since` parameter. Pull requests are read newest-updated
// first and paging stops once one was last updated before the previous release:
// a pull request merged after it must have been updated after it too.
export const getMergedPullRequests = async (
  github: GitHubClient,
  previousReleaseDate: string | null,
  repo: string,
  owner: string,
): Promise<IssueToRelease[]> => {
  const pullRequests = await github.paginate(
    github.rest.pulls.list,
    { owner, repo, state: 'closed', sort: 'updated', direction: 'desc', per_page: 100 },
    (response, done) => {
      if (
        previousReleaseDate &&
        response.data.some((pullRequest) => !isAfter(pullRequest.updated_at, previousReleaseDate))
      ) {
        done();
      }
      return response.data;
    },
  );

  return pullRequests
    .filter(isMerged)
    .filter((pullRequest) => isAfter(pullRequest.merged_at, previousReleaseDate))
    .filter(withUser)
    .map(fromPullRequestToIssueToRelease);
};

export const getLatestReleaseDate = async (
  github: any,
  repo: string,
  owner: string,
): Promise<string | null> => {
  try {
    const lastRelease = await github.repos.getLatestRelease({ owner, repo });
    return lastRelease.data.published_at;
  } catch (e: unknown) {
    console.debug(e);
    return null;
  }
};

export const toReleaseNotesIssues = (
  closedIssues: IssueToRelease[] = [],
): ReleaseNotesIssuesText => {
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
    enhancements: toEnhancementsText(enhancements),
  };
};

export const issuesToReleaseNotes = (issues: IssueToRelease[]): string => {
  const releaseNotesIssuesText = toReleaseNotesIssues(issues);
  return toReleaseNoteText(releaseNotesIssuesText);
};

export const releaseNotes = async (
  github: GitHubClient,
  repo: string,
  owner: string,
): Promise<string> => {
  const previousReleaseDate = await getLatestReleaseDate(github.rest, repo, owner);
  const closedIssues = await getClosedIssues(github, previousReleaseDate, repo, owner);
  const mergedPullRequests = await getMergedPullRequests(github, previousReleaseDate, repo, owner);
  return issuesToReleaseNotes([...closedIssues, ...mergedPullRequests]);
};
