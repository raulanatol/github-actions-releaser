<div align="center">
    <h1>Github Actions Releaser</h1>
</div>

<p>This action generates release notes from the issues and pull requests closed since the previous release, and (optionally) publishes them as a GitHub release.</p>

# How it works

1. Reads the publication date of the latest release. If there is none, the whole history is used.
2. Collects the issues closed and the pull requests merged since that date.
3. Groups them into `🐛 Bug Fixes`, `🚀 Features`, `💄 Enhancements` and `🛠 Others`. The group is
   taken from the `bug` / `type: bug` / `enhancement` / `type: enhancement` / `feature` / `type: feature`
   labels, and falls back to the conventional-commit prefix of the title (`fix:`, `feat:`, `test:`,
   `chore:`, `docs:`).
4. Creates the release for the pushed tag, unless `NO_CREATE_RELEASE` is set to `true`.

# Inputs

| Key                 | Description                                                       | Required  | Default |
| ------------------- | ----------------------------------------------------------------- | --------- | ------- |
| `TAG_NAME`          | The new tag name. Omit it to use the tag that triggered the run   | **FALSE** | —       |
| `NO_CREATE_RELEASE` | If `true`, only generates the notes and does not create a release | **FALSE** | `false` |

`GITHUB_TOKEN` is not an input: it is read from the environment and must be provided via `env`
(see the examples below).

# Outputs

| Key          | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| `notes`      | The generated release notes                                          |
| `id`         | Id of the created release. Empty when `NO_CREATE_RELEASE` is `true`  |
| `html_url`   | URL of the created release. Empty when `NO_CREATE_RELEASE` is `true` |
| `upload_url` | Asset upload URL. Empty when `NO_CREATE_RELEASE` is `true`           |

# Example usage

Create the file `workflow.yml` in the `.github/workflows` folder.

```yaml
name: Release
on:
  push:
    tags:
      - 'v*'
permissions:
  contents: write
  pull-requests: read
  issues: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - name: Generate release notes
        uses: raulanatol/github-actions-releaser@v3.0.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## With custom tag name

Replace the `Generate release notes` step of the previous example with:

```yaml
- name: Generate release notes
  uses: raulanatol/github-actions-releaser@v3.0.0
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    TAG_NAME: vTestName
```

## Using the notes without creating a release

```yaml
- name: Generate release notes
  id: notes
  uses: raulanatol/github-actions-releaser@v3.0.0
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    NO_CREATE_RELEASE: 'true'
- run: echo "${{ steps.notes.outputs.notes }}"
```

# Requirements

- The action runs on the `node24` runner, available on GitHub-hosted runners and on
  self-hosted runners with runner version `2.327.0` or newer.
- `contents: write` permission is required to create the release. It can be lowered to
  `contents: read` when `NO_CREATE_RELEASE` is `true`.

# Example projects

- [Javascript] https://github.com/raulanatol/javascript-example-gar

# Development

Node version is pinned in `.nvmrc`.

```bash
make init    # install dependencies
make test    # run the test suite
make build   # bundle the action into dist/
make         # lint + type-check + test + build
```

The bundle in `dist/index.js` is what the runner executes, so it is committed to the
repository. Any change to `src/` must be built and committed together with the source;
CI fails if `dist/` is out of date.

# License

[MIT](LICENSE)
