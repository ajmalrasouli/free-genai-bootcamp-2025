# Stage 1: Build the React application
FROM node:21-alpine AS build

WORKDIR /app

# Declare build arguments
ARG VITE_API_URL

# Set environment variables from arguments for the build process
ENV VITE_API_URL=$VITE_API_URL

# Copy package files and install dependencies
# Use ci instead of install for potentially faster and cleaner installs in CI/CD
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the application
# This command should generate static files in the /app/dist directory
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the built static files from the build stage to the Nginx server directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
# This assumes you have an nginx.conf file in the client directory
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# Nginx will start automatically when the container launches
# No CMD needed as the base Nginx image handles it