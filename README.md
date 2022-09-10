<div align="center">
    <h1>Github Actions Releaser</h1>
</div>

<p>This action generates release notes based on the closed issues.</p>

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
