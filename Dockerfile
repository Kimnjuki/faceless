# Multi-stage build for React + Vite app
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
# See COOLIFY.md for BuildKit secrets setup instructions
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set environment variables for build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build the application
RUN npm run build

# Note: Environment variables are baked into the build output (dist folder)
# They are not needed in the final nginx image, but they remain in the builder stage history
# For enhanced security, use Dockerfile.buildkit with BuildKit secrets

# Production stage with nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

