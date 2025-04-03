FROM node:18-slim

# Install system dependencies as root
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user with unique UID and GID
ARG USERNAME=appuser
ARG USER_UID=1004  # Changed from 1000 to 1004
ARG USER_GID=1004  # Changed from 1000 to 1004

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

# Install Express.js
RUN npm install express

# Copy project files
COPY --chown=$USERNAME:$USERNAME . .

# Expose the port
EXPOSE 8007

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8007
ENV HOST=0.0.0.0

# Command to run the application
CMD ["node", "server.js"]