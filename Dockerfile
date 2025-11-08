# Stage 1: Build frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend  # Consistent path
COPY delivery/templates/package*.json ./  
RUN npm install
COPY delivery/templates/ ./               
RUN npm run build

# Stage 2: Backend
FROM python:3.12-slim
WORKDIR /delivery

# Install system dependencies (often needed for Python packages)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install backend dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt gunicorn

# Copy backend project files
COPY delivery/ ./delivery/

# Copy frontend build into Django static files
COPY --from=frontend-builder /app/frontend/build ./delivery/static/

# Collect static files (fixed typo: collectstxatic → collectstatic)
RUN python delivery/manage.py collectstatic --no-input || echo "Collectstatic failed"

# Expose port and run server
EXPOSE 8000
CMD ["gunicorn", "delivery.wsgi:application", "--bind", "0.0.0.0:8000"]
