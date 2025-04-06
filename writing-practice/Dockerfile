FROM python:3.10-slim

WORKDIR /app

# Install system dependencies and Python packages as root
COPY requirements.txt ./
RUN set -e && \
    apt-get update && apt-get install -y --no-install-recommends \
        # Add Tesseract OCR and Farsi language pack
        tesseract-ocr \
        tesseract-ocr-fas \
        # Keep existing dependencies if needed, otherwise remove
        # libxml2-dev \
        # libxslt1-dev \ 
    && pip install --no-cache-dir -v -r requirements.txt \
    # Verify installation
    && echo "Checking installed packages:" \
    && pip list \
    && echo "Attempting to import openai in build..." \
    && python -c "import openai; print('OpenAI imported successfully during build!')" \
    # Cleanup
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
ARG USERNAME=appuser
ARG USER_UID=1000
ARG USER_GID=1002
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

# Copy the rest of the project files (will be owned by root initially)
COPY . .

# Change ownership of the app directory
RUN chown -R $USERNAME:$USERNAME /app

# Switch to non-root user
USER $USERNAME

# Expose the port
EXPOSE 8008

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV HOST=0.0.0.0
ENV PORT=8008

# Command to run the Gradio application
CMD ["python", "gradio_app.py"]