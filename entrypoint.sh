#!/bin/sh

set -e

echo $(date)
git remote -v
git log
git branch -a

if [ -z "$GREN_GITHUB_TOKEN" ]; then
  echo "GREN_GITHUB_TOKEN is not set"
  exit 1
fi

echo "Starting..."

gren changelog -l 1 --override --generate
cat CHANGELOG.md
