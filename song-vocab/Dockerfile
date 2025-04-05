FROM python:3.10-slim

WORKDIR /app

# Install system dependencies and Python packages as root
COPY --chown=root:root requirements.txt ./
RUN apt-get update && apt-get install -y --no-install-recommends \
        sudo \
        libxml2-dev \
        libxslt1-dev \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
ARG USERNAME=appuser
ARG USER_UID=1000
ARG USER_GID=$USER_UID
# Ensure this RUN command is self-contained
RUN groupadd --gid $USER_GID $USERNAME && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

# Copy the rest of the project files (will be owned by root initially)
COPY . .

# Change ownership of the app directory
RUN chown -R $USERNAME:$USERNAME /app

# Switch to non-root user
USER $USERNAME

# Expose the port
EXPOSE 8006

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV HOST=0.0.0.0
ENV PORT=8006

# Command to run the application using Uvicorn directly
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8006"]