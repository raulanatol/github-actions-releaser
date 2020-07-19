import * as core from '@actions/core';
import { Context } from '@actions/github/lib/context';

const toTagName = (ref: string): string => ref.replace('refs/tags/', '');

export const createRelease = async (github, context: Context, notes: string) => {
  const {
    ref,
    repo: { repo, owner },
  } = context;

  const tagName = toTagName(ref);

  const newRelease = await github.repos.createRelease({
    owner,
    repo,
    tag_name: tagName,
    name: `Release ${tagName}`,
    body: notes,
    draft: false,
    prerelease: false,
  });

  const {
    data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl },
  } = newRelease;

  core.setOutput('id', releaseId);
  core.setOutput('html_url', htmlUrl);
  core.setOutput('upload_url', uploadUrl);
};
