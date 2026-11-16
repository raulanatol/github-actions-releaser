import { describe, expect, test, vi } from 'vitest';
import { getClosedIssues, getMergedPullRequests, releaseNotes } from '../releaseNotes';

const PREVIOUS_RELEASE = '2025-11-20T11:08:42Z';
const BEFORE = '2025-11-20T11:06:17Z';
const AFTER = '2026-11-16T11:28:35Z';

const user = { login: 'someone' };

const issue = (number: number, closed_at: string, extra: Record<string, unknown> = {}) => ({
  number,
  title: `Issue ${number}`,
  html_url: `https://github.com/o/r/issues/${number}`,
  user,
  labels: [],
  closed_at,
  ...extra,
});

const pullRequest = (number: number, merged_at: string | null, updated_at: string) => ({
  number,
  title: `PR ${number}`,
  html_url: `https://github.com/o/r/pull/${number}`,
  user,
  labels: [],
  merged_at,
  updated_at,
});

// Mimics Octokit's paginate: one response per page, stopping when the map
// function calls `done`.
const fakeClient = ({
  issues = [] as any[],
  pulls = [] as any[],
  pageSize = 2,
  latest = PREVIOUS_RELEASE,
}) => {
  const listForRepo = vi.fn();
  const list = vi.fn();
  const pagesRead = { issues: 0, pulls: 0 };
  const sources = new Map<unknown, { data: any[]; key: keyof typeof pagesRead }>([
    [listForRepo, { data: issues, key: 'issues' }],
    [list, { data: pulls, key: 'pulls' }],
  ]);

  const paginate = vi.fn(async (method: unknown, _params: unknown, mapFn?: any) => {
    const { data, key } = sources.get(method)!;
    const result: any[] = [];
    let stopped = false;
    for (let i = 0; i < data.length && !stopped; i += pageSize) {
      pagesRead[key]++;
      const response = { data: data.slice(i, i + pageSize) };
      result.push(...(mapFn ? mapFn(response, () => (stopped = true)) : response.data));
    }
    return result;
  });

  const client = {
    paginate,
    rest: {
      issues: { listForRepo },
      pulls: { list },
      repos: { getLatestRelease: async () => ({ data: { published_at: latest } }) },
    },
  } as any;
  return { client, pagesRead, paginate };
};

describe('getClosedIssues', () => {
  test('skips pull requests returned by the issues endpoint', async () => {
    const { client } = fakeClient({
      issues: [issue(1, AFTER), issue(2, AFTER, { pull_request: { url: 'x' } })],
    });
    const result = await getClosedIssues(client, PREVIOUS_RELEASE, 'r', 'o');
    expect(result.map((i) => i.id)).toEqual([1]);
  });

  test('skips issues closed before the previous release but updated after it', async () => {
    const { client } = fakeClient({ issues: [issue(1, AFTER), issue(2, BEFORE)] });
    const result = await getClosedIssues(client, PREVIOUS_RELEASE, 'r', 'o');
    expect(result.map((i) => i.id)).toEqual([1]);
  });

  test('reads every page', async () => {
    const { client, pagesRead } = fakeClient({
      issues: [1, 2, 3, 4, 5].map((n) => issue(n, AFTER)),
    });
    const result = await getClosedIssues(client, PREVIOUS_RELEASE, 'r', 'o');
    expect(result).toHaveLength(5);
    expect(pagesRead.issues).toBe(3);
  });
});

describe('getMergedPullRequests', () => {
  test('keeps only pull requests merged after the previous release', async () => {
    const { client } = fakeClient({
      pulls: [
        pullRequest(3, AFTER, AFTER),
        pullRequest(2, null, AFTER),
        pullRequest(1, BEFORE, AFTER),
      ],
    });
    const result = await getMergedPullRequests(client, PREVIOUS_RELEASE, 'r', 'o');
    expect(result.map((p) => p.id)).toEqual([3]);
  });

  test('stops paging once a pull request was updated before the previous release', async () => {
    const { client, pagesRead } = fakeClient({
      pulls: [
        pullRequest(5, AFTER, AFTER),
        pullRequest(4, AFTER, AFTER),
        pullRequest(3, AFTER, AFTER),
        pullRequest(2, BEFORE, BEFORE),
        pullRequest(1, BEFORE, BEFORE),
        pullRequest(0, BEFORE, BEFORE),
      ],
    });
    const result = await getMergedPullRequests(client, PREVIOUS_RELEASE, 'r', 'o');
    expect(result.map((p) => p.id)).toEqual([5, 4, 3]);
    expect(pagesRead.pulls).toBe(2);
  });

  test('reads every merged pull request when there is no previous release', async () => {
    const { client } = fakeClient({
      pulls: [pullRequest(2, AFTER, AFTER), pullRequest(1, BEFORE, BEFORE)],
    });
    const result = await getMergedPullRequests(client, null, 'r', 'o');
    expect(result.map((p) => p.id)).toEqual([2, 1]);
  });
});

describe('releaseNotes', () => {
  test('lists each pull request once', async () => {
    const pr = pullRequest(55, AFTER, AFTER);
    const { client } = fakeClient({
      issues: [{ ...issue(55, AFTER), pull_request: { url: 'x' } }],
      pulls: [pr],
    });
    const notes = await releaseNotes(client, 'r', 'o');
    expect(notes.match(/#55\]/g)).toHaveLength(1);
  });
});
