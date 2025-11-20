import {
  BUG_LABELS,
  BUG_TITLE_STARTS,
  DOCS_TITLE_STARTS,
  FEATURE_LABELS,
  FEATURE_TITLE_STARTS,
  GitHubIssue,
  GitHubIssueLabel,
  GitHubPullRequest,
  IssueType,
  TEST_TITLE_STARTS,
  TOOLS_TITLE_STARTS,
} from './models';

export const classifyIssue = (issue: GitHubIssue | GitHubPullRequest): IssueType => {
  const typeFromLabels = getIssueTypeFromLabels(issue);
  if (typeFromLabels) {
    return typeFromLabels;
  }

  const typeFromTitle = getIssueTypeFromTitle(issue);
  if (typeFromTitle) {
    return typeFromTitle;
  }

  return 'other';
};

const extractLabels = (labels: GitHubIssueLabel[]): string[] =>
  labels.map((label) => {
    if (typeof label === 'string') {
      return label.toLowerCase();
    }
    return (label.name || '').toLowerCase();
  });

const getIssueTypeFromLabels = (issue: GitHubIssue | GitHubPullRequest): IssueType | undefined => {
  const labels = extractLabels(issue.labels || []);

  for (const label of labels) {
    if (BUG_LABELS.includes(label)) {
      return 'bug';
    }

    if (FEATURE_LABELS.includes(label)) {
      return 'feature';
    }
  }
};

const getIssueTypeFromTitle = (issue: GitHubIssue | GitHubPullRequest): IssueType | undefined => {
  const issueTitle = issue.title.toLowerCase();

  for (const title of BUG_TITLE_STARTS) {
    if (issueTitle.startsWith(title)) {
      return 'bug';
    }
  }

  for (const title of FEATURE_TITLE_STARTS) {
    if (issueTitle.startsWith(title)) {
      return 'feature';
    }
  }

  for (const title of TEST_TITLE_STARTS) {
    if (issueTitle.startsWith(title)) {
      return 'test';
    }
  }

  for (const title of TOOLS_TITLE_STARTS) {
    if (issueTitle.startsWith(title)) {
      return 'tools';
    }
  }

  for (const title of DOCS_TITLE_STARTS) {
    if (issueTitle.startsWith(title)) {
      return 'docs';
    }
  }
};
