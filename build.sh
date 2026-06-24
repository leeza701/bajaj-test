#!/usr/bin/env bash
# exit on error
set -o errexit

# Install and build frontend
cd frontend
npm install
npm run build

# Install backend dependencies
cd ../chitkara-bfhl
npm install
