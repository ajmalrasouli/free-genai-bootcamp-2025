from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
import io
import logging
from typing import Optional
from gtts import gTTS

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Mega Service",
    description="Service for handling TTS requests",
    version="1.0.0"
)

class TTSRequest(BaseModel):
    text: str
    format: Optional[str] = "mp3"

@app.post("/tts")
async def generate_tts(request: TTSRequest):
    try:
        logger.info(f"Received TTS request for text: {request.text[:50]}...")
        
        # Create gTTS object
        tts = gTTS(text=request.text, lang='en', slow=False)
        
        # Generate audio in memory
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        # Return the audio file
        return Response(
            content=audio_buffer.getvalue(),
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": f"attachment; filename=speech.{request.format}"
            }
        )
    except Exception as e:
        logger.error(f"Error generating TTS: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating speech: {str(e)}"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

def text_to_speech(text, output_format='mp3'):
    try:
        # Create gTTS object
        tts = gTTS(text=text, lang='en', slow=False)
        
        # Generate audio in memory
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        return audio_buffer.getvalue()
    except Exception as e:
        logger.error(f"Error in text_to_speech: {str(e)}")
        raise Exception(f"Error generating speech: {str(e)}")
