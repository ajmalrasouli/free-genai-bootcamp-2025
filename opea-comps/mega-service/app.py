from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
import requests
from pydub import AudioSegment
import io

app = FastAPI()

class TTSRequest(BaseModel):
    text: str

TTS_API_URL = "http://tts-service:5002/tts"

@app.post("/tts")
async def generate_tts(request: TTSRequest):
    payload = {"text": request.text}
    try:
        response = requests.post(TTS_API_URL, json=payload)
        response.raise_for_status()

        # Add debug logging
        print(f"Response status: {response.status_code}")
        print(f"Response headers: {response.headers}")
        print(f"Content length: {len(response.content)}")

        return Response(
            content=response.content,
            media_type="audio/wav",
            headers={
                "Content-Disposition": "attachment; filename=speech.wav"
            }
        )
    except requests.exceptions.RequestException as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def text_to_speech(text, output_format='mp3'):
    # Call TTS service
    response = requests.post(
        'http://tts-service:5002/tts',
        json={'text': text}
    )

    if response.status_code == 200:
        # Convert WAV to MP3
        audio = AudioSegment.from_wav(io.BytesIO(response.content))

        # Export as MP3
        output = io.BytesIO()
        audio.export(output, format=output_format)
        return output.getvalue()
    else:
        raise Exception(f"TTS service error: {response.status_code}")
