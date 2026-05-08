# Use Python 3.11 slim image for smaller size
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY database.py .
COPY app.py .

# Note: Database will be initialized automatically when app.py starts
# via database.init_db() call in app.py

# Expose port (IBM Cloud Code Engine uses PORT environment variable)
EXPOSE 8080

# Health check for IBM Cloud Code Engine
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080').read()" || exit 1

# Run the application
# Use gunicorn for production deployment (more robust than Flask dev server)
CMD ["python", "app.py"]