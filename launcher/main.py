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

# Check for static directory existence
static_dir = Path("static")
if not static_dir.is_dir():
    logger.warning(f"Static directory '{static_dir}' not found. Creating it.")
    static_dir.mkdir(parents=True, exist_ok=True) # Create if it doesn't exist

# Mount static files
app.mount("/static", StaticFiles(directory=static_dir), name="static")

templates_dir = Path("templates")
if not templates_dir.is_dir():
     # If templates are essential, maybe raise an error or log critical
    logger.error(f"Templates directory '{templates_dir}' not found! UI may not work.")
    # Or create it if it's acceptable for it to be empty initially
    # templates_dir.mkdir(parents=True, exist_ok=True)
templates = Jinja2Templates(directory=templates_dir)

# Project configurations (Keep this)
PROJECTS = { # Ensure this matches service names in docker-compose.yml
    "fa-mud": {
        "name": "Farsi Text Adventure MUD Game",
        "port": 8001,
        "category": "gaming",
        "icon": "fa-dungeon",
        "color": "orange",
        "description": "Immersive text-based adventure game for practicing Farsi.",
        "external_url": "http://localhost:8001"
    },
    "finger-spelling": {
        "name": "ASL Finger Spelling App",
        "port": 8002,
        "category": "language",
        "icon": "fa-american-sign-language-interpreting",
        "color": "green",
        "description": "Interactive tool for learning ASL finger spelling.",
        "external_url": "http://localhost:8002"
    },
    "lang-portal": {
        "name": "Language Learning Portal",
        "port": 8009,
        "category": "language",
        "icon": "fa-language",
        "color": "indigo",
        "description": "Centralized platform for accessing language resources.",
        "external_url": "http://localhost:8009"
    },
    "listening-comp": {
        "name": "Persian Learning Assistant",
        "port": 8004,
        "category": "language",
        "icon": "fa-headphones-alt",
        "color": "blue",
        "description": "Interactive listening comprehension system for Persian.",
        "external_url": "http://localhost:8004"
    },
    "opea-comps": {
        "name": "Text-to-Speech Microservice",
        "port": 8005,
        "category": "tools",
        "icon": "fa-microphone",
        "color": "indigo",
        "description": "Microservice for converting text to speech.",
        "external_url": "http://localhost:8005/docs"
    },
    "song-vocab": {
        "name": "Farsi Song Vocabulary",
        "port": 8006,
        "category": "language",
        "icon": "fa-music",
        "color": "purple",
        "description": "Generate vocabulary lists from Farsi songs.",
        "external_url": "http://localhost:8006/docs"
    },
    "visual-novel": {
        "name": "Farsi Visual Novel",
        "port": 8007,
        "category": "gaming",
        "icon": "fa-book-reader",
        "color": "pink",
        "description": "Interactive visual novel for immersive Farsi learning.",
        "external_url": "http://localhost:8007"
    },
    "writing-practice": {
        "name": "Farsi Writing Practice App",
        "port": 8008,
        "category": "language",
        "icon": "fa-pencil-alt",
        "color": "green",
        "description": "Interactive writing practice application for Farsi.",
        "external_url": "http://localhost:8008"
    }
    # Add tts-service details if it should be shown
    # "tts-service": {
    #     "name": "TTS Microservice (Coqui)",
    #     "port": 5005,
    #     "category": "tools",
    #     "icon": "fa-bullhorn",
    #     "color": "gray",
    #     "description": "Backend text-to-speech engine.",
    #     "external_url": "http://localhost:5005" # May not have a UI
    # }
}

# Removed DockerManager class

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    # Check container status and add it to the projects data
    container_status = {}
    compose_file = "/app/docker-compose.yml"
    project_dir = "/app"
    try:
        # Use 'docker compose' to get running services
        cmd = [
            "docker", "compose",
            "-f", compose_file,
            "--project-directory", project_dir,
            "ps", "--services", "--filter", "status=running"
        ]
        logger.info(f"Checking running services using command: {' '.join(cmd)}")
        result = subprocess.run(
            cmd,
            cwd=project_dir,
            capture_output=True,
            text=True,
            check=False # Don't raise error if command fails, just log
        )

        if result.returncode != 0:
            logger.error(f"Error checking container status: {result.stderr}")
            # Default to all containers not running if command fails
            container_status = {project_id: False for project_id in PROJECTS}
        else:
            running_services = result.stdout.strip().split('\n')
            running_services = {s for s in running_services if s} # Use a set for faster lookup
            logger.info(f"Running services detected: {running_services}")
            for project_id in PROJECTS:
                container_status[project_id] = project_id in running_services

    except FileNotFoundError as e:
        logger.error(f"Error checking container status: 'docker' command not found. {e}")
        container_status = {project_id: False for project_id in PROJECTS}
    except Exception as e:
        logger.error(f"Unexpected error checking container status: {str(e)}", exc_info=True)
        container_status = {project_id: False for project_id in PROJECTS}

    # Add index to projects for easier looping in template
    projects_with_index = {k: {**v, 'id': k, 'index': i+1} for i, (k, v) in enumerate(PROJECTS.items())}

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "projects": projects_with_index, # Pass modified dict
            "container_status": container_status
        }
    )

# Removed /start-all endpoint
# Removed /stop-all endpoint
# Removed /start/{project_id} endpoint
# Removed /stop/{project_id} endpoint

if __name__ == "__main__":
    import uvicorn
    try:
        # Ensure Docker is accessible before starting
        try:
            subprocess.run(["docker", "info"], check=True, capture_output=True)
            logger.info("Docker daemon connection verified.")
        except (FileNotFoundError, subprocess.CalledProcessError) as e:
            logger.critical(f"Failed to connect to Docker daemon: {e}")
            logger.critical("The launcher requires Docker access to check service status.")
            # Optionally exit if Docker isn't working
            # exit(1)

        print(f"Starting GenAI Platform Launcher UI on http://0.0.0.0:3000")
        uvicorn.run(app, host="0.0.0.0", port=3000)
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        raise
