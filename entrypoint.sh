#!/bin/sh

set -e

echo $(date)
git remote -v
git log
git branch -a
TAG_NAME=git describe

if [ -z "$GREN_GITHUB_TOKEN" ]; then
  echo "GREN_GITHUB_TOKEN is not set"
  exit 1
fi

echo "Starting..."

gren changelog --override --generate -t "${TAG_NAME}"
cat CHANGELOG.md
