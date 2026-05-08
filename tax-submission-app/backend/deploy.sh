#!/bin/bash

# Tax Submission App - IBM Cloud Code Engine Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "=========================================="
echo "Tax Submission App Deployment"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="tax-submission-app"
PROJECT_NAME="tax-submission-app"
PORT=8080
MIN_SCALE=1
MAX_SCALE=3
CPU="0.25"
MEMORY="0.5G"

# Check if IBM Cloud CLI is installed
if ! command -v ibmcloud &> /dev/null; then
    echo -e "${RED}Error: IBM Cloud CLI is not installed${NC}"
    echo "Please install it from: https://cloud.ibm.com/docs/cli"
    exit 1
fi

# Check if Code Engine plugin is installed
if ! ibmcloud plugin list | grep -q "code-engine"; then
    echo -e "${YELLOW}Code Engine plugin not found. Installing...${NC}"
    ibmcloud plugin install code-engine -f
fi

# Login check
echo -e "${YELLOW}Checking IBM Cloud login status...${NC}"
if ! ibmcloud target &> /dev/null; then
    echo -e "${YELLOW}Please login to IBM Cloud:${NC}"
    ibmcloud login
fi

# Select or create project
echo ""
echo -e "${YELLOW}Setting up Code Engine project...${NC}"
if ibmcloud ce project get --name "$PROJECT_NAME" &> /dev/null; then
    echo -e "${GREEN}Project '$PROJECT_NAME' exists. Selecting it...${NC}"
    ibmcloud ce project select --name "$PROJECT_NAME"
else
    echo -e "${YELLOW}Creating new project '$PROJECT_NAME'...${NC}"
    ibmcloud ce project create --name "$PROJECT_NAME"
    ibmcloud ce project select --name "$PROJECT_NAME"
fi

# Check if application exists
echo ""
if ibmcloud ce application get --name "$APP_NAME" &> /dev/null; then
    echo -e "${YELLOW}Application '$APP_NAME' exists. Updating...${NC}"
    ibmcloud ce application update \
        --name "$APP_NAME" \
        --build-source . \
        --strategy dockerfile \
        --port "$PORT" \
        --min-scale "$MIN_SCALE" \
        --max-scale "$MAX_SCALE" \
        --cpu "$CPU" \
        --memory "$MEMORY"
else
    echo -e "${YELLOW}Creating new application '$APP_NAME'...${NC}"
    ibmcloud ce application create \
        --name "$APP_NAME" \
        --build-source . \
        --strategy dockerfile \
        --port "$PORT" \
        --min-scale "$MIN_SCALE" \
        --max-scale "$MAX_SCALE" \
        --cpu "$CPU" \
        --memory "$MEMORY"
fi

# Get application URL
echo ""
echo -e "${GREEN}=========================================="
echo "Deployment Complete!"
echo "==========================================${NC}"
echo ""
APP_URL=$(ibmcloud ce application get --name "$APP_NAME" --output json | grep -o '"url":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}Application URL:${NC} $APP_URL"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  View logs:    ibmcloud ce application logs --name $APP_NAME --follow"
echo "  Get status:   ibmcloud ce application get --name $APP_NAME"
echo "  Update app:   ./deploy.sh"
echo "  Delete app:   ibmcloud ce application delete --name $APP_NAME"
echo ""

# Made with Bob
