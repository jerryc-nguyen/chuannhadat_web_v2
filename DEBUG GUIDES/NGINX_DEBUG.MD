# Nginx Debugging Guide

## Problem Context

RSC (React Server Components) requests with query parameters (`?_rsc=1q0l6`) and headers (`rsc: 1`, `next-router-prefetch: 1`) work on localhost but are not being detected properly in production. The middleware logs show these parameters and headers as missing.

## Debugging Commands Used

### 1. Check Generated Nginx Configuration

```bash
ssh root@103.69.84.133 "docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf | head -50"
```

**Purpose**: View the actual nginx configuration being used in production to understand how requests are being processed.

**Parameters Explained**:

- `ssh root@103.69.84.133`: Connect to VPS server as root user at IP 103.69.84.133
- `docker exec nginx-proxy`: Execute command inside the nginx-proxy Docker container
- `cat /etc/nginx/conf.d/default.conf`: Display contents of the main nginx configuration file
- `| head -50`: Pipe output and show only first 50 lines to avoid overwhelming output

### 2. Find Domain-Specific Configuration

```bash
ssh root@103.69.84.133 "docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf | grep -A 20 -B 5 'chuannhadat.com'"
```

**Purpose**: Locate the specific server block and upstream configuration for your domain to see proxy settings.

**Parameters Explained**:

- `ssh root@103.69.84.133`: Connect to VPS server as root user
- `docker exec nginx-proxy`: Execute command inside nginx-proxy container
- `cat /etc/nginx/conf.d/default.conf`: Read the nginx configuration file
- `| grep -A 20 -B 5 'chuannhadat.com'`: Search for 'chuannhadat.com' and show:
  - `-A 20`: 20 lines **After** the match
  - `-B 5`: 5 lines **Before** the match
  - This gives context around your domain configuration

### 3. Check Proxy Configuration

```bash
ssh root@103.69.84.133 "docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf | grep -A 30 'proxy_pass'"
```

**Purpose**: Examine proxy_pass directives and related proxy settings that might affect headers and query parameters.

**Parameters Explained**:

- `ssh root@103.69.84.133`: Connect to VPS server
- `docker exec nginx-proxy`: Execute inside nginx-proxy container
- `cat /etc/nginx/conf.d/default.conf`: Read nginx config file
- `| grep -A 30 'proxy_pass'`: Search for 'proxy_pass' and show:
  - `-A 30`: 30 lines **After** each match
  - This shows proxy configuration that handles request forwarding

### 4. Inspect Nginx Template

```bash
ssh root@103.69.84.133 "docker exec nginx-proxy-gen cat /etc/docker-gen/templates/nginx.tmpl | head -20"
```

**Purpose**: Check if a custom nginx template is being used that might have different proxy behavior.

**Parameters Explained**:

- `ssh root@103.69.84.133`: Connect to VPS server
- `docker exec nginx-proxy-gen`: Execute inside nginx-proxy-gen container (the template generator)
- `cat /etc/docker-gen/templates/nginx.tmpl`: Read the nginx template file used to generate configs
- `| head -20`: Show first 20 lines to see template structure and variables

### 5. Find Proxy Pass Template Configuration

```bash
ssh root@103.69.84.133 "docker exec nginx-proxy-gen cat /etc/docker-gen/templates/nginx.tmpl | grep -A 20 -B 5 'proxy_pass'"
```

**Purpose**: Examine how the nginx template handles proxy_pass and related configurations.

**Parameters Explained**:

- `ssh root@103.69.84.133`: Connect to VPS server
- `docker exec nginx-proxy-gen`: Execute inside template generator container
- `cat /etc/docker-gen/templates/nginx.tmpl`: Read the template file
- `| grep -A 20 -B 5 'proxy_pass'`: Search for 'proxy_pass' in template and show:
  - `-A 20`: 20 lines **After** match (shows proxy configuration)
  - `-B 5`: 5 lines **Before** match (shows context/conditions)
  - This reveals how proxy_pass is configured in the template

### 6. Check Custom Vhost Configurations

