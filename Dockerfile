# Stage 1: Build Frontend Assets
FROM node:22-alpine AS frontend-builder
WORKDIR /build
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Backend & Static Server
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

# Copy bundled datasets
COPY "candidate-v1.0 (3)_layout_fixed (1)(2) (3)" "./candidate-v1.0 (3)_layout_fixed (1)(2) (3)"

# Copy built frontend from Stage 1
COPY --from=frontend-builder /build/dist /app/frontend/dist

# Set production environment defaults
ENV HOST=0.0.0.0
ENV PORT=8000
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["python", "run.py"]
