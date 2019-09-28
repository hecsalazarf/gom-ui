#!/bin/bash

# Extract and copy assets to the Gom UX root directory in Nginx

set -eo pipefail
# -e  Exit immediately if a command exits with a non-zero status.
# -o option-name
# pipefail: the return value of a pipeline is the status of the last
# command to exit with a non-zero status, or zero if no command exited with a non-zero status
DIST_DIR=/var/www/gom-ui/pwa
# [ -d "${DIST_DIR}" ] &&  echo "Directory ${DIST_DIR} found." || echo "Directory ${DIST_DIR} not found."
if [ -d "$DIST_DIR" ]; then
  # If folder exists from a previous deployment, remove it
  rm -r /var/www/gom-ui/pwa
  echo "Old assets removed"
fi

cp -r /home/hector/dist/pwa/ /var/www/gom-ui/
echo "New assets copied"
# Remove temp files
rm -r /home/hector/dist.tar.gz /home/hector/dist
