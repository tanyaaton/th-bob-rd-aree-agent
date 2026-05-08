# IBM Cloud Code Engine Deployment Guide

This guide explains how to deploy the Tax Submission Application to IBM Cloud Code Engine.

## Prerequisites

1. **IBM Cloud Account**: Sign up at [cloud.ibm.com](https://cloud.ibm.com)
2. **IBM Cloud CLI**: Install from [cloud.ibm.com/docs/cli](https://cloud.ibm.com/docs/cli)
3. **Code Engine Plugin**: Install the Code Engine plugin
4. **Docker**: Install Docker Desktop for local testing

## Installation Steps

### 1. Install IBM Cloud CLI and Code Engine Plugin

```bash
# Install Code Engine plugin
ibmcloud plugin install code-engine

# Login to IBM Cloud
ibmcloud login

# Target your resource group
ibmcloud target -g Default
```

### 2. Create a Code Engine Project

```bash
# Create a new Code Engine project
ibmcloud ce project create --name tax-submission-app

# Select the project
ibmcloud ce project select --name tax-submission-app
```

### 3. Build and Test Docker Image Locally (Optional)

```bash
# Navigate to the tax-submission-app directory
cd tax-submission-app

# Build the Docker image
docker build -t tax-submission-app:latest .

# Test locally
docker run -p 8080:8080 tax-submission-app:latest

# Access at http://localhost:8080
```

### 4. Deploy to IBM Cloud Code Engine

#### Option A: Build from Local Source

```bash
# Build and deploy from local directory
ibmcloud ce application create \
  --name tax-submission-app \
  --build-source . \
  --strategy dockerfile \
  --port 8080 \
  --min-scale 1 \
  --max-scale 3 \
  --cpu 0.25 \
  --memory 0.5G
```

#### Option B: Build from Git Repository

```bash
# If your code is in a Git repository
ibmcloud ce application create \
  --name tax-submission-app \
  --build-source https://github.com/YOUR_USERNAME/YOUR_REPO \
  --build-context-dir tax-submission-app \
  --strategy dockerfile \
  --port 8080 \
  --min-scale 1 \
  --max-scale 3 \
  --cpu 0.25 \
  --memory 0.5G
```

#### Option C: Use Container Registry

```bash
# 1. Build and push to IBM Container Registry
ibmcloud cr namespace-add tax-app
docker build -t us.icr.io/tax-app/tax-submission-app:latest .
ibmcloud cr login
docker push us.icr.io/tax-app/tax-submission-app:latest

# 2. Deploy from registry
ibmcloud ce application create \
  --name tax-submission-app \
  --image us.icr.io/tax-app/tax-submission-app:latest \
  --port 8080 \
  --min-scale 1 \
  --max-scale 3 \
  --cpu 0.25 \
  --memory 0.5G
```

### 5. Get Application URL

```bash
# Get the application URL
ibmcloud ce application get --name tax-submission-app

# Or list all applications
ibmcloud ce application list
```

The output will show your application URL, typically:
`https://tax-submission-app.xxxxxxxxx.us-south.codeengine.appdomain.cloud`

## Configuration Options

### Scaling Configuration

```bash
# Update scaling settings
ibmcloud ce application update \
  --name tax-submission-app \
  --min-scale 0 \
  --max-scale 5 \
  --scale-down-delay 300
```

### Resource Allocation

```bash
# Update CPU and memory
ibmcloud ce application update \
  --name tax-submission-app \
  --cpu 0.5 \
  --memory 1G
```

### Environment Variables

```bash
# Add environment variables if needed
ibmcloud ce application update \
  --name tax-submission-app \
  --env SECRET_KEY=your-production-secret-key
```

## Database Persistence

**Important**: The current setup uses SQLite with ephemeral storage. The database will be reset when:
- The container restarts
- The application scales down to 0
- A new version is deployed

### For Production Use:

Consider these options for persistent data:

1. **IBM Cloud Databases for PostgreSQL**
   - Modify `database.py` to use PostgreSQL instead of SQLite
   - Update `requirements.txt` to include `psycopg2-binary`

2. **IBM Cloud Object Storage**
   - Store SQLite file in Object Storage
   - Load on startup, save periodically

3. **IBM Cloudant (NoSQL)**
   - Migrate to Cloudant for document-based storage

## Monitoring and Logs

```bash
# View application logs
ibmcloud ce application logs --name tax-submission-app

# Follow logs in real-time
ibmcloud ce application logs --name tax-submission-app --follow

# Get application events
ibmcloud ce application events --name tax-submission-app
```

## Updating the Application

```bash
# Update from local source
ibmcloud ce application update \
  --name tax-submission-app \
  --build-source .

# Or rebuild and redeploy
ibmcloud ce application update \
  --name tax-submission-app \
  --rebuild
```

## Deleting the Application

```bash
# Delete the application
ibmcloud ce application delete --name tax-submission-app

# Delete the project
ibmcloud ce project delete --name tax-submission-app
```

## Troubleshooting

### Check Application Status

```bash
ibmcloud ce application get --name tax-submission-app
```

### View Recent Logs

```bash
ibmcloud ce application logs --name tax-submission-app --tail 100
```

### Test Health Endpoint

```bash
curl https://YOUR-APP-URL.codeengine.appdomain.cloud/
```

### Common Issues

1. **Application won't start**: Check logs for Python errors
2. **Database not initialized**: Verify `database.py` runs during build
3. **Port mismatch**: Ensure `--port 8080` matches the app configuration
4. **Memory issues**: Increase memory allocation if needed

## Cost Optimization

- Set `--min-scale 0` to scale to zero when not in use
- Use `--scale-down-delay` to control how quickly it scales down
- Monitor usage in IBM Cloud dashboard

## Security Best Practices

1. Use environment variables for secrets
2. Enable HTTPS (automatic with Code Engine)
3. Implement authentication for production
4. Regular security updates of dependencies

## Additional Resources

- [IBM Cloud Code Engine Documentation](https://cloud.ibm.com/docs/codeengine)
- [Code Engine CLI Reference](https://cloud.ibm.com/docs/codeengine?topic=codeengine-cli)
- [Code Engine Pricing](https://cloud.ibm.com/docs/codeengine?topic=codeengine-pricing)

## Support

For issues with:
- **Application**: Check application logs and code
- **IBM Cloud**: Contact IBM Cloud Support
- **Code Engine**: Refer to IBM Cloud Code Engine documentation