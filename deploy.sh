#!/bin/bash

# Optimized deployment automation script for Docker to VPS
# Usage: ./deploy.sh [tag]
#        ./deploy.sh --restart (to restart services only without rebuilding/pushing)
#        ./deploy.sh --use-current-login [tag] (to use current Docker login instead of deploy token)
#        ./deploy.sh --ssh (SSH into server without any deployment actions)

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
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse command-line options
RESTART_ONLY=false
USE_CURRENT_LOGIN=false
SSH_ONLY=false
TAG=$DEFAULT_TAG

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --restart)
      RESTART_ONLY=true
      echo -e "${YELLOW}Restart-only mode activated. Skipping build and push.${NC}"
      shift
      ;;
    --use-current-login)
      USE_CURRENT_LOGIN=true
      echo -e "${YELLOW}Using current Docker login instead of deploy token.${NC}"
      shift
      ;;
    --ssh)
      SSH_ONLY=true
      echo -e "${YELLOW}SSH-only mode activated. Connecting to server without deployment.${NC}"
      shift
      ;;
    --*)
      echo "Unknown option $1"
      exit 1
      ;;
    *)
      TAG=$1
      shift
      ;;
  esac
done

IMAGE_NAME="$REGISTRY:$TAG"

# Handle SSH-only mode
if [ "$SSH_ONLY" = true ]; then
  echo -e "${YELLOW}Connecting to VPS via SSH...${NC}"
  echo -e "${BLUE}🔗 SSH Connection Details:${NC}"
  echo -e "  Server: $VPS_IP"
  echo -e "  User: $VPS_USER"
  echo -e "  Path: $DEPLOY_PATH"
  echo ""

  # SSH into the server with pseudo-terminal for interactive session
  ssh -t -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "
    echo 'Connected to \$(hostname) at \$(pwd)'
    echo 'Type \"exit\" or Ctrl+D to disconnect'
    echo ''
    # Change to deployment directory
    cd $DEPLOY_PATH
    echo \"Current directory: \$(pwd)\"
    echo 'Available commands:'
    echo '  docker ps           - Show running containers'
    echo '  docker compose logs - View logs'
    echo '  docker compose ps   - Show compose services'
    echo '  ls -la              - List files'
    echo ''
    # Start interactive bash shell
    exec /bin/bash
  "
  echo -e "${GREEN}✅ SSH session ended${NC}"
  exit 0
fi

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

  echo -e "${YELLOW}Starting optimized deployment process for $IMAGE_NAME${NC}"

  # Enable BuildKit for better caching and performance
  export DOCKER_BUILDKIT=1
  export COMPOSE_DOCKER_CLI_BUILD=1

  # Prepare build arguments
  BUILD_ARGS="--platform linux/x86_64"
  BUILD_ARGS="$BUILD_ARGS --build-arg BUILDKIT_INLINE_CACHE=1"
  BUILD_ARGS="$BUILD_ARGS --cache-from $IMAGE_NAME"

  # Step 1: Build Docker image with optimized Dockerfile
  echo -e "${YELLOW}Building optimized Docker image with enhanced caching...${NC}"
  docker build \
    $BUILD_ARGS \
    -t $IMAGE_NAME \
    -f Dockerfile.optimized \
    . || { echo "Docker build failed"; exit 1; }

  # Step 2: Push to registry
  echo -e "${YELLOW}Pushing to registry...${NC}"
  docker push $IMAGE_NAME || { echo "Docker push failed"; exit 1; }

  # Show image size for comparison
  echo -e "${BLUE}📊 Image size:${NC}"
  docker images $IMAGE_NAME --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

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
    
    echo "Pulling latest optimized image..."
    docker pull $IMAGE_NAME
  fi
  
  echo "Restarting services with optimized image..."
  for service in ${DOCKER_SERVICES[@]}; do
    echo "Restarting \$service..."
    docker compose stop \$service
    docker compose rm -f \$service
    docker compose up -d \$service
  done
  
  # Enhanced cleanup for optimized builds
  if [ "$RESTART_ONLY" = false ]; then
    echo "Cleaning up old images and build cache..."
    docker image prune -a -f
    docker builder prune -f
  fi
  
  echo "Service restart completed with optimized image."
EOF

echo -e "${GREEN}✅ Optimized deployment completed successfully!${NC}"

# Optional: Show running containers on VPS
echo -e "${YELLOW}Current running containers on VPS:${NC}"
ssh $VPS_USER@$VPS_IP "docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'"

# Show deployment summary
echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo -e "  Image: $IMAGE_NAME"
echo -e "  Dockerfile: Dockerfile.optimized"
echo -e "  Environment: Runtime from docker-compose"
echo -e "  BuildKit: Enabled"
echo -e "  Cache: Optimized multi-stage build"

# Log out of Docker registry
if [ "$RESTART_ONLY" = false ] && [ "$USE_CURRENT_LOGIN" = false ]; then
  echo -e "${YELLOW}Logging out of GitLab registry...${NC}"
  docker logout $REGISTRY
fi

# Clean up local build cache periodically (optional)
echo -e "${YELLOW}🧹 Cleaning up local build cache...${NC}"
docker builder prune -f
