#!/bin/bash

# Exit on error
set -e

# Load environment variables
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
source "$SCRIPT_DIR/../.env"

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login \
  --username AWS \
  --password-stdin $ECR_REGISTRY

echo "Successfully logged in to ECR"
