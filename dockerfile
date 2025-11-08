# ===============================
# Stage 1: Build React frontend
# ===============================
FROM node:18 AS frontend_builder
WORKDIR /app/frontend
COPY frontend_build/package*.json ./
RUN npm install
COPY frontend_build/ .
RUN npm run build

# ===============================
# Stage 2: Django backend
# ===============================
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

WORKDIR /app

# Install dependencies
COPY backend_project/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy backend source code
COPY backend_project/ ./backend_project/

# Copy built frontend files into Django static
COPY --from=frontend-builder /app/frontend/build ./backend_project/static/

# Collect static files (optional, safe to fail)
WORKDIR /app/backend_project
RUN python3 manage.py collectstatic --noinput || true

EXPOSE 8000

CMD ["gunicorn", "backend_project.wsgi:application", "--bind", "0.0.0.0:8000"]
