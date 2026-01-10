# Coolify Deployment Guide

This guide explains how to deploy the Faceless Success Hub to Coolify.

## Prerequisites

1. A Coolify instance running (self-hosted or cloud)
2. A GitHub repository with this code
3. Supabase project with database configured

## Deployment Steps

### 1. Connect Repository

1. In Coolify, create a new application
2. Connect your GitHub repository: `https://github.com/Kimnjuki/faceless`
3. Select the branch (usually `main`)

### 2. Configure Build Settings

Coolify will automatically detect the Dockerfile. Configure the following:

**Build Arguments** (required for Vite):
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Port**: `80` (default)

### 3. Environment Variables

Set these in Coolify's environment variables section:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: These variables are used at BUILD TIME by Vite, so they must be set as build arguments in Coolify.

### 4. Deploy

1. Click "Deploy" in Coolify
2. Wait for the build to complete
3. Your app will be available at the provided domain

## Build Configuration

The Dockerfile uses a multi-stage build:
1. **Builder stage**: Installs dependencies and builds the React app
2. **Production stage**: Serves the built app with nginx

## Nginx Configuration

The app includes a custom `nginx.conf` that:
- Handles React Router (SPA) routing
- Enables gzip compression
- Sets security headers
- Caches static assets

## Troubleshooting

### Build fails with "VITE_SUPABASE_URL is not defined"

Make sure you've set the build arguments in Coolify's build settings, not just environment variables.

### 404 errors on routes

This is normal for SPAs. The nginx configuration should handle this, but if you see 404s, verify that `nginx.conf` is being copied correctly.

### Environment variables not working

Remember: Vite embeds environment variables at BUILD TIME. If you change them, you need to rebuild the Docker image.

## Manual Docker Build (for testing)

```bash
# Build with environment variables
docker build \
  --build-arg VITE_SUPABASE_URL=your_url \
  --build-arg VITE_SUPABASE_ANON_KEY=your_key \
  -t faceless-app .

# Run locally
docker run -p 3000:80 faceless-app
```

## Health Checks

The docker-compose.yml includes a health check. Coolify will use this to monitor your application's health.

