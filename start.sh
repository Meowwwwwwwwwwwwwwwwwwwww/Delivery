#!/bin/bash
set -e

echo "Running migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
gunicorn delivery.wsgi:application --bind 0.0.0.0:$PORT
