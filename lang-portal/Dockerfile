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
ARG USER_UID=1001  # Changed from 1000 to 1001
ARG USER_GID=1001  # Changed from 1000 to 1001

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

# Copy project files
COPY --chown=$USERNAME:$USERNAME . .

# Install dependencies
RUN npm install

# Expose the port
EXPOSE 8003

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8003

# Command to run the application
CMD ["npm", "start"]