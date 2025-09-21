# Use a slim Python image
FROM python:3.12-slim

# Create app dir
WORKDIR /app

# Install system deps for languagetool (Java not required; the python lib bundles server)
# If your build later needs extra libs, add them here (apt-get update && apt-get install -y ...)

# Copy and install Python deps first (better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Fly will map public port to this container port
ENV PORT=8081
EXPOSE 8081

# Run via gunicorn + uvicorn worker
CMD ["gunicorn","-k","uvicorn.workers.UvicornWorker","api:app","--bind","0.0.0.0:8081"]
