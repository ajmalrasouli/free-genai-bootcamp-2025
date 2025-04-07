FROM python:3.10-slim

# Build arguments (USERNAME/UID/GID no longer needed for root)
ARG DOCKER_GID=999 # Keep for potential group matching if needed, though less critical for root

# Install dependencies & Docker CLI as root
RUN apt-get update \
    # Install essential packages
    && apt-get install -y --no-install-recommends \
        sudo \
        curl \
        ca-certificates \
    # Download and run the Docker install script
    && echo "Downloading and installing Docker CLI using get.docker.com..." \
    && curl -fsSL https://get.docker.com -o get-docker.sh \
    && sh get-docker.sh \
    # Install Docker Compose Plugin separately (if needed) ...
    && if ! docker compose version; then \
        echo "Installing Docker Compose plugin via apt..."; \
        apt-get update && apt-get install -y --no-install-recommends docker-compose-plugin; \
       fi \
    # Verify installation path
    && echo "Checking docker path:" && which docker \
    && echo "Checking docker compose version:" && docker compose version \
    # Clean up
    && rm get-docker.sh \
    && rm -rf /var/lib/apt/lists/*

# Create working directory (will be owned by root)
WORKDIR /app

# Copy project files (will be owned by root)
COPY . .

# Install dependencies
# Run pip as root
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port
EXPOSE 3000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV HOST=0.0.0.0
ENV PORT=3000

# Command to run the application (will run as root)
CMD ["python", "main.py"]
