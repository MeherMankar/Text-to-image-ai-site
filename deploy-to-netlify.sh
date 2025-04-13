#!/bin/bash

set -e

echo "=== Text-to-Image Generator Netlify Deployment ==="
echo "This script will deploy your frontend to Netlify."

# Navigate to frontend directory
cd frontend

# Ensure we have the right dependencies
echo "Installing dependencies..."
npm install

# Make sure we have netlify-cli
if ! npm list -g netlify-cli > /dev/null 2>&1; then
  echo "Installing Netlify CLI globally..."
  npm install -g netlify-cli
fi

# Build with redirects
echo "Building the application..."
npm run build

# Ensure _redirects exists in build folder
echo "Ensuring _redirects file exists..."
echo "/* /index.html 200" > build/_redirects

# Also create a netlify.toml in the build directory as a fallback
echo "Creating netlify.toml in build directory..."
cat > build/netlify.toml << EOL
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true
EOL

echo "Build contents:"
ls -la build/

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod --dir=build

echo "✅ Deployment complete!" 