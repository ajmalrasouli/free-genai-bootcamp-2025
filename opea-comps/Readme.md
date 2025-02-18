# Text-to-Speech (TTS) Microservice

This project combines a Coqui TTS service with a FastAPI-based mega-service to provide text-to-speech conversion through a REST API.

## 🚀 Project Structure
```
opea-comps/
├── docker-compose.yml      # Docker compose configuration
├── models/                 # TTS model storage
├── mega-service/          # FastAPI service
│   ├── Dockerfile        # Docker configuration for mega-service
│   ├── app.py           # FastAPI application code
│   └── requirements.txt  # Python dependencies
└── README.md             # This file
```

## 🛠️ Prerequisites
- Docker and Docker Compose
- cURL (for testing)

## 🚀 Setup Instructions

### **1️⃣ Clone and Setup**
```bash
git clone <repository-url>
cd opea-comps
```

### **2️⃣ Start the Services**
Start both the TTS and mega-service using Docker Compose:
```bash
docker-compose up --build
```

This will start:
- Coqui TTS service on port 5005
- Mega-service on port 8000

### **3️⃣ Test the Services**

Test the TTS service directly:
```bash
curl -X POST -H "Content-Type: application/json" \
    -d '{"text":"Hello World!"}' \
    http://localhost:5005/tts > test.wav
```

Test through the mega-service:
```bash
curl -X POST -H "Content-Type: application/json" \
    -d '{"text":"Hello World!"}' \
    http://localhost:8000/tts --output test.wav
```

### **4️⃣ Stop the Services**
To stop all services:
```bash
docker-compose down
```

## 🔍 API Endpoints

### TTS Service (Port 5005)
- `POST /tts` - Convert text to speech
  - Body: `{"text": "Your text here"}`
  - Returns: WAV audio file

### Mega Service (Port 8000)
- `POST /tts` - Convert text to speech with additional processing
  - Body: `{"text": "Your text here"}`
  - Returns: WAV audio file with proper headers

## 📝 Notes
- The TTS service uses the Coqui AI CPU-based model
- Audio is returned in WAV format
- Both services are containerized and communicate over a Docker network
- Models are persisted in the `./models/` directory

## 🐛 Troubleshooting
- If the services fail to start, ensure ports 5005 and 8000 are available
- Check Docker logs with `docker-compose logs`
- Ensure Docker has sufficient memory (at least 2GB allocated)

Enjoy your AI-powered text-to-speech conversion! 🎙️
