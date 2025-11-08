
FROM node:18 AS frontend-builder

WORKDIR /app/frontend

COPY delivery/templates/package*.json ./

RUN npm install

COPY delivery/templates/ ./

RUN npm run build



FROM python:3.12-slim

WORKDIR /delivery

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./

RUN pip install --upgrade pip
RUN pip install -r requirements.txt gunicorn

COPY delivery/ ./delivery/

COPY --from=frontend-builder /app/frontend/build ./delivery/static/

RUN python delivery/manage.py collectstatic --no-input || echo "Collectstatic failed"

EXPOSE 8000

CMD ["gunicorn", "delivery.wsgi:application", "--bind", "0.0.0.0:8000"]
