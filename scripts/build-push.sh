#!/bin/bash

# Exit on error and print commands
set -ex

# Get directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."

# Load environment variables
source "$PROJECT_ROOT/.env"

# Login to ECR
bash "$SCRIPT_DIR/ecr-login.sh"

# Build and push backend
cd "$PROJECT_ROOT/backend"
docker build -t "$ECR_REGISTRY/$ECR_REPOSITORY-backend:latest" .
docker push "$ECR_REGISTRY/$ECR_REPOSITORY-backend:latest"

# Build and push frontend
cd "$PROJECT_ROOT/frontend"
docker build -t "$ECR_REGISTRY/$ECR_REPOSITORY-frontend:latest" .
docker push "$ECR_REGISTRY/$ECR_REPOSITORY-frontend:latest"

echo "Successfully built and pushed all images to ECR"
