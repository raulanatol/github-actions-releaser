import { GitHub } from '@actions/github';
import { BUG_LABELS, FEATURE_LABELS, GithubIssueLabel, IssueToRelease, IssueType, ReleaseNotesIssuesText } from './models';

const issueToReleaseNoteText = (issue: IssueToRelease) => `- ${issue.title} ([#${issue.id}](${issue.url})) @${issue.user}`;

export const issuesToText = (issues: IssueToRelease[]): string => issues.map(issueToReleaseNoteText).join('\n');

const toOthersText = (issues: IssueToRelease[]) => (issues.length ? `\n🛠 Others\n--\n\n${issuesToText(issues)}\n` : '');
const toBugsText = (issues: IssueToRelease[]) => (issues.length ? `\n🐛 Bug Fixes\n--\n\n${issuesToText(issues)}\n` : '');
const toFeaturesText = (issues: IssueToRelease[]) => (issues.length ? `\n🚀 Features\n--\n\n${issuesToText(issues)}\n` : '');

export const toReleaseNoteText = ({ bugs, features, others }: ReleaseNotesIssuesText) => `# What's changed\n${bugs}${features}${others}`;

const extractLabels = (labels: GithubIssueLabel[] = []): string[] => labels.map(label => label.name);

const getIssueType = (labels: string[] = []): IssueType => {
  for (const label of labels) {
    if (BUG_LABELS.includes(label)) {
      return IssueType.BUG;
    }

    if (FEATURE_LABELS.includes(label)) {
      return IssueType.FEATURE;
    }
  }
  return IssueType.OTHER;
};

const getClosedIssues = async (github: GitHub, previousReleaseDate: string, repo: string, owner: string): Promise<IssueToRelease[]> => {
  const githubClosedIssues = await github.issues.listForRepo({
    owner,
    repo,
    state: 'closed',
    since: previousReleaseDate
  });

  return githubClosedIssues.data.map(issue => {
    const labels = extractLabels(issue.labels);
    return {
      id: issue.number,
      title: issue.title,
      url: issue.html_url,
      user: issue.user.login,
      labels,
      type: getIssueType(labels)
    };
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
  return response.publishedAt;
};

export const toReleaseNotesIssues = (closedIssues: IssueToRelease[] = []): ReleaseNotesIssuesText => {
  const bugs: IssueToRelease[] = [];
  const features: IssueToRelease[] = [];
  const others: IssueToRelease[] = [];

  for (const issue of closedIssues) {
    if (issue.type === IssueType.BUG) {
      bugs.push(issue);
    } else if (issue.type === IssueType.FEATURE) {
      features.push(issue);
    } else {
      others.push(issue);
    }
  }

  return {
    others: toOthersText(others),
    bugs: toBugsText(bugs),
    features: toFeaturesText(features)
  };
};

export const issuesToReleaseNotes = (issues: IssueToRelease[]): string => {
  const releaseNotesIssuesText: ReleaseNotesIssuesText = toReleaseNotesIssues(issues);
  return toReleaseNoteText(releaseNotesIssuesText);
};

export const releaseNotes = async (github: GitHub, repo: string, owner: string): Promise<string> => {
  const previousReleaseDate = await getLatestReleaseDate(github, repo, owner);
  const closedIssues = await getClosedIssues(github, previousReleaseDate, repo, owner);
  return issuesToReleaseNotes(closedIssues);
};