```bash
ssh root@103.69.84.133 "docker exec nginx-proxy ls -la /etc/nginx/vhost.d/ | grep chuann"
ssh root@103.69.84.133 "docker exec nginx-proxy ls -la /etc/nginx/vhost.d/"
```

**Purpose**: Look for custom nginx configurations that might be overriding default behavior or stripping headers/parameters.

**Parameters Explained**:

- **First Command**: `ssh root@103.69.84.133 "docker exec nginx-proxy ls -la /etc/nginx/vhost.d/ | grep chuann"`
  - `ls -la /etc/nginx/vhost.d/`: List all files in vhost directory with detailed info (`-la`)
  - `| grep chuann`: Filter results to show only files containing 'chuann'
  - **Purpose**: Look for domain-specific custom configurations
- **Second Command**: `ssh root@103.69.84.133 "docker exec nginx-proxy ls -la /etc/nginx/vhost.d/"`
  - `ls -la /etc/nginx/vhost.d/`: List ALL files in vhost directory
  - **Purpose**: See all custom vhost configurations that might affect requests

### 7. Check Nginx Access Logs

```bash
ssh root@103.69.84.133 "docker exec nginx-proxy tail -20 /var/log/nginx/access.log"
```

**Purpose**: View actual HTTP requests reaching nginx to compare with what the middleware receives.

**Parameters Explained**:

- `ssh root@103.69.84.133`: Connect to VPS server
- `docker exec nginx-proxy`: Execute inside nginx-proxy container
- `tail -20 /var/log/nginx/access.log`: Show last 20 lines of nginx access log
  - `tail -20`: Display the most recent 20 lines from the end of file
  - `/var/log/nginx/access.log`: Standard nginx access log location
  - **Purpose**: See actual HTTP requests as they hit nginx (before processing)

## Key Findings

### Nginx Configuration Analysis

- **Standard nginx-proxy setup**: Using `nginxproxy/docker-gen` with default template
- **Proxy headers**: Standard headers are being set (`X-Real-IP`, `X-Forwarded-For`, etc.)
- **No custom vhost configs**: No domain-specific configurations that could strip parameters
- **Standard proxy_pass**: Simple `proxy_pass http://chuannhadat.com;` without modifications

### Potential Issues Identified

1. **Header Case Sensitivity**: Nginx might be normalizing header names
2. **Proxy Buffering**: Default nginx settings might affect request processing
3. **HTTP Version**: Proxy using HTTP/1.1 which should preserve headers and query params
4. **No URL Rewriting**: No obvious nginx rules that would strip query parameters

## Next Steps for Debugging

### 1. Add Nginx Request Logging

```bash
# Add to nginx configuration to log full request details
log_format debug_format '$remote_addr - $remote_user [$time_local] '
                        '"$request" $status $body_bytes_sent '
                        '"$http_referer" "$http_user_agent" '
                        '"$args" "$http_rsc" "$http_next_router_prefetch"';
```

### 2. Compare Localhost vs Production

- **Localhost**: Direct connection to Next.js (port 3000)
- **Production**: Request → Nginx → Docker Network → Next.js (port 4500)
- **Difference**: Nginx proxy layer might be transforming requests

### 3. Test Direct Container Access

```bash
# Test bypassing nginx entirely
curl 'http://103.69.84.133:4500/post/test?_rsc=1q0l6' -H 'rsc: 1'
```

### 4. Enable Nginx Debug Logging

```bash
# Add to nginx.conf for detailed debugging
error_log /var/log/nginx/error.log debug;
```

## Hypothesis

The issue is likely **NOT** nginx stripping parameters/headers, but rather:

1. **Multiple requests**: Next.js might be making separate internal requests
2. **Request transformation**: Docker networking or nginx might be normalizing headers
3. **Middleware timing**: RSC requests might be processed differently in production

## Resolution Strategy

1. Deploy enhanced middleware logging to see ALL requests
2. Compare request patterns between localhost and production
3. Check if RSC requests are being made but processed separately
4. Verify header case sensitivity and normalization
