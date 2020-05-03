# Github Actions Releaser

This action to generate a new release notes based on the closed issues after the current.

## Inputs

| Key | Description | Required | Type |
| --- | ----------- | -------- | ---- |
| `GITHUB_TOKEN` | The github Token | **TRUE** | **SECRET** |

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
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```


## Example projects

- [Javascript] https://github.com/raulanatol/javascript-example-gar
