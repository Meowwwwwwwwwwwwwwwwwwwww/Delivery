## Stage 1: Frontend Builder
# This stage builds your static frontend assets (e.g., using Node/NPM)
FROM node:18 AS frontend-builder
WORKDIR /app/frontend

# Copy package files first for better caching
COPY delivery/frontend_build/package*.json ./
RUN npm install

# Copy source code and build
COPY delivery/frontend_build/ .
RUN npm run build
# The compiled assets are now typically in /app/frontend/dist or /app/frontend/build

---

## Stage 2: Django Backend (Final Image)
FROM python:3.12-slim

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Set the primary working directory for the Django application
WORKDIR /app

# Install backend dependencies
# Correction 1: requirements.txt is inside the delivery folder
COPY delivery/requirements.txt . 
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy backend source code
# Correction 2: Copy the delivery folder content into the 'delivery' folder within the container
COPY delivery/ ./delivery/

# Copy built frontend files into Django static
# NOTE: The path depends on your frontend build output (usually 'dist' or 'build')
# Assuming 'build' is the output folder from the npm run build step in Stage 1
COPY --from=frontend-builder /app/frontend/build /app/delivery/static/

# Collect static files and define startup command
# Since your manage.py is in 'delivery/', commands must reference that path
RUN python delivery/manage.py collectstatic --noinput

# Run the application using Gunicorn
CMD ["gunicorn", "delivery.wsgi:application", "--bind", "0.0.0.0:8000"]