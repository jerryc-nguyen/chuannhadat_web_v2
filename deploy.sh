#!/bin/bash

# Deployment automation script for Docker to VPS
# Usage: ./deploy.sh [tag]
#        ./deploy.sh --restart (to restart services only without rebuilding/pushing)
#        ./deploy.sh --use-current-login [tag] (to use current Docker login instead of deploy token)

# Load configuration from .env file if it exists
if [ -f .env.deploy ]; then
  source .env.deploy
else
  echo "Warning: .env.deploy file not found. Using default values."
fi

# Configuration (with defaults that can be overridden by .env.deploy)
VPS_IP="${DEPLOY_VPS_IP:-103.69.84.133}"
VPS_USER="${DEPLOY_VPS_USER:-root}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/web}"
DOCKER_SERVICES=("chuannhadat_next")
REGISTRY="${DEPLOY_REGISTRY:-registry.gitlab.com/mkt-devops/web-deployments}"
DEFAULT_TAG="${DEPLOY_TAG:-chuannhadat_next_v3_released}"
DEPLOY_TOKEN_USERNAME="${DEPLOY_TOKEN_USERNAME:-gitlab+deploy-token-123456}"
DEPLOY_TOKEN="${DEPLOY_TOKEN:-your-token-here}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse command-line options
RESTART_ONLY=false
USE_CURRENT_LOGIN=false
TAG=$DEFAULT_TAG

if [ "$1" == "--restart" ]; then
  RESTART_ONLY=true
  echo -e "${YELLOW}Restart-only mode activated. Skipping build and push.${NC}"
  # If there's a second argument, it's the tag
  if [ -n "$2" ]; then
    TAG=$2
  fi
elif [ "$1" == "--use-current-login" ]; then
  USE_CURRENT_LOGIN=true
  echo -e "${YELLOW}Using current Docker login instead of deploy token.${NC}"
  # If there's a second argument, it's the tag
  if [ -n "$2" ]; then
    TAG=$2
  fi
else
  # If the first argument exists and doesn't start with --, it's the tag
  if [ -n "$1" ] && [[ "$1" != --* ]]; then
    TAG=$1
  fi
fi

IMAGE_NAME="$REGISTRY:$TAG"

# Handle Docker login
if [ "$RESTART_ONLY" = false ]; then
  if [ "$USE_CURRENT_LOGIN" = false ]; then
    echo -e "${YELLOW}Logging in to GitLab registry with deploy token...${NC}"
    echo "$DEPLOY_TOKEN" | docker login $REGISTRY -u $DEPLOY_TOKEN_USERNAME --password-stdin || { echo "Docker login failed"; exit 1; }
  else
    echo -e "${YELLOW}Using existing Docker login credentials...${NC}"
    # Check if already logged in
    if ! docker info > /dev/null 2>&1; then
      echo "Error: Not logged in to Docker. Please log in first with 'docker login $REGISTRY'"
      exit 1
    fi
  fi

  echo -e "${YELLOW}Starting deployment process for $IMAGE_NAME${NC}"

  # Step 1: Build Docker image
  echo -e "${YELLOW}Building Docker image...${NC}"
  docker build --platform linux/x86_64 -t $IMAGE_NAME -f Dockerfile . || { echo "Docker build failed"; exit 1; }

  # Step 2: Push to registry
  echo -e "${YELLOW}Pushing to registry...${NC}"
  docker push $IMAGE_NAME || { echo "Docker push failed"; exit 1; }
else
  echo -e "${YELLOW}Connecting to VPS to restart services only...${NC}"
fi

# Step 3: SSH to VPS and update/restart
echo -e "${YELLOW}Connecting to VPS using SSH key...${NC}"
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP << EOF
  cd $DEPLOY_PATH
  
  # Log in to GitLab registry on VPS if needed
  if [ "$RESTART_ONLY" = false ]; then
    if [ "$USE_CURRENT_LOGIN" = false ]; then
      echo "Logging in to GitLab registry on VPS with deploy token..."
      echo "$DEPLOY_TOKEN" | docker login $REGISTRY -u $DEPLOY_TOKEN_USERNAME --password-stdin
    else
      echo "Using existing Docker login on VPS. Ensure you're already logged in on the VPS."
    fi
    
    echo "Pulling latest image..."
    docker pull $IMAGE_NAME
  fi
  
  echo "Restarting services..."
  for service in ${DOCKER_SERVICES[@]}; do
    echo "Restarting \$service..."
    docker compose stop \$service
    docker compose rm -f \$service
    docker compose up -d \$service
  done
  
  # Only clean up if not in restart-only mode
  if [ "$RESTART_ONLY" = false ]; then
    echo "Cleaning up old images..."
    docker image prune -a -f
  fi
  
  echo "Service restart completed."
EOF

echo -e "${GREEN}Process completed successfully!${NC}"

# Optional: Show running containers on VPS
echo -e "${YELLOW}Current running containers on VPS:${NC}"
ssh $VPS_USER@$VPS_IP "docker ps"

# Log out of Docker registry
if [ "$RESTART_ONLY" = false ] && [ "$USE_CURRENT_LOGIN" = false ]; then
  echo -e "${YELLOW}Logging out of GitLab registry...${NC}"
  docker logout $REGISTRY
fi
