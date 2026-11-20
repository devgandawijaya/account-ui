# ==========================================
# Stage 1: Build static assets
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:8085
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Enable corepack with exact pinned pnpm version for instant setup
RUN corepack enable && corepack prepare pnpm@11.11.0 --activate

# Copy dependency specifications including lockfile for instant deterministic install
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./

# Install dependencies strictly from lockfile (fast & cached)
RUN pnpm install --frozen-lockfile

# Copy source code and configurations
COPY . .

# Compile TypeScript and build optimized production bundle
RUN pnpm run build

# ==========================================
# Stage 2: Serve via Nginx Alpine (Ultra Lightweight)
# ==========================================
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx SPA routing configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
