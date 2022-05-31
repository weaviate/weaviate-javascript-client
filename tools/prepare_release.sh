#!/bin/bash

set -euo pipefail

VERSION="$(jq -r '.version' ./package.json)"
REQUIRED_TOOLS="jq git"

for tool in $REQUIRED_TOOLS; do
  if ! hash "$tool" 2>/dev/null; then
    echo "This script requires '$tool', but it is not installed."
    exit 1
  fi
done

if git rev-parse "v$VERSION" >/dev/null 2>&1; then
  echo "Cannot prepare release, a release for v$VERSION already exists"
  exit 1
fi

git commit -a -m "prepare release v$VERSION"

git tag -a "v$VERSION" -m "$VERSION"
