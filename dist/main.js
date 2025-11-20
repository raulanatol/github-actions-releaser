// src/main.ts
import * as core2 from "@actions/core";

// src/models.ts
var BUG_LABELS = ["bug", "type: bug"];
var FEATURE_LABELS = [
  "enhancement",
  "type: enhancement",
  "feature",
  "type: feature"
];
var FEATURE_TITLE_STARTS = ["feat:", "feat(", "feat "];
var BUG_TITLE_STARTS = ["fix:", "fix(", "fix "];
var TEST_TITLE_STARTS = ["test:", "test(", "test "];
var TOOLS_TITLE_STARTS = ["chore:", "chore(", "chore "];
var DOCS_TITLE_STARTS = ["docs:", "docs(", "docs "];

// src/issueTypeClassifier.ts
var classifyIssue = (issue) => {
  const typeFromLabels = getIssueTypeFromLabels(issue);
  if (typeFromLabels) {
    return typeFromLabels;
  }
  const typeFromTitle = getIssueTypeFromTitle(issue);
  if (typeFromTitle) {
    return typeFromTitle;
  }
  return "other";
};
var extractLabels = (labels) => labels.map((label) => {
  if (typeof label === "string") {
    return label.toLowerCase();
  }
  return (label.name || "").toLowerCase();
});
var getIssueTypeFromLabels = (issue) => {
  const labels = extractLabels(issue.labels || []);
  for (const label of labels) {
    if (BUG_LABELS.includes(label)) {
      return "bug";
    }
    if (FEATURE_LABELS.includes(label)) {
      return "feature";
    }
  }
};
var getIssueTypeFromTitle = (issue) => {
  const issueTitle = issue.title.toLowerCase();
  for (const title of BUG_TITLE_STARTS) {
    if (issueTitle.startsWith(title)) {
      return "bug";
    }
  }
  for (const title of FEATURE_TITLE_STARTS) {
    if (issueTitle.startsWith(title)) {
      return "feature";
    }
  }
  for (const title of TEST_TITLE_STARTS) {
    if (issueTitle.startsWith(title)) {
      return "test";
    }
  }
  for (const title of TOOLS_TITLE_STARTS) {
    if (issueTitle.startsWith(title)) {
      return "tools";
    }
  }
  for (const title of DOCS_TITLE_STARTS) {
    if (issueTitle.startsWith(title)) {
      return "docs";
    }
  }
};

// src/releaseNotes.ts
var withUser = (issue) => issue.user;
var isMerged = (pullRequest) => Boolean(pullRequest.merged_at);
var issueToReleaseNoteText = (issue) => `- ${issue.title} ([#${issue.id}](${issue.url})) @${issue.user}`;
var issuesToText = (issues) => issues.map(issueToReleaseNoteText).join("\n");
var toOthersText = (issues) => issues.length ? `
\u{1F6E0} Others
--

${issuesToText(issues)}
` : "";
var toBugsText = (issues) => issues.length ? `
\u{1F41B} Bug Fixes
--

${issuesToText(issues)}
` : "";
var toFeaturesText = (issues) => issues.length ? `
\u{1F680} Features
--

${issuesToText(issues)}
` : "";
var toEnhancementsText = (issues) => issues.length ? `
\u{1F484} Enhancements
--

${issuesToText(issues)}
` : "";
var toReleaseNoteText = ({
  bugs,
  features,
  enhancements,
  others
}) => `# What's changed
${bugs}${features}${enhancements}${others}`;
var toIssueToRelease = (issue) => ({
  id: issue.number,
  title: issue.title,
  url: issue.html_url,
  user: issue.user.login,
  type: classifyIssue(issue)
});
var fromPullRequestToIssueToRelease = (pullRequest) => ({
  id: pullRequest.number,
  title: pullRequest.title,
  url: pullRequest.html_url,
  user: pullRequest.user.login,
  type: classifyIssue(pullRequest)
});
var getClosedIssues = async (github, previousReleaseDate, repo, owner) => {
  const request = {
    owner,
    repo,
    state: "closed"
  };
  if (previousReleaseDate) {
    request.since = previousReleaseDate;
  }
  const githubClosedIssues = await github.issues.listForRepo(request);
  return githubClosedIssues.data.filter(withUser).map(toIssueToRelease);
};
var getMergedPullRequest = async (github, previousReleaseDate, repo, owner) => {
  const request = {
    owner,
    repo,
    state: "closed"
  };
  if (previousReleaseDate) {
    request.since = previousReleaseDate;
  }
  const githubPullRequestClosed = await github.pulls.list(request);
  return githubPullRequestClosed.data.filter(withUser).filter(isMerged).map(fromPullRequestToIssueToRelease);
};
var getLatestReleaseDate = async (github, repo, owner) => {
  try {
    const lastRelease = await github.repos.getLatestRelease({ owner, repo });
    return lastRelease.data.published_at;
  } catch (e) {
    console.error(e);
    return null;
  }
};
var toReleaseNotesIssues = (closedIssues = []) => {
  const bugs = [];
  const features = [];
  const others = [];
  const enhancements = [];
  for (const issue of closedIssues) {
    switch (issue.type) {
      case "feature":
        features.push(issue);
        break;
      case "bug":
        bugs.push(issue);
        break;
      case "test":
        enhancements.push(issue);
        break;
      default:
        others.push(issue);
    }
  }
  return {
    others: toOthersText(others),
    bugs: toBugsText(bugs),
    features: toFeaturesText(features),
    enhancements: toEnhancementsText(enhancements)
  };
};
var issuesToReleaseNotes = (issues) => {
  const releaseNotesIssuesText = toReleaseNotesIssues(issues);
  return toReleaseNoteText(releaseNotesIssuesText);
};
var releaseNotes = async (github, repo, owner) => {
  const previousReleaseDate = await getLatestReleaseDate(github, repo, owner);
  const closedIssues = await getClosedIssues(github, previousReleaseDate, repo, owner);
  const mergedPullRequests = await getMergedPullRequest(github, previousReleaseDate, repo, owner);
  return issuesToReleaseNotes([...closedIssues, ...mergedPullRequests]);
};

// src/main.ts
import { context, getOctokit } from "@actions/github";

// src/createRelease.ts
import * as core from "@actions/core";
var toTagName = (ref) => {
  const customTagName = core.getInput("TAG_NAME");
  if (customTagName) {
    return customTagName;
  }
  return ref.replace("refs/tags/", "");
};
var createRelease = async (github, context2, notes) => {
  const {
    ref,
    repo: { repo, owner }
  } = context2;
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
  core.setOutput("id", releaseId);
  core.setOutput("html_url", htmlUrl);
  core.setOutput("upload_url", uploadUrl);
};

// src/main.ts
var getGithubClient = () => {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error("Invalid GITHUB_TOKEN");
  }
  return getOctokit(githubToken).rest;
};
var initialize = ({ repo, owner }) => ({ github: getGithubClient(), repo, owner });
var canCreateRelease = () => {
  const noCreateRelease = core2.getInput("NO_CREATE_RELEASE");
  return noCreateRelease !== "true";
};
async function run() {
  try {
    const init = initialize(context.repo);
    const github = init.github;
    const notes = await releaseNotes(github, init.repo, init.owner);
    core2.debug(`Notes: ${notes}`);
    core2.setOutput("notes", notes);
    if (canCreateRelease()) {
      await createRelease(github, context, notes);
    }
  } catch (error) {
    core2.setFailed(error.message);
  }
}
run().catch(console.error);
//# sourceMappingURL=main.js.map