#!/bin/bash

set -euo pipefail

VERSION=${1-}
REQUIRED_TOOLS="jq git"

if test -z "$VERSION"; then
  echo "Missing version parameter. Usage: $0 VERSION"
  exit 1
fi

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

jq --arg new_version "$VERSION" '.version = ($new_version)' package.json > tmp.json && mv tmp.json package.json

git commit -a -m "prepare release v$VERSION"

git tag -a "v$VERSION" -m "$VERSION"
