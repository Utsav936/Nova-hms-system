# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDeps for build if needed)
RUN npm install

# Stage 2: Final Production Image
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Ensure health check script or other necessary files are executable
# RUN chmod +x scripts/*.sh

# Expose the port (Cloud Run will override this with $PORT)
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "src/server.js"]
