#!/bin/bash

# Make sure script stops on first error
set -e

# Build the React app for production
echo "Building React application..."
npm run build

# Create _redirects file if it doesn't exist (backup)
if [ ! -f "build/_redirects" ]; then
  echo "Creating _redirects file..."
  echo "/* /index.html 200" > build/_redirects
fi

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
  echo "netlify command not found, installing netlify-cli..."
  npm install -g netlify-cli
fi

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod --dir=build

echo "Deployment complete!" 