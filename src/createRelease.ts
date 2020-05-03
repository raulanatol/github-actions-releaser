import * as core from '@actions/core';
import { GitHub } from '@actions/github';

const toTagName = (ref: string): string => ref.replace('refs/tags/', '');

export const createRelease = async (github: GitHub, context: any, notes: string) => {
  const { owner, ref, repo } = context;

  core.debug(`Context: ${JSON.stringify(context)}`);
  core.debug(`owner: ${owner}`);
  core.debug(`ref: ${ref}`);
  core.debug(`repo: ${repo}`);

  const tagName = toTagName(ref);

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
