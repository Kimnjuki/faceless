# Multi-stage build for React + Vite app
# Updated: 2026-02-10 - Fixed nginx redirect loop
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using npm install for flexibility with or without lockfile)
RUN npm install --frozen-lockfile || npm install

# Copy source code
COPY . .

# Build arguments for environment variables (Vite needs them at build time)
# Note: These are required at build time for Vite. For better security, use BuildKit secrets
# See docs/COOLIFY_CONVEX_DEPLOYMENT.md for setup instructions
ARG VITE_CONVEX_URL
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_GA_MEASUREMENT_ID
ARG VITE_GA4_MEASUREMENT_ID
ARG VITE_CLARITY_PROJECT_ID
ARG VITE_STRIPE_PUBLIC_KEY

# Set environment variables for build
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID
ENV VITE_GA4_MEASUREMENT_ID=$VITE_GA4_MEASUREMENT_ID
ENV VITE_CLARITY_PROJECT_ID=$VITE_CLARITY_PROJECT_ID
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY

# Build the application with pre-rendering for SEO
RUN npm run build:prerender || npm run build

# Note: Environment variables are baked into the build output (dist folder)
# They are not needed in the final nginx image, but they remain in the builder stage history
# For enhanced security, use Dockerfile.buildkit with BuildKit secrets

# Production stage with nginx
FROM nginx:alpine

# Install curl for health checks (required by Coolify)
RUN apk add --no-cache curl

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Coolify handles SSL/TLS termination externally)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

