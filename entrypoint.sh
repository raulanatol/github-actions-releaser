#!/bin/sh

set -e

if [ -z "$GREN_GITHUB_TOKEN" ]; then
  echo "GREN_GITHUB_TOKEN is not set"
  exit 1
fi

echo "Starting..."

gren changelog --generate
CHANGELOG=$(cat CHANGELOG.md)
echo "::set-output name=changelog_body::$CHANGELOG"
