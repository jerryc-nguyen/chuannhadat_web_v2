#!/bin/bash

# Optimized Docker build script
set -e

echo "🚀 Starting optimized Docker build..."

# Build with BuildKit for better caching and performance
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build with cache mount and multi-platform support
docker build \
  --file Dockerfile.optimized \
  --tag chuannhadat-web:latest \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-from chuannhadat-web:latest \
  .

echo "✅ Build completed successfully!"

# Optional: Show image size
echo "📊 Image size:"
docker images chuannhadat-web:latest --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Optional: Clean up dangling images to save space
echo "🧹 Cleaning up dangling images..."
docker image prune -f

echo "🎉 All done! Image is ready to use."
