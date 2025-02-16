from fastapi import FastAPI, HTTPException
import requests

app = FastAPI()

TTS_API_URL = "http://localhost:5002/api/tts"

@app.post("/tts")
async def generate_tts(text: str):
    payload = {"text": text, "speaker_id": "default"}
    try:
        response = requests.post(TTS_API_URL, json=payload)
        response.raise_for_status()
        return response.content
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
