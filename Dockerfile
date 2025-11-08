# =========================
# FRONTEND BUILD STAGE
# =========================
FROM node:18 AS frontend-builder

# Set working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY frontend/ ./

# Build the React app for production
RUN npm run build


# =========================
# BACKEND STAGE
# =========================
FROM python:3.12-slim AS backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies file
COPY delivery/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY delivery/ .

# Copy built frontend files from frontend-builder
COPY --from=frontend-builder /app/frontend/build /app/staticfiles

# Collect static files (optional if STATICFILES_DIRS is configured)
RUN python manage.py collectstatic --noinput || true

# Expose port
EXPOSE 8000

# Start the Django app with Gunicorn
CMD ["gunicorn", "delivery.wsgi:application", "--bind", "0.0.0.0:8000"]
