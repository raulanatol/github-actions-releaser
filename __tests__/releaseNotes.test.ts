import { issuesToReleaseNotes, toReleaseNotesIssues, toReleaseNoteText } from '../src/releaseNotes';
import { IssueToRelease, IssueType } from '../src/models';

describe('ReleaseNotes', () => {
  describe('toReleaseNoteText', () => {
    test('should return a valid release notes when an empty list of bugs is provided', () => {
      expect(toReleaseNoteText({
        features: '',
        bugs: '',
        others: ''
      })).toMatchSnapshot();
    });
  });

  describe('toReleaseNotesIssues', () => {
    test('should return a valid group of issues', () => {
      const issues: IssueToRelease[] = [
        { id: 123, title: 'Bug 1', user: 'testUser1', url: 'https://github.com/issue/issue_1' },
        { id: 2845, title: 'Bug 2', user: 'testUser2', url: 'https://github.com/issue/issue_2' },
        { id: 234, title: 'Bug 3', user: 'testUser3', url: 'https://github.com/issue/issue_3' }
      ] as IssueToRelease[];
      expect(toReleaseNotesIssues(issues)).toMatchSnapshot();
    });
  });

  describe('issuesToReleaseNotes', () => {
    test('should generate a complex release notes', () => {
      const issues: IssueToRelease[] = [
        { id: 123, title: 'Bug 1', user: 'testUser1', url: 'https://github.com/issue/issue_1', type: IssueType.BUG },
        { id: 2845, title: 'Bug 2', user: 'testUser2', url: 'https://github.com/issue/issue_2', type: IssueType.BUG },
        { id: 2145, title: 'Feature 1', user: 'testUser23', url: 'https://github.com/issue/issue_3', type: IssueType.FEATURE },
        { id: 234, title: 'Bug 3', user: 'testUser3', url: 'https://github.com/issue/issue_4', type: IssueType.BUG },
        { id: 23214, title: 'Feature 21', user: 'testUser1', url: 'https://github.com/issue/issue_5', type: IssueType.FEATURE },
        { id: 12, title: 'Other 1', user: 'testUser1', url: 'https://github.com/issue/issue_6', type: IssueType.OTHER }
      ] as IssueToRelease[];
      expect(issuesToReleaseNotes(issues)).toMatchSnapshot();
    });

    test('should generate a complex release notes with no others', () => {
      const issues: IssueToRelease[] = [
        { id: 123, title: 'Bug 1', user: 'testUser1', url: 'https://github.com/issue/issue_1', type: IssueType.BUG },
        { id: 2845, title: 'Bug 2', user: 'testUser2', url: 'https://github.com/issue/issue_2', type: IssueType.BUG },
        { id: 2145, title: 'Feature 1', user: 'testUser23', url: 'https://github.com/issue/issue_3', type: IssueType.FEATURE },
        { id: 234, title: 'Bug 3', user: 'testUser3', url: 'https://github.com/issue/issue_4', type: IssueType.BUG },
        { id: 23214, title: 'Feature 21', user: 'testUser1', url: 'https://github.com/issue/issue_5', type: IssueType.FEATURE }
      ] as IssueToRelease[];
      expect(issuesToReleaseNotes(issues)).toMatchSnapshot();
    });

    test('should generate a complex release notes with no features', () => {
      const issues: IssueToRelease[] = [
        { id: 123, title: 'Bug 1', user: 'testUser1', url: 'https://github.com/issue/issue_1', type: IssueType.BUG },
        { id: 2845, title: 'Bug 2', user: 'testUser2', url: 'https://github.com/issue/issue_2', type: IssueType.BUG },
        { id: 234, title: 'Bug 3', user: 'testUser3', url: 'https://github.com/issue/issue_4', type: IssueType.BUG },
        { id: 12, title: 'Other 1', user: 'testUser1', url: 'https://github.com/issue/issue_6', type: IssueType.OTHER }
      ] as IssueToRelease[];
      expect(issuesToReleaseNotes(issues)).toMatchSnapshot();
    });

    test('should generate a complex release notes with no bugs', () => {
      const issues: IssueToRelease[] = [
        { id: 2145, title: 'Feature 1', user: 'testUser23', url: 'https://github.com/issue/issue_3', type: IssueType.FEATURE },
        { id: 23214, title: 'Feature 21', user: 'testUser1', url: 'https://github.com/issue/issue_5', type: IssueType.FEATURE },
        { id: 12, title: 'Other 1', user: 'testUser1', url: 'https://github.com/issue/issue_6', type: IssueType.OTHER }
      ] as IssueToRelease[];
      expect(issuesToReleaseNotes(issues)).toMatchSnapshot();
    });

    test('should generate an empty release notes when no closed issues is provided', () => {
      const issues: IssueToRelease[] = [];
      expect(issuesToReleaseNotes(issues)).toMatchSnapshot();
    });
  });
});
