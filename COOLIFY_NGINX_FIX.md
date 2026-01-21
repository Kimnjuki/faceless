# Coolify Nginx Configuration Fix

## ✅ Issues Fixed

### 1. SSL Configuration Error ✅
- **Issue**: Nginx was trying to listen on port 443 with SSL, but Coolify handles SSL externally
- **Error**: `nginx: [emerg] no "ssl_certificate" is defined for the "listen ... ssl" directive`
- **Fix**: Removed SSL configuration, container now only listens on port 80
- **Location**: `nginx.conf`

### 2. Missing Health Check Tool ✅
- **Issue**: Coolify couldn't perform health checks because `curl` was missing
- **Error**: `The healthcheck needs a curl or wget command to check the health...`
- **Fix**: Added `RUN apk add --no-cache curl` to Dockerfile
- **Location**: `Dockerfile`

## 🔧 Changes Made

### nginx.conf
- Removed SSL listener (port 443)
- Removed SSL certificate configuration
- Removed HTTP to HTTPS redirects (Coolify handles this)
- Kept security headers (Coolify will add these via proxy)
- Kept performance optimizations (gzip, caching)
- Added `/health` endpoint for health checks
- Changed `server_name` to `_` to accept any hostname (Coolify handles routing)

### Dockerfile
- Added `RUN apk add --no-cache curl` in the nginx stage
- This allows Coolify to perform health checks

## 📋 How Coolify Works

1. **SSL/TLS Termination**: Coolify's built-in proxy handles SSL certificates and HTTPS
2. **HTTP Only**: Your container only needs to serve HTTP on port 80
3. **Routing**: Coolify routes traffic to your container based on domain configuration
4. **Health Checks**: Coolify uses curl to check if your container is healthy

## 🚀 Deployment

After these changes:
1. Commit and push to GitHub
2. Coolify will automatically rebuild
3. Container should start successfully
4. Health checks should pass

## ✅ Expected Results

- ✅ Nginx starts without SSL errors
- ✅ Container listens only on port 80
- ✅ Health checks work with curl
- ✅ Application serves correctly
- ✅ Coolify handles SSL/TLS externally

## 🔍 Verification

After deployment, check:
1. Container logs show nginx starting successfully
2. Health check endpoint responds: `curl http://your-container/health`
3. Application is accessible via Coolify's domain
4. SSL works (handled by Coolify proxy)


