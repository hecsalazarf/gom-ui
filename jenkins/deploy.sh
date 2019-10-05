#!/bin/bash

# Tiny script to copy assets to the Gom UX root directory in the web server

set -eo pipefail
# -e  Exit immediately if a command exits with a non-zero status.
# -o option-name
# pipefail: the return value of a pipeline is the status of the last
# command to exit with a non-zero status, or zero if no command exited with a non-zero status

echo '--> Sending assets'
# Send files and delete extraneous files from dest dirs
rsync --delete -avzhe "ssh ${SSH_OPTIONS}" dist/ $SSH_USR@$REMOTE_HOST:$REMOTE_TEMP_DIR
echo "--> Copying assets to web server directory"
ssh $SSH_OPTIONS -l $SSH_USR $REMOTE_HOST "echo $SSH_PSW | sudo -S rsync --delete -ah $REMOTE_TEMP_DIR $REMOTE_WEB_DIR"
