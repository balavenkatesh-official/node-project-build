#!/bin/bash

# Update system
sudo apt update -y

# Install dependencies if not present
sudo apt install -y curl
sudo apt install -y zip
sudo apt install -y unzip

# Remove old Node (optional but recommended)
sudo apt remove -y nodejs

# Add NodeSource repo for Node 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -

# Install Node.js 24
sudo apt install -y nodejs

# Verify installation
node -v
npm -v
