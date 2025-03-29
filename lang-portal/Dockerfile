FROM node:18-slim

WORKDIR /app

# Install necessary packages
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json files
COPY darimasterlan/server/package*.json ./server/
COPY darimasterlan/client/package*.json ./client/

# Install dependencies
RUN cd server && npm install
RUN cd client && npm install

# Copy source files
COPY darimasterlan/server ./server/
COPY darimasterlan/client ./client/

# Try to build the client
RUN cd client && npm run build || echo "Client build failed"

# Make sure the public directory exists in server directory
RUN mkdir -p server/public

# Copy client build if successful
RUN if [ -d "client/dist" ]; then \
    cp -r client/dist/* server/public/; \
fi

# Expose the port
EXPOSE 8003

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8003

# Start the server
CMD ["node", "server/index.js"] 