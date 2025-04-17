FROM node:21-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy the rest of the application
COPY dist ./dist
COPY seed.js .
COPY database.sqlite .

# Expose the port
EXPOSE 8003

# Start the server
CMD ["node", "dist/index.js"] 