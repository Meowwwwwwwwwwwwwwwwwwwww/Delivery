#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run the server using Gunicorn
gunicorn delivery.wsgi:application --bind 0.0.0.0:$PORT
