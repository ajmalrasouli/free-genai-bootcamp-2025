# Text-to-Speech (TTS) Microservice

This project runs a Coqui TTS microservice in a Docker container and exposes an API for text-to-speech conversion.

## 🚀 Setup Instructions

### **1️⃣ Install Dependencies**
Ensure you have Python installed, then install the required dependencies:
```bash
pip install -r requirements.txt
```

### **2️⃣ Run the TTS Microservice**
Start the TTS microservice using Docker Compose:
```bash
docker-compose up -d
```

Alternatively, if running locally:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

### **3️⃣ Test the API**
Use `curl` to send a text input and receive a generated speech file:
```bash
curl -X POST "http://localhost:8000/tts" \
     -H "Content-Type: application/json" \
     -d '{"text": "Hello, world!"}' \
     --output output.wav
```

### **4️⃣ Stop the Service**
To stop the Docker container:
```bash
docker-compose down
```

## 🎯 Notes
- The TTS API is exposed at `http://localhost:8000/tts`
- The Coqui TTS model is stored in `./models/`

Enjoy your AI-powered text-to-speech conversion! 🎙️