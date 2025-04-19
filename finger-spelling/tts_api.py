from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from gtts import gTTS
import os
import logging
from pathlib import Path
from fastapi.responses import FileResponse

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('tts_api.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ASL Finger Spelling TTS API",
    description="API for Text-to-Speech conversion",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create audio directory if it doesn't exist
AUDIO_DIR = Path("audio")
AUDIO_DIR.mkdir(exist_ok=True)

@app.post("/tts")
async def text_to_speech(text: str, lang: str = "en"):
    """
    Convert text to speech and return the audio file path.
    
    Args:
        text (str): The text to convert to speech
        lang (str): The language code (default: "en")
    
    Returns:
        dict: Contains the audio file path
    """
    try:
        # Generate a unique filename
        filename = f"tts_{hash(text + lang)}.mp3"
        filepath = AUDIO_DIR / filename
        
        # Check if file already exists
        if not filepath.exists():
            # Create gTTS object
            tts = gTTS(text=text, lang=lang, slow=False)
            
            # Save the audio file
            tts.save(str(filepath))
            logger.info(f"Generated audio file: {filepath}")
        
        return {
            "audio_path": f"/audio/{filename}",
            "text": text,
            "language": lang
        }
    except Exception as e:
        logger.error(f"Error in text-to-speech conversion: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/audio/{filename}")
async def get_audio(filename: str):
    """
    Serve the audio file.
    
    Args:
        filename (str): The name of the audio file
    
    Returns:
        FileResponse: The audio file
    """
    filepath = AUDIO_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(str(filepath))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005) 