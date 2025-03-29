FROM node:18-slim

WORKDIR /app

# Install Express.js
RUN npm install express

# Copy project files
COPY . .

# Expose the port
EXPOSE 8007

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8007
ENV HOST=0.0.0.0

# Command to run the application
CMD ["node", "server.js"] 