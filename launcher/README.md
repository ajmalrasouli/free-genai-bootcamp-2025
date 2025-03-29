# GenAI Learning Platform Launcher

This is a unified launcher for all the GenAI Bootcamp 2025 projects. It provides a central web interface to manage and access all the individual projects.

## Features

- Unified web interface to manage all projects
- Automatic virtual environment management for Python projects
- Individual port allocation for each project
- Start/Stop functionality for each project
- Direct access links to running projects

## Project Structure

```
launcher/
├── main.py           # Main FastAPI application
├── requirements.txt  # Launcher dependencies
├── static/          # Static files
├── templates/       # HTML templates
│   └── index.html  # Main interface template
└── venvs/          # Virtual environments (created automatically)
```

## Setup

1. Create a virtual environment for the launcher:
```bash
python -m venv launcher-env
source launcher-env/bin/activate  # On Windows: launcher-env\Scripts\activate
```

2. Install the launcher requirements:
```bash
pip install -r requirements.txt
```

## Usage

1. Start the launcher:
```bash
python main.py
```

2. Open your browser and navigate to `http://localhost:8000`

3. Use the web interface to:
   - Start individual projects
   - Stop running projects
   - Access running projects through their dedicated ports

## Project Ports

Each project runs on its own port:

- Farsi Text Adventure MUD Game (fa-mud): 8001
- ASL Finger Spelling Application: 8002
- Language Learning Portal: 8003
- Persian Learning Assistant: 8004
- Text-to-Speech Microservice: 8005
- Farsi Song Vocabulary Generator: 8006
- Farsi Learning Visual Novel: 8007
- Farsi Writing Practice App: 8008

## Requirements

- Python 3.7+
- Node.js (for visual-novel project)
- Docker (for opea-comps project)
- Sufficient disk space for virtual environments
- Available ports 8000-8008

## Notes

- Each project runs in its own virtual environment to prevent dependency conflicts
- The launcher automatically creates and manages virtual environments
- Projects can be started and stopped independently
- All projects are accessible through their respective ports once started 