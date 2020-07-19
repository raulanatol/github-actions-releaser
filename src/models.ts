export const BUG_LABELS: string[] = ['bug', 'Type: Bug'];
export const FEATURE_LABELS: string[] = ['enhancement', 'Type: Enhancement', 'feature', 'Type: Feature'];

export enum IssueType {
  FEATURE,
  BUG,
  OTHER,
}

export interface IssueToRelease {
  id: number;
  title: string;
  url: string;
  user: string;
  labels: string[];
  type: IssueType;
}

export interface ReleaseNotesIssuesText {
  bugs: string;
  features: string;
  others: string;
}

export interface GithubIssueLabel {
  name: string;
}
