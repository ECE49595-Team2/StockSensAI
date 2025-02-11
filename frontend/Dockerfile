# Use Node.js Alpine as base image
FROM node:18-alpine

# Install PNPM globally
RUN npm install -g pnpm

# Set working directory inside the container
WORKDIR /app

# Ensure required dependencies are available for Next.js
RUN apk add --no-cache libc6-compat

# Copy package.json and pnpm-lock.yaml first for better caching
COPY package.json ./

# Generate pnpm-lock.yaml inside the container if missing
RUN [ -f pnpm-lock.yaml ] || pnpm install --lockfile-only

# Install dependencies using PNPM
RUN pnpm install --store-dir .pnpm-store

# Copy the rest of the application
COPY . .

# Set correct ownership for non-root user
RUN chown -R node:node /app

# Expose Next.js port
EXPOSE 3000

# Switch to a non-root user for security
USER node

# Start Next.js in development mode
CMD ["pnpm", "run", "dev"]

