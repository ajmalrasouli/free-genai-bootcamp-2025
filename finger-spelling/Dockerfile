FROM python:3.10-slim

# Create a non-root user
ARG USERNAME=appuser
ARG USER_UID=1000
ARG USER_GID=1000
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

WORKDIR /app

# Install system dependencies
# Keep these running as root before switching user
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    iproute2 \
    iputils-ping \
    net-tools \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first and install as root, in case they need root access
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code and change ownership
COPY . .
RUN chown -R $USERNAME:$USERNAME /app

# Switch to non-root user
USER $USERNAME

# Expose the port the app runs on
EXPOSE 8002

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV HOST=0.0.0.0
ENV PORT=8002

# Create a startup script
RUN echo '#!/bin/bash\n\
echo "Starting ASL Finger Spelling application"\n\
echo "Python version: $(python --version)"\n\
echo "Installed packages:"\n\
pip list\n\
echo "Network interfaces:"\n\
ip addr\n\
echo "Starting application..."\n\
python app.py 2>&1 | tee /app/app.log\n\
' > /app/start.sh && chmod +x /app/start.sh

# Command to run the application
CMD ["/app/start.sh"] 