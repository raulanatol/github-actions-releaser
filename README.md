# Github Actions Releaser

This action use [gren](https://github.com/github-tools/github-release-notes) to generate the release notes

## Inputs

| Key | Description | Required | Type |
| --- | ----------- | -------- | ---- |
| `GREN_GITHUB_TOKEN` | The GREN github Token | **TRUE** | **SECRET** |

## Example usage

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
          GREN_GITHUB_TOKEN: ${{ secrets.GREN_GITHUB_TOKEN }}
```
