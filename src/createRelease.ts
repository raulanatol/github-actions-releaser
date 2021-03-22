import * as core from '@actions/core';
import { getInput } from '@actions/core';
import { Context } from '@actions/github/lib/context';

const toTagName = (ref: string): string => {
  const customTagName = getInput('TAG_NAME');
  console.log('createRelease.ts l.7 customTagName', customTagName);
  if (customTagName) {
    console.log('createRelease.ts l.9 customTagName', customTagName);
    return customTagName;
  }
  console.log('createRelease.ts l.13');
  return ref.replace('refs/tags/', '');
};

export const createRelease = async (github, context: Context, notes: string) => {
  const {
    ref,
    repo: { repo, owner }
  } = context;

  const tagName = toTagName(ref);
  console.log('createRelease.ts l.23');

  const newRelease = await github.repos.createRelease({
    owner,
    repo,
    tag_name: tagName,
    name: `Release ${tagName}`,
    body: notes,
    draft: false,
    prerelease: false
  });

  const {
    data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl }
  } = newRelease;

  core.setOutput('id', releaseId);
  core.setOutput('html_url', htmlUrl);
  core.setOutput('upload_url', uploadUrl);
};
