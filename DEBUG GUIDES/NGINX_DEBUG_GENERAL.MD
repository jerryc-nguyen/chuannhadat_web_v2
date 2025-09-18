# General Nginx Debugging Guide

## Docker Compose Setup Overview

Based on `docker-compose_v2_with_beta.yml`, your nginx setup includes:

- **nginx-proxy**: Main nginx container (nginx:1.26-alpine)
- **nginx-proxy-gen**: Auto-generates nginx configs from docker containers
- **nginx-proxy-acme**: Handles SSL certificates via Let's Encrypt
- **Multiple services**: chuannhadat.com (port 4500), beta.chuannhadat.com (port 4600), cnd_503 (port 4000)

## 🔍 Step-by-Step Debugging Process

### 1. Check Container Health & Status

```bash
# Check if all nginx-related containers are running
docker ps | grep nginx

# Check container logs for errors
docker logs nginx-proxy --tail=50
docker logs nginx-proxy-gen --tail=50
docker logs nginx-proxy-acme --tail=50

# Check specific service logs
docker logs chuannhadat_next --tail=50
docker logs chuannhadat_next_v3 --tail=50
```

**What to look for**:

- Container restart loops
- SSL certificate errors
- Configuration generation errors
- Port binding conflicts

### 2. Verify Network Connectivity

```bash
# Check docker networks
docker network ls
docker network inspect [network_name]

# Test internal connectivity
docker exec nginx-proxy ping chuannhadat_next
docker exec nginx-proxy ping chuannhadat_next_v3

# Check port accessibility
docker exec nginx-proxy netstat -tlnp
```

**What to look for**:

- Network isolation issues
- Port conflicts
- Service discovery problems

### 3. Examine Nginx Configuration

```bash
# View generated nginx configuration
docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf

# Check nginx configuration syntax
docker exec nginx-proxy nginx -t

# View custom http configuration
docker exec nginx-proxy cat /etc/nginx/conf.d/http.conf

# Check nginx main configuration
docker exec nginx-proxy cat /etc/nginx/nginx.conf
```

**What to look for**:

- Syntax errors
- Missing upstream definitions
- Incorrect proxy_pass directives
- SSL configuration issues

### 4. Analyze Service-Specific Configuration

```bash
# Check domain-specific configurations
docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf | grep -A 20 -B 5 'chuannhadat.com'
docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf | grep -A 20 -B 5 'beta.chuannhadat.com'

# Verify upstream definitions
docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf | grep -A 10 'upstream'

# Check SSL certificate status
docker exec nginx-proxy ls -la /etc/nginx/certs/ | grep chuannhadat
```

**What to look for**:

- Correct upstream server definitions
- SSL certificate presence and validity
- Virtual host configurations
- Port mappings

### 5. Monitor Real-Time Requests

```bash
# Monitor nginx access logs
docker exec nginx-proxy tail -f /var/log/nginx/access.log

# Monitor nginx error logs
docker exec nginx-proxy tail -f /var/log/nginx/error.log

# Monitor specific service logs simultaneously
docker logs chuannhadat_next --tail=0 -f &
docker logs nginx-proxy --tail=0 -f
```

**What to look for**:

- HTTP status codes (200, 404, 500, 502, 503)
- Request patterns and timing
- Error messages and stack traces
- SSL handshake issues

### 6. Test Direct Service Access

```bash
# Test bypassing nginx (direct container access)
curl -I http://localhost:4500/  # chuannhadat_next
curl -I http://localhost:4600/  # chuannhadat_next_v3
curl -I http://localhost:4000/  # cnd_503

# Test through nginx
curl -I http://localhost/
curl -I https://chuannhadat.com/
curl -I https://beta.chuannhadat.com/
```

**What to look for**:

- Service availability without proxy
- Proxy vs direct access differences
- SSL certificate issues
- Response header differences

### 7. Debug Template Generation

```bash
# Check docker-gen template
docker exec nginx-proxy-gen cat /etc/docker-gen/templates/nginx.tmpl | head -50

# View docker-gen logs
docker logs nginx-proxy-gen --tail=50

# Manually trigger config regeneration
docker exec nginx-proxy-gen docker-gen /etc/docker-gen/templates/nginx.tmpl /etc/nginx/conf.d/default.conf

# Check if config was updated
docker exec nginx-proxy-gen ls -la /etc/nginx/conf.d/default.conf
```

**What to look for**:

