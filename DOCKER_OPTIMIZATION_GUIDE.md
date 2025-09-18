# Docker Build Optimization Guide

## 🐛 Current Issues Causing 1GB Pushes

### 1. **Poor Layer Caching**

```dockerfile
# BAD - Current Dockerfile
COPY . .  # Copies everything, breaks cache on any change
RUN NODE_ENV=production npm run build
```

### 2. **Inefficient File Copying**

- `COPY . .` copies ALL files, including unnecessary ones
- Changes to any file invalidate all subsequent layers
- No separation between dependencies and source code

### 3. **Large Final Image**

- Includes build dependencies in final image
- Copies unnecessary files to production stage
- No proper cleanup of build artifacts

## ✅ Optimized Solution

### 1. **Better Layer Ordering**

```dockerfile
# GOOD - Optimized Dockerfile
COPY package.json package-lock.json ./  # Dependencies first
RUN npm ci --only=production            # Cache this layer
COPY src ./src                          # Source code last
```

### 2. **Multi-Stage Build Optimization**

- **deps**: Only production dependencies
- **builder**: Build with dev dependencies
- **runner**: Minimal production image

### 3. **Improved .dockerignore**

- Excludes more unnecessary files
- Reduces build context size
- Faster uploads to Docker daemon

## 📊 Expected Improvements

| Metric             | Before  | After      | Improvement |
| ------------------ | ------- | ---------- | ----------- |
| **Image Size**     | ~1GB    | ~200-300MB | 70% smaller |
| **Build Time**     | 5-10min | 1-3min     | 60% faster  |
| **Cache Hit Rate** | 20%     | 80%        | 4x better   |
| **Upload Size**    | 1GB     | 50-100MB   | 90% smaller |

## 🚀 How to Use

### Option 1: Replace Current Dockerfile

```bash
# Backup current Dockerfile
mv Dockerfile Dockerfile.old

# Use optimized version
mv Dockerfile.optimized Dockerfile
mv .dockerignore.optimized .dockerignore

# Build normally
docker compose build
```

### Option 2: Test Side-by-Side

```bash
# Test optimized build
./build-optimized.sh

# Compare sizes
docker images | grep chuannhadat-web
```

### Option 3: Update docker-compose.yml

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.optimized
```

## 🔧 Key Optimizations Applied

### 1. **Dependency Caching**

- Dependencies installed in separate layer
- Only rebuilds when package.json changes
- Uses `npm ci` for faster, reproducible builds

### 2. **Source Code Separation**

- Source code copied after dependencies
- Changes to code don't invalidate dependency cache
- Ordered by change frequency

### 3. **Multi-Stage Efficiency**

- Production dependencies separate from dev dependencies
- Only necessary files copied to final image
- Smaller runtime image

### 4. **BuildKit Features**

- Cache mounts for npm cache
- Parallel builds
- Better layer caching

## 🎯 Next Steps

1. **Test the optimized build**:

   ```bash
   ./build-optimized.sh
   ```

2. **Compare image sizes**:

   ```bash
   docker images chuannhadat-web
   ```

3. **If satisfied, replace the original**:

   ```bash
   mv Dockerfile.optimized Dockerfile
   ```

4. **Update your CI/CD** to use the new Dockerfile

## 💡 Additional Tips

- **Use .dockerignore**: Exclude unnecessary files
- **Layer ordering**: Put frequently changing files last
- **Multi-stage builds**: Separate build and runtime environments
- **BuildKit**: Enable for better performance
- **Cache strategy**: Design layers for maximum reuse
