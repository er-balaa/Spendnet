# Stage 1: Build Frontend Assets
FROM node:22-alpine AS frontend-builder
WORKDIR /build

# Install dependencies first for Docker layer caching
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Build frontend production bundle
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Backend & Single-Container SPA Server
FROM python:3.12-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY backend/app ./app
COPY backend/run.py ./
COPY backend/tests ./tests

# Copy seed datasets and create exports directory
COPY data ./data
RUN mkdir -p /app/exports

# Copy built frontend from Stage 1
COPY --from=frontend-builder /build/dist /app/frontend/dist

# Set production environment defaults
ENV HOST=0.0.0.0
ENV PORT=8000
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV STORAGE_FILE_PATH=/app/data/spendnest_store.json
ENV INITIAL_DATA_PATH=/app/data/01_initial.json
ENV UPDATE_DATA_PATH=/app/data/02_update.json
ENV EXPORTS_DIR=/app/exports
ENV DATABASE_NAME=spendnest_revenue_intelligence
ENV CORS_ORIGINS=*

EXPOSE 8000

# Run FastAPI server binding to Render's dynamic $PORT (defaults to 8000)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
