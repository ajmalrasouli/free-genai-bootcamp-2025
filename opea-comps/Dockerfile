FROM python:3.10-slim

WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN cd mega-service && pip install --no-cache-dir -r requirements.txt

# Expose the port
EXPOSE 8005

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV HOST=0.0.0.0
ENV PORT=8005

# Command to run the application
CMD ["python", "mega-service/app.py"] 