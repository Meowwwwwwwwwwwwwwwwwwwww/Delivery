#!/bin/bash
set -e

apt-get update && apt-get install -y python3 python3-pip
python3 -m pip install -r delivery/backend_project/requirements.txt gunicorn

python3 delivery/manage.py migrate --no-input
gunicorn delivery.wsgi:application --bind 0.0.0.0:$PORT
