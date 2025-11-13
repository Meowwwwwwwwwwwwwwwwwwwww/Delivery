#!/bin/bash
set -e  # exit immediately on error

echo "🔧 Installing dependencies..."
pip install --no-cache-dir -r delivery/requirements.txt gunicorn

echo "📦 Running migrations..."
python delivery/manage.py migrate --no-input

echo "🧹 Collecting static files..."
python delivery/manage.py collectstatic --no-input

cd delivery
echo "🚀 Starting Gunicorn server..."
gunicorn delivery.wsgi:application --bind 0.0.0.0:$PORT
