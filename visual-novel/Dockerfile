FROM node:20

WORKDIR /app

# Install system dependencies as root
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json ./
# Explicitly remove potential stale lock file and node_modules
RUN rm -f package-lock.json
RUN rm -rf node_modules
RUN npm cache clean --force
# Use single install command (without howler)
RUN npm install --omit=dev

# --- Workaround: Try installing howler with --save-exact --- 
RUN npm install --save-exact --omit=dev howler@2.2.4
# --- End Workaround --- 

# Create a non-root user
ARG USERNAME=appuser
ARG USER_UID=1004
ARG USER_GID=1004
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

# Copy the rest of the project files (will be owned by root initially)
COPY . .

# Change ownership of the app directory
RUN chown -R $USERNAME:$USERNAME /app

# Switch to non-root user
USER $USERNAME

# Expose the port
EXPOSE 8007

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8007
ENV HOST=0.0.0.0

# Command to run the application using the package.json start script
CMD ["npm", "start"]