- Template syntax errors
- Variable substitution issues
- Config generation timing
- File permissions

### 8. SSL/TLS Debugging

```bash
# Check SSL certificate details
docker exec nginx-proxy openssl x509 -in /etc/nginx/certs/chuannhadat.com.crt -text -noout

# Test SSL handshake
openssl s_client -connect chuannhadat.com:443 -servername chuannhadat.com

# Check Let's Encrypt logs
docker logs nginx-proxy-acme --tail=50

# Verify certificate chain
docker exec nginx-proxy ls -la /etc/nginx/certs/ | grep chuannhadat
```

**What to look for**:

- Certificate expiration dates
- Certificate chain completeness
- SSL protocol versions
- Cipher suite compatibility

### 9. Performance & Resource Debugging

```bash
# Check nginx worker processes
docker exec nginx-proxy ps aux | grep nginx

# Monitor resource usage
docker stats nginx-proxy nginx-proxy-gen nginx-proxy-acme

# Check nginx configuration limits
docker exec nginx-proxy cat /etc/nginx/nginx.conf | grep -E 'worker_processes|worker_connections|client_max_body_size'

# Test concurrent connections
ab -n 100 -c 10 https://chuannhadat.com/
```

**What to look for**:

- Memory/CPU usage spikes
- Worker process crashes
- Connection limits
- Response time degradation

### 10. Environment-Specific Debugging

```bash
# Check environment variables
docker exec chuannhadat_next env | grep -E 'VIRTUAL_|LETSENCRYPT_|NODE_ENV'
docker exec chuannhadat_next_v3 env | grep -E 'VIRTUAL_|LETSENCRYPT_|NODE_ENV'

# Verify service discovery
docker exec nginx-proxy-gen docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

# Check volume mounts
docker exec nginx-proxy ls -la /etc/nginx/vhost.d/
docker exec nginx-proxy ls -la /etc/nginx/conf.d/
```

**What to look for**:

- Incorrect environment variables
- Missing service labels
- Volume mount issues
- File permissions

## 🚨 Common Issues & Quick Fixes

### Issue 1: 502 Bad Gateway

**Symptoms**: nginx returns 502 error
**Debug Steps**:

```bash
# Check if backend service is running
docker ps | grep chuannhadat_next
# Check backend service logs
docker logs chuannhadat_next --tail=20
# Verify upstream configuration
docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf | grep -A 5 'upstream chuannhadat.com'
```

### Issue 2: SSL Certificate Issues

**Symptoms**: SSL warnings, certificate errors
**Debug Steps**:

```bash
# Check certificate status
docker logs nginx-proxy-acme --tail=50
# Verify certificate files
docker exec nginx-proxy ls -la /etc/nginx/certs/ | grep chuannhadat
# Test SSL configuration
openssl s_client -connect chuannhadat.com:443
```

### Issue 3: Configuration Not Updating

**Symptoms**: Changes not reflected in nginx
**Debug Steps**:

```bash
# Check docker-gen is running
docker ps | grep nginx-proxy-gen
# Manually regenerate config
docker restart nginx-proxy-gen
# Reload nginx
docker exec nginx-proxy nginx -s reload
```

### Issue 4: Service Discovery Issues

**Symptoms**: nginx can't find backend services
**Debug Steps**:

```bash
# Check service labels
docker inspect chuannhadat_next | grep -A 10 '"Labels"'
# Verify network connectivity
docker exec nginx-proxy ping chuannhadat_next
# Check docker-gen template processing
docker logs nginx-proxy-gen --tail=20
```

## 📋 Debugging Checklist

- [ ] All containers running and healthy
- [ ] Network connectivity between containers
- [ ] Nginx configuration syntax valid
- [ ] Upstream services accessible
- [ ] SSL certificates present and valid
- [ ] Environment variables correctly set
- [ ] Service discovery working
- [ ] Logs showing expected behavior
- [ ] Direct service access working
- [ ] Proxy access working

## 🔧 Useful Commands Reference

```bash
# Quick health check
docker ps && docker exec nginx-proxy nginx -t

# Full log monitoring
docker logs nginx-proxy -f &
docker logs nginx-proxy-gen -f &
docker logs chuannhadat_next -f

# Configuration reload
docker exec nginx-proxy nginx -s reload

# Emergency restart
docker restart nginx-proxy nginx-proxy-gen

# Clean certificate renewal
docker restart nginx-proxy-acme
```
