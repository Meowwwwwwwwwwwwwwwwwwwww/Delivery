# =========================
# Stage 1: Build Frontend
# =========================
FROM node:18 AS frontend-builder

# Set working directory
WORKDIR /app/frontend

# Copy only package files first (for caching npm install)
COPY delivery/templates/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy all frontend files
COPY delivery/templates/ ./

# Build frontend (assuming React/Vite/etc.)
RUN npm run build

# =========================
# Stage 2: Backend (Python/Django)
# =========================
FROM python:3.12-slim AS backend

# Set working directory
WORKDIR /delivery

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY delivery/ ./

# Copy built frontend into Django static folder
COPY --from=frontend-builder /app/frontend/build /delivery/static/

# Set environment variables (optional)
ENV PYTHONUNBUFFERED=1

# Run Django migrations and start server (for Railway)
CMD ["sh", "-c", "python manage.py migrate --no-input && gunicorn delivery.wsgi:application --bind 0.0.0.0:$PORT"]
