# Stage 1: Build frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend_build/package*.json ./  # Make sure this path exists
RUN npm install
COPY frontend_build/ ./               # Copy frontend source
RUN npm run build

# Stage 2: Backend
FROM python:3.12-slim
WORKDIR /app

# Install backend dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt gunicorn

# Copy backend project
COPY delivery/ ./delivery/           # Use your actual folder name

# Copy frontend build into Django static files
COPY --from=frontend-builder /app/frontend/build ./delivery/static/

# Collect static files (optional)
RUN python delivery/manage.py collectstatic --no-input || echo "Collectstatic failed"

# Run server
CMD ["gunicorn", "delivery.wsgi:application", "--bind", "0.0.0.0:8000"]
