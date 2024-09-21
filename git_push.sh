#!/bin/bash

# Check if a commit message was provided
if [ -z "$1" ]; then
  echo "Usage: ./git_push.sh \"Your commit message\""
  exit 1
fi

# Add all changes to staging
git add .

# Commit the changes with the provided message
git commit -m "$1"

# Push the changes to the remote repository
git push

echo "Changes have been pushed successfully!"
