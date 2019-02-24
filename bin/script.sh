#!/bin/bash

set -Eeuo pipefail

STAGE=${$GITHUB_SHA:0:7}
COMMAND=$1;

main() {
  if [ "$COMMAND" = 'create-stack' ]; then
    sls deploy --stage $STAGE
  elif [ "$COMMAND" = 'remove-stack' ]; then
    sls remove --stage $STAGE
  else
    echo "Invalid command supplied; must be one of [create-stack, remove-stack]."
    exit 1
  fi
}

main
