# ==========================================
# Stage 1: Build React Frontend
# ==========================================
FROM node:18 AS frontend-builder
WORKDIR /app/frontend

# Copy frontend code and install dependencies
COPY frontend_build/package*.json ./
RUN npm install

# Copy rest of frontend and build it
COPY frontend_build/ .
RUN npm run build


# ==========================================
# Stage 2: Build Django Backend
# ==========================================
FROM python:3.12-slim AS backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT=8000

# Set workdir
WORKDIR /app

# Copy backend requirements and install
COPY backend_project/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy backend source
COPY backend_project/ ./backend_project/

# Copy React build from previous stage into Django static files
COPY --from=frontend-builder /app/frontend/build ./backend_project/static/

# Collect static files
WORKDIR /app/backend_project
RUN python manage.py collectstatic --noinput || true

# Expose port
EXPOSE 8000

# Start the Django app with Gunicorn
CMD ["gunicorn", "backend_project.wsgi:application", "--bind", "0.0.0.0:8000"]
