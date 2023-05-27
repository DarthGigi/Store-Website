#!/bin/bash

# Directory names
clone_directory="./store-repo"

# Log file path
log_file="./store-build.log"

# Change directory to the clone directory
cd "$clone_directory"

# Clone the repository if it doesn't exist (check for .git folder)
if [ ! -d ".git" ]; then
    git clone https://github.com/SiriusDevelopmentGroup/Store.git ./ || { echo "Failed to clone the repository. Exiting."; exit 1; }
# If the repository already exists, pull the latest changes
else
    git pull || { echo "Failed to pull the latest changes. Exiting."; exit 1; }
fi

# Install dependencies
pnpm i || { echo "Failed to install dependencies. Exiting."; exit 1; }

# Build the project and capture the output in the log file
pnpm build > "$log_file" 2>&1 || { echo "Build failed. Check the log file for details: $log_file"; exit 1; }

# Restart the project using pm2
pm2 restart Sirius-Store || { echo "Failed to restart the project using pm2. Exiting."; exit 1; }

# Exit the script
exit 0