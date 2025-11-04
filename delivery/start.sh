#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- 1. Frontend Build ---
echo "--- Starting React Frontend Build ---"
# Change to the React app directory (assuming 'frontend')
cd frontend

# Install Node dependencies
npm install

# Build the React app (outputs to ./build)
npm run build

# Change back to the repository root
cd ..

# --- 2. Backend Setup ---
echo "--- Setting up Django Backend ---"
# Create a location for static files (React build output) in the Django project root
mkdir -p backend_project/static

# Move the React build output into a Django static folder for WhiteNoise to serve
# IMPORTANT: Adjust 'backend_project' if your Django project name is different.
# NOTE: The 'build' directory name comes from 'react-scripts build' default output.
cp -r frontend/build/* backend_project/static/

echo "--- Build successful. Static files prepared. ---"

# The rest of the deployment (Python dependencies, database migrations) 
# is handled by the Procfile and Railway's default setup.
