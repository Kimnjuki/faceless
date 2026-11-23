# Multi-stage build for React + Vite app (Coolify / nginx)
# Updated: 2026-11-23 — Coolify must run build:seo (vite + Convex prerender), NOT build:quick alone.
# react-snap/Chromium removed from the default path: scripts/prerender-routes.mjs emits
# per-route HTML with unique head + crawlable body without Puppeteer.
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Skip optional Puppeteer Chromium download (not needed for build:seo)
ENV PUPPETEER_SKIP_DOWNLOAD=1
RUN npm install --frozen-lockfile || npm install

COPY . .

ARG VITE_CONVEX_URL
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_GA_MEASUREMENT_ID
ARG VITE_GA4_MEASUREMENT_ID
ARG VITE_CLARITY_PROJECT_ID
ARG VITE_STRIPE_PUBLIC_KEY
ARG VITE_NVIDIA_API_KEY

ENV VITE_CONVEX_URL=$VITE_CONVEX_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID
ENV VITE_GA4_MEASUREMENT_ID=$VITE_GA4_MEASUREMENT_ID
ENV VITE_CLARITY_PROJECT_ID=$VITE_CLARITY_PROJECT_ID
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY
ENV VITE_NVIDIA_API_KEY=$VITE_NVIDIA_API_KEY

# Raise Node heap for vite transform in constrained Coolify builders.
ENV NODE_OPTIONS=--max-old-space-size=3072

# Vite build + Convex-backed per-route HTML (titles, canonicals, hub/article bodies).
# Requires VITE_CONVEX_URL at build time so prerender can fetch published content.
RUN npm run build:seo

FROM nginx:alpine

RUN apk add --no-cache curl

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Path-level 301 redirects (generated from redirects.config.json; always present)
COPY nginx-redirects.conf /etc/nginx/redirects.inc

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
