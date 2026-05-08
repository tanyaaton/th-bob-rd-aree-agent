# Tax Submission API - Backend Only

This is the **API-only backend** for the Tax Submission Application, designed for deployment on IBM Cloud Code Engine.

## Overview

This backend provides REST API endpoints for:
- User validation by National ID
- Tax form submission
- Submission history retrieval
- Health check monitoring

**Note**: This backend does NOT include frontend files (HTML, CSS, JavaScript). It only serves JSON API responses.

## API Endpoints

### Health Check
```
GET /
```
Returns service health status.

### Validate User
```
POST /api/validate-user
Content-Type: application/json

{
  "national_id": "1234567890123"
}
```

### Submit Tax Form
```
POST /api/submit-tax
Content-Type: application/json

{
  "national_id": "1234567890123",
  "income_data": [
    {
      "type": 1,
      "amount": 50000,
      "description": "Salary"
    }
  ]
}
```

### Get Submission History
```
GET /api/history
```

## Files in Backend Folder

- **app.py** - Flask API application (API-only, no frontend routes)
- **database.py** - SQLite database operations
- **requirements.txt** - Python dependencies
- **Dockerfile** - Container configuration
- **.dockerignore** - Files to exclude from Docker build
- **deploy.sh** - Automated deployment script for IBM Cloud
- **IBM_CLOUD_DEPLOYMENT.md** - Detailed deployment guide

## Key Features

✅ **API-only** - No HTML templates or static files  
✅ **CORS enabled** - Can be called from any frontend origin  
✅ **Health check** - Built-in endpoint for monitoring  
✅ **Environment variables** - Configurable via env vars  
✅ **Production-ready** - Optimized for cloud deployment  

## Local Development

### Prerequisites
- Python 3.11+
- Docker (optional, for container testing)

### Run Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Initialize database
python database.py

# Start API server
python app.py
```

The API will be available at `http://localhost:8080`

### Test API

```bash
# Health check
curl http://localhost:8080/

# Validate user
curl -X POST http://localhost:8080/api/validate-user \
  -H "Content-Type: application/json" \
  -d '{"national_id": "1234567890123"}'

# Submit tax form
curl -X POST http://localhost:8080/api/submit-tax \
  -H "Content-Type: application/json" \
  -d '{
    "national_id": "1234567890123",
    "income_data": [
      {"type": 1, "amount": 50000, "description": "Salary"}
    ]
  }'

# Get history
curl http://localhost:8080/api/history
```

## Docker Deployment

### Build and Test Locally

```bash
# Build Docker image
docker build -t tax-api:latest .

# Run container
docker run -p 8080:8080 tax-api:latest

# Test
curl http://localhost:8080/
```

## IBM Cloud Code Engine Deployment

### Quick Deploy

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Manual Deploy

```bash
# Login to IBM Cloud
ibmcloud login

# Create/select project
ibmcloud ce project create --name tax-api
ibmcloud ce project select --name tax-api

# Deploy application
ibmcloud ce application create \
  --name tax-api \
  --build-source . \
  --strategy dockerfile \
  --port 8080 \
  --min-scale 1 \
  --max-scale 3
```

See **IBM_CLOUD_DEPLOYMENT.md** for detailed instructions.

## Environment Variables

The following environment variables can be configured:

- `PORT` - Server port (default: 8080)
- `SECRET_KEY` - Flask secret key (set in production)
- `FLASK_ENV` - Set to 'development' for debug mode

## Database

- **Type**: SQLite
- **File**: `tax_database.db` (created automatically)
- **Location**: Container filesystem (ephemeral)

⚠️ **Important**: The database is stored in the container's filesystem and will be reset when the container restarts. For production use with persistent data, consider migrating to:
- IBM Cloud Databases for PostgreSQL
- IBM Cloudant
- IBM Cloud Object Storage (for SQLite file)

## CORS Configuration

CORS is enabled for all origins by default, allowing any frontend to call this API. To restrict origins in production, modify the CORS configuration in `app.py`:

```python
CORS(app, origins=['https://your-frontend-domain.com'])
```

## Security Considerations

For production deployment:

1. ✅ Set a strong `SECRET_KEY` environment variable
2. ✅ Configure CORS to allow only trusted origins
3. ✅ Use HTTPS (automatic with Code Engine)
4. ✅ Implement rate limiting
5. ✅ Add authentication/authorization
6. ✅ Use a persistent database solution

## Monitoring

```bash
# View logs
ibmcloud ce application logs --name tax-api --follow

# Check status
ibmcloud ce application get --name tax-api

# View metrics in IBM Cloud Console
```

## Troubleshooting

### API not responding
- Check logs: `ibmcloud ce application logs --name tax-api`
- Verify health endpoint: `curl https://your-app-url/`

### Database errors
- Database is initialized on startup via `database.init_db()`
- Check logs for initialization errors

### CORS errors
- Verify CORS is enabled in `app.py`
- Check browser console for specific CORS errors

## Support

For issues:
- Check logs first
- Review IBM_CLOUD_DEPLOYMENT.md
- Consult IBM Cloud Code Engine documentation

## License

This is a backend API service for the Tax Submission Application.