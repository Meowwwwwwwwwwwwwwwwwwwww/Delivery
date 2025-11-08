#!/bin/bash
set -e

echo "--- Setting up Django Backend ---"

# Collect static files
python manage.py collectstatic --noinput

# Apply migrations
python manage.py migrate

# Start server
gunicorn delivery.wsgi
