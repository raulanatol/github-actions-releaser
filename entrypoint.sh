#!/bin/sh

set -e

TAG_NAME=$(git describe --abbrev=0 --tags)

if [ -z "$GREN_GITHUB_TOKEN" ]; then
  echo "GREN_GITHUB_TOKEN is not set"
  exit 1
fi

echo "Starting..."

gren changelog --override --generate -t "${TAG_NAME}"
cat CHANGELOG.md
