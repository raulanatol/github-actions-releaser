<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Github Actions Releaser](#github-actions-releaser)
- [Inputs](#inputs)
- [Example usage](#example-usage)
- [Example projects](#example-projects)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<div align="center">
    <h1>Github Actions Releaser</h1>
</div>

<p>This action to generate a new release notes based on the closed issues after the current.</p>

---

# Inputs

| Key | Description | Required | Type |
| --- | ----------- | -------- | ---- |
| `GITHUB_TOKEN` | The github Token | **TRUE** | **SECRET** |

# Example usage

Create the file `workflow.yml` in `.github/workflows` folder.

```
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
        uses: raulanatol/github-actions-releaser@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

# Example projects

- [Javascript] https://github.com/raulanatol/javascript-example-gar
