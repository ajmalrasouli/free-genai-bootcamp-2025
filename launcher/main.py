from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi import Request
import os
import subprocess
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="GenAI Learning Platform Launcher")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Project configurations
PROJECTS = {
    "fa-mud": {
        "name": "Farsi Text Adventure MUD Game",
        "port": 8001,
        "image": "genai-fa-mud",
        "build_context": "../fa-mud",
        "category": "gaming"
    },
    "asl-fingerspelling": {
        "name": "ASL Finger Spelling Application",
        "port": 8002,
        "image": "genai-asl-fingerspelling",
        "build_context": "../asl-fingerspelling",
        "category": "language"
    },
    "lang-portal": {
        "name": "Language Learning Portal",
        "port": 8003,
        "image": "genai-lang-portal",
        "build_context": "../lang-portal",
        "category": "language"
    },
    "listening-comp": {
        "name": "Persian Learning Assistant",
        "port": 8004,
        "image": "genai-listening-comp",
        "build_context": "../listening-comp",
        "category": "language"
    },
    "opea-comps": {
        "name": "Text-to-Speech Microservice",
        "port": 8005,
        "image": "genai-opea-comps",
        "build_context": "../opea-comps",
        "category": "tools"
    },
    "song-vocab": {
        "name": "Farsi Song Vocabulary Generator",
        "port": 8006,
        "image": "genai-song-vocab",
        "build_context": "../song-vocab",
        "category": "language"
    },
    "visual-novel": {
        "name": "Farsi Learning Visual Novel",
        "port": 8007,
        "image": "genai-visual-novel",
        "build_context": "../visual-novel",
        "category": "gaming"
    },
    "writing-practice": {
        "name": "Farsi Writing Practice App",
        "port": 8008,
        "image": "genai-writing-practice",
        "build_context": "../writing-practice",
        "category": "language"
    }
}

class DockerManager:
    def __init__(self):
        self.running_containers = {}
        
    def build_and_run_all(self):
        """Build and run all containers using docker-compose"""
        logger.info("Building and running all containers")
        
        # First stop any existing containers
        result = subprocess.run(
            ["docker-compose", "down"],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True,
            text=True
        )
        
        # Then build and run all containers
        result = subprocess.run(
            ["docker-compose", "up", "--build", "-d"],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            logger.error(f"Error running docker-compose: {result.stderr}")
            raise Exception(f"Failed to run docker-compose: {result.stderr}")
            
    def stop_all(self):
        """Stop all containers"""
        logger.info("Stopping all containers")
        
        result = subprocess.run(
            ["docker-compose", "down"],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            logger.error(f"Error stopping containers: {result.stderr}")
            raise Exception(f"Failed to stop containers: {result.stderr}")

docker_manager = DockerManager()

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "projects": PROJECTS})

@app.post("/start-all")
async def start_all():
    try:
        docker_manager.build_and_run_all()
        return {"message": "All containers started successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stop-all")
async def stop_all():
    try:
        docker_manager.stop_all()
        return {"message": "All containers stopped successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/start/{project_id}")
async def start_project(project_id: str):
    if project_id not in PROJECTS:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        # First stop any existing container for this project
        result = subprocess.run(
            ["docker-compose", "stop", project_id],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True,
            text=True
        )
        
        # Then build and run the specific project
        result = subprocess.run(
            ["docker-compose", "up", "--build", "-d", project_id],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            raise Exception(f"Failed to start {project_id}: {result.stderr}")
            
        return {"status": "success", "message": f"Project {project_id} started"}
    except Exception as e:
        logger.error(f"Error starting {project_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stop/{project_id}")
async def stop_project(project_id: str):
    if project_id not in PROJECTS:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        # Stop the specific project using docker-compose
        result = subprocess.run(
            ["docker-compose", "stop", project_id],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            raise Exception(f"Failed to stop {project_id}: {result.stderr}")
            
        return {"status": "success", "message": f"Project {project_id} stopped"}
    except Exception as e:
        logger.error(f"Error stopping {project_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    try:
        print("Starting server on http://127.0.0.1:3000")
        uvicorn.run(app, host="0.0.0.0", port=3000)
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        raise