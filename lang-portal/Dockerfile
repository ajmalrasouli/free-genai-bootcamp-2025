FROM node:18-slim

WORKDIR /app

# Install necessary packages
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json files
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN cd server && npm install
RUN cd client && npm install

# Copy source files
COPY server ./server/
COPY client ./client/

# Build TypeScript files
RUN cd server && npm run build
RUN cd client && npm run build

# Make sure the public directory exists in server directory
RUN mkdir -p server/public

# Copy client build to server public directory
RUN cp -r client/dist/* server/public/

# Expose the port
EXPOSE 8003

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8003

# Start the server using tsx for TypeScript support
CMD ["npx", "tsx", "server/simple-server.ts"] 