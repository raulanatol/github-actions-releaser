import { classifyIssue } from '../src/issueTypeClassifier';
import { GitHubIssue, GitHubIssueLabel } from '../src/models';

const baseIssue: GitHubIssue = {
  id: 1,
  title: 'Test'
} as GitHubIssue;

const toLabels = (name: string): GitHubIssueLabel[] =>
  [{ name } as any];

describe('issueTypeClassifier', () => {
  describe('classifyIssue', () => {
    describe('using labels', () => {
      describe('Bug', () => {
        it('should classify as bug an issue with label Bug', () => {
          const issue = { ...baseIssue, labels: toLabels('bug') };
          expect(classifyIssue(issue)).toBe('bug');
        });

        it('should classify as bug an issue with label Type: Bug', () => {
          const issue = { ...baseIssue, labels: toLabels('Type: bug') };
          expect(classifyIssue(issue)).toBe('bug');
        });
      });

      describe('Feature', () => {
        it('should classify as Feature an issue with label enhancement', () => {
          const issue = { ...baseIssue, labels: toLabels('enhancement') };
          expect(classifyIssue(issue)).toBe('feature');
        });
      });
    });

    describe('using title', () => {
      describe('Bug', () => {
        it('title starts with fix:', () => {
          const issue = { ...baseIssue, title: 'fix: XXX error' };
          expect(classifyIssue(issue)).toEqual('bug');
        });
      });

      describe('Feature', () => {
        it('title starts with feat:', () => {
          const issue = { ...baseIssue, title: 'feat: add XXX' };
          expect(classifyIssue(issue)).toEqual('feature');
        });
      });

      describe('Test', () => {
        it('title starts with test:', () => {
          const issue = { ...baseIssue, title: 'test: ensure Tayne retains clothing' };
          expect(classifyIssue(issue)).toEqual('test');
        });
      });

      describe('Tools', () => {
        it('title starts with chore:', () => {
          const issue = { ...baseIssue, title: 'chore: add Oyster build script' };
          expect(classifyIssue(issue)).toEqual('tools');
        });
      });

      describe('Docs', () => {
        it('title starts with docs:', () => {
          const issue = { ...baseIssue, title: 'docs: explain XYZ' };
          expect(classifyIssue(issue)).toEqual('docs');
        });
      });

      describe('Other', () => {
        it('title starts with style:', () => {
          const issue = { ...baseIssue, title: 'style: convert' };
          expect(classifyIssue(issue)).toEqual('other');
        });

        it('title starts with unexpected value', () => {
          const issue = { ...baseIssue, title: 'any value' };
          expect(classifyIssue(issue)).toEqual('other');
        });
      });
    });
  });
});
