export const BUG_LABELS: string[] = ['bug', 'type: bug'];

export const FEATURE_LABELS: string[] = [
  'enhancement',
  'type: enhancement',
  'feature',
  'type: feature',
];

export const FEATURE_TITLE_STARTS: string[] = ['feat:', 'feat(', 'feat '];

export const BUG_TITLE_STARTS: string[] = ['fix:', 'fix(', 'fix '];

export const TEST_TITLE_STARTS: string[] = ['test:', 'test(', 'test '];

export const TOOLS_TITLE_STARTS: string[] = ['chore:', 'chore(', 'chore '];

export const DOCS_TITLE_STARTS: string[] = ['docs:', 'docs(', 'docs '];

export type IssueType = 'feature' | 'bug' | 'test' | 'tools' | 'docs' | 'other';

export interface IssueToRelease {
  id: number;
  title: string;
  url: string;
  user: string;
  type: IssueType;
}

export interface ReleaseNotesIssuesText {
  bugs: string;
  features: string;
  others: string;
  enhancements: string;
}

export type GitHubIssueLabel =
  | string
  | {
      name?: string;
      description?: string | null;

      [key: string]: any;
    };

export interface GitHubUser {
  login: string;

  [key: string]: any;
}

export interface GitHubIssue {
  id: number;
  // node_id: string;
  url: string;
  // repository_url: string;
  // labels_url: string;
  // comments_url: string;
  // events_url: string;
  html_url: string;
  // number: number;
  // state: string;
  title: string;
  // body?: string;
  user: GitHubUser | null;
  labels: GitHubIssueLabel[];
  // assignee: any;
  // assignees: any[];
  // milestone: any;
  // locked: boolean;
  // active_lock_reason: string;
  // comments: 0;
  // pull_request: any;
  // closed_at: string;
  // created_at: string;
  // updated_at: string;
  // author_association: any;

  [key: string]: any;
}

export interface GitHubPullRequest {
  id: number;
  html_url: string;
  title: string;
  number: number;
  user: GitHubUser | null;
  labels: GitHubIssueLabel[] | null;
}
