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
        "build_context": "../fa-mud"
    },
    "finger-spelling": {
        "name": "ASL Finger Spelling Application",
        "port": 8002,
        "image": "genai-finger-spelling",
        "build_context": "../finger-spelling"
    },
    "lang-portal": {
        "name": "Language Learning Portal",
        "port": 8003,
        "image": "genai-lang-portal",
        "build_context": "../lang-portal"
    },
    "listening-comp": {
        "name": "Persian Learning Assistant",
        "port": 8004,
        "image": "genai-listening-comp",
        "build_context": "../listening-comp"
    },
    "opea-comps": {
        "name": "Text-to-Speech Microservice",
        "port": 8005,
        "image": "genai-opea-comps",
        "build_context": "../opea-comps"
    },
    "song-vocab": {
        "name": "Farsi Song Vocabulary Generator",
        "port": 8006,
        "image": "genai-song-vocab",
        "build_context": "../song-vocab"
    },
    "visual-novel": {
        "name": "Farsi Learning Visual Novel",
        "port": 8007,
        "image": "genai-visual-novel",
        "build_context": "../visual-novel"
    },
    "writing-practice": {
        "name": "Farsi Writing Practice App",
        "port": 8008,
        "image": "genai-writing-practice",
        "build_context": "../writing-practice"
    }
}

class DockerManager:
    def __init__(self):
        self.running_containers = {}
        
    def build_image(self, project_id):
        """Build Docker image for a project"""
        project = PROJECTS[project_id]
        logger.info(f"Building Docker image for {project_id}")
        
        result = subprocess.run(
            ["docker", "build", "-t", project["image"], "."],
            cwd=project["build_context"],
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            logger.error(f"Error building image: {result.stderr}")
            raise Exception(f"Failed to build Docker image: {result.stderr}")
            
    def cleanup_existing_container(self, container_name):
        """Remove existing container if it exists"""
        try:
            # Check if container exists
            result = subprocess.run(
                ["docker", "ps", "-a", "--filter", f"name=^/{container_name}$", "--format", "{{.ID}}"],
                capture_output=True,
                text=True
            )
            container_id = result.stdout.strip()
            
            if container_id:
                logger.info(f"Found existing container {container_id}, removing it")
                # Stop container if it's running
                subprocess.run(["docker", "stop", container_id], capture_output=True)
                # Remove container
                subprocess.run(["docker", "rm", container_id], capture_output=True)
        except Exception as e:
            logger.error(f"Error cleaning up container: {e}")
            
    def start_project(self, project_id):
        """Start a project's Docker container"""
        project = PROJECTS[project_id]
        
        try:
            # Build the image if it doesn't exist
            try:
                subprocess.run(
                    ["docker", "image", "inspect", project["image"]], 
                    capture_output=True, 
                    check=True
                )
            except subprocess.CalledProcessError:
                self.build_image(project_id)
            
            # Start the container
            container_name = f"genai-{project_id}"
            
            # Clean up existing container if any
            self.cleanup_existing_container(container_name)
            
            logger.info(f"Starting container {container_name}")
            
            result = subprocess.run([
                "docker", "run",
                "-d",  # Run in detached mode
                "--name", container_name,
                "-p", f"{project['port']}:{project['port']}",  # Port mapping
                "--rm",  # Remove container when stopped
                project["image"]
            ], capture_output=True, text=True)
            
            if result.returncode != 0:
                raise Exception(f"Failed to start container: {result.stderr}")
            
            container_id = result.stdout.strip()
            self.running_containers[project_id] = container_id
            return container_id

        except Exception as e:
            logger.error(f"Error starting {project_id}: {str(e)}")
            raise Exception(f"Failed to start {project_id}: {str(e)}")

    def stop_project(self, project_id):
        """Stop a project's Docker container"""
        if project_id in self.running_containers:
            container_id = self.running_containers[project_id]
            logger.info(f"Stopping container {container_id}")
            
            try:
                subprocess.run(
                    ["docker", "stop", container_id],
                    capture_output=True,
                    check=True
                )
                del self.running_containers[project_id]
                return True
            except subprocess.CalledProcessError as e:
                logger.error(f"Error stopping container: {e.stderr}")
                raise Exception(f"Failed to stop container: {e.stderr}")
        
        # If container not in our list, try to find and stop it by name
        try:
            container_name = f"genai-{project_id}"
            self.cleanup_existing_container(container_name)
            return True
        except Exception:
            return False

docker_manager = DockerManager()

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "projects": PROJECTS}
    )

@app.post("/start/{project_id}")
async def start_project(project_id: str):
    if project_id not in PROJECTS:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        container_id = docker_manager.start_project(project_id)
        return {
            "status": "success", 
            "message": f"Project {project_id} started", 
            "container_id": container_id
        }
    except Exception as e:
        logger.error(f"Error in start_project endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stop/{project_id}")
async def stop_project(project_id: str):
    if project_id not in PROJECTS:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        if docker_manager.stop_project(project_id):
            return {"status": "success", "message": f"Project {project_id} stopped"}
        else:
            return {"status": "warning", "message": f"Project {project_id} was not running"}
    except Exception as e:
        logger.error(f"Error in stop_project endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    try:
        print("Starting server on http://127.0.0.1:3000")
        uvicorn.run(app, host="127.0.0.1", port=3000)
    except Exception as e:
        print(f"Error starting server: {e}")
        try:
            print("Attempting to start on alternative port http://127.0.0.1:3001...")
            uvicorn.run(app, host="127.0.0.1", port=3001)
        except Exception as e:
            print(f"Error starting server on alternative port: {e}") 