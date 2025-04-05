FROM python:3.10-slim

WORKDIR /app

# Copy requirements first
COPY mega-service/requirements.txt ./mega-service/

# Install dependencies system-wide as root
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && \
    pip install --no-cache-dir -r ./mega-service/requirements.txt && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user
ARG USERNAME=appuser
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Create the user (no need for sudo install anymore)
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

# Copy the rest of the project files
# Note: Ownership will be root initially
COPY . .

# Change ownership of the app directory to the non-root user
RUN chown -R $USERNAME:$USERNAME /app

# Switch to non-root user
USER $USERNAME

# Expose the port
EXPOSE 8005

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV HOST=0.0.0.0
ENV PORT=8005

# Command to run the application using Uvicorn directly from within the service directory
CMD ["sh", "-c", "cd /app/mega-service && uvicorn app:app --host 0.0.0.0 --port 8005"]