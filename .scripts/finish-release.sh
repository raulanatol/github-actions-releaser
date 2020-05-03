#!/bin/bash

set -eu

function error() {
  echo "🚨 Error: $1"
  exit 1
}

if [ $# != 1 ]; then
  error "Please specify npm version parameter (major, minor, patch)"
fi

VERSION_PARAM=$1
BRANCH=$(git rev-parse --abbrev-ref HEAD)

function cleanup() {
  npm run clean
}

function verify_uncommitted_changes() {
  if [[ $(git status --porcelain) ]]; then
    error "There are uncommitted changes in the working tree."
  fi
}

function verify_master_branch() {
  if [ "${BRANCH}" == 'master' ]; then
    echo "Master branch"
  else
    error "Invalid branch name ${BRANCH}"
  fi
}

function new_version() {
  npm version "${VERSION_PARAM}"
}

function git_push() {
  git push -u origin master && git push --tags
}

cleanup
verify_uncommitted_changes
verify_master_branch
new_version
git_push

echo 'Finish release'
