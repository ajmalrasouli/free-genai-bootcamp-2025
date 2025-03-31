FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8003

# Start the server
CMD ["npm", "run", "dev"] 