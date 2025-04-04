FROM python:3.10-slim

# Install system dependencies as root
RUN apt-get update && apt-get install -y \
    libxml2-dev \
    libxslt1-dev \
    iproute2 \
    net-tools \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user with a unique GID
ARG USERNAME=appuser
ARG USER_UID=1000
ARG USER_GID=1003  # Changed from 1000 to 1003

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

# Copy dependency definition files first
COPY --chown=$USERNAME:$USERNAME requirements.txt setup.py ./

# Install dependencies
# Combine flask and gunicorn with requirements install
RUN pip install --no-cache-dir -r requirements.txt flask gunicorn
RUN pip install --no-cache-dir .  # Install the project itself (non-editable)

# Copy the rest of the project files
COPY --chown=$USERNAME:$USERNAME . .

# Expose the port the app runs on
EXPOSE 8001

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV FLASK_APP=web_server.py
ENV FLASK_DEBUG=0

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Container started"\n\
echo "Network interfaces:"\n\
ip addr show\n\
echo "Python path:"\n\
python -c "import sys; print(sys.path)"\n\
echo "Installed packages:"\n\
pip list\n\
echo "Starting web server..."\n\
python -m gunicorn --bind 0.0.0.0:8001 --workers 4 --timeout 120 --log-level debug --preload web_server:app\n\
' > /app/start.sh && chmod +x /app/start.sh

# Command to run the application with gunicorn
CMD ["/app/start.sh"]
