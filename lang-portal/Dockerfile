FROM node:18-slim

# Create a non-root user
ARG USERNAME=appuser
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Create the user
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        sudo \
    && rm -rf /var/lib/apt/lists/* \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Create working directory and set permissions
WORKDIR /app
RUN chown -R $USERNAME:$USERNAME /app

# Switch to non-root user
USER $USERNAME

# Install bash and other dependencies
RUN apk add --no-cache bash

# Copy package files
COPY --chown=$USERNAME:$USERNAME package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application
COPY --chown=$USERNAME:$USERNAME . .

# Make the startup script executable
RUN chmod +x startup.sh

# Install dependencies for client and server
RUN cd client && npm install --quiet
RUN cd server && npm install --quiet

# Create database directory
RUN mkdir -p server

# Seed the database
RUN cd server && npm install && node seed.js

# Expose the port
EXPOSE 8003

# Run the startup script
CMD ["./startup.sh"]