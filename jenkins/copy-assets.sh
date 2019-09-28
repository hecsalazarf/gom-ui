#!/bin/bash

# Tiny script to copy assets to the Gom UX root directory in the web server

set -eo pipefail
# -e  Exit immediately if a command exits with a non-zero status.
# -o option-name
# pipefail: the return value of a pipeline is the status of the last
# command to exit with a non-zero status, or zero if no command exited with a non-zero status

copy_assets() {
  if [ -d "$DEST" ]; then
    # If folder exists from a previous deployment, remove it
    rm -r $DEST
    echo "Old assets removed"
    else
    # Otherwise, create it
    mkdir -p $DEST
    echo "Directory did not exist. Created"
  fi

  # Copy assets
  cp -r $SOURCE $DEST
  echo "New assets copied"
}

if [ -z $1 ] || [ -z $2 ]
then
  # Check that arguments are specified, otherwise echo an error message
  echo "$0: Specify arguments" >&2
  echo "Usage: $0 SOURCE DEST" >&2
  exit 1
fi
SOURCE=$1
DEST=$2
copy_assets
