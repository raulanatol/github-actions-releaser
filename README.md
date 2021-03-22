<div align="center">
    <h1>Github Actions Releaser</h1>
</div>

<p>This action to generate a new release notes based on the closed issues after the current.</p>

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Inputs](#inputs)
- [Example usage](#example-usage)
  - [With custom tag name](#with-custom-tag-name)
- [Example projects](#example-projects)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Inputs

| Key | Description | Required | Type |
| --- | ----------- | -------- | ---- |
| `GITHUB_TOKEN` | The github Token | **TRUE** | **SECRET** |
| `TAG_NAME` | The new tag name. Do not use it if you want to auto tagging | **FALSE** | String |

# Example usage

Create the file `workflow.yml` in `.github/workflows` folder.

```yaml
name: Release
on:
  push:
    tags:
      - 'v*'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Generate release notes
        uses: raulanatol/github-actions-releaser@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## With custom tag name

```yaml
name: Release
on:
  push:
    tags:
      - 'v*'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Generate release notes
        uses: raulanatol/github-actions-releaser@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TAG_NAME: vTestName
```

# Example projects

- [Javascript] https://github.com/raulanatol/javascript-example-gar
