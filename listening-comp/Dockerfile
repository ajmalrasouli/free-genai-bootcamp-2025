FROM python:3.10-slim

# Install system dependencies as root
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user with unique UID and GID
ARG USERNAME=appuser
ARG USER_UID=1005  # Changed from 1000 to 1005
ARG USER_GID=1005  # Changed from 1000 to 1005

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

# Copy requirements first
COPY --chown=$USERNAME:$USERNAME requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project files
COPY --chown=$USERNAME:$USERNAME . .

# Fix permissions after copy
USER root
RUN chown -R $USERNAME:$USERNAME /app
USER $USERNAME

# Expose the port
EXPOSE 8004

# Command to run the streamlit application
CMD ["streamlit", "run", "frontend/main.py", "--server.port", "8004", "--server.address", "0.0.0.0"]