#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- 1. Frontend Build ---
echo "--- Starting React Frontend Build ---"

# FIX 1: Change to the correct React source directory: 'delivery/frontend'
cd delivery/frontend_build

echo "--- Installing Node dependencies ---"
npm install

echo "--- Building React app ---"
# This creates the 'build' folder *inside* 'delivery/frontend'
npm run build

# FIX 2: Change back to the repository root (two levels up)
cd ../..

# --- 2. Backend Setup ---
echo "--- Setting up Django Backend ---"
# Create a location for static files (React build output) in the Django project root
# Using the full path 'delivery/backend_project/static'
mkdir -p delivery/backend_project/static

# Move the React build output into a Django static folder for WhiteNoise to serve
# FIX 3: Source is now 'delivery/frontend/build' and destination includes 'delivery'
cp -r delivery/frontend/build/* delivery/backend_project/static/

echo "--- Build successful. Static files prepared. ---"

# The rest of the deployment (Python dependencies, database migrations) 
# is handled by the Procfile and Railway's default setup.