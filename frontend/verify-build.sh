#!/bin/bash

# Clean build if it exists
if [ -d "build" ]; then
  echo "Removing existing build directory..."
  rm -rf build
fi

# Build the application
echo "Building application..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
  echo "❌ Build failed. No build directory was created."
  exit 1
fi

# Check if index.html exists
if [ ! -f "build/index.html" ]; then
  echo "❌ Build missing index.html file."
  exit 1
fi

# Ensure _redirects file exists in the build folder
echo "Creating _redirects file in build directory..."
echo "/* /index.html 200" > build/_redirects

# List the build directory contents
echo "✅ Build directory contents:"
ls -la build/

echo "✅ Build verification complete. Your build directory is ready for deployment." 