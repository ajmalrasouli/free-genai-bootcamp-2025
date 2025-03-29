FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for Hazm
RUN apt-get update && apt-get install -y \
    libxml2-dev \
    libxslt1-dev \
    iputils-ping \
    net-tools \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Copy project files first
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt flask gunicorn
RUN pip install -e .

# Expose the port the app runs on
EXPOSE 8001

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV FLASK_APP=web_server.py
ENV FLASK_DEBUG=1

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Container started"\n\
echo "Network interfaces:"\n\
ip addr\n\
echo "Python path:"\n\
python -c "import sys; print(sys.path)"\n\
echo "Installed packages:"\n\
pip list\n\
echo "Starting web server..."\n\
python web_server.py\n\
' > /app/start.sh && chmod +x /app/start.sh

# Command to run the application with debug logging
CMD ["/app/start.sh"] 