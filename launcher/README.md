# GenAI Learning Platform Launcher

This project provides a central web dashboard (`http://localhost:3000`) to view the status of and access all the GenAI Bootcamp 2025 project applications running within Docker containers.

**Note:** This launcher is designed primarily as a **status dashboard and access portal**. It displays which services (defined in `docker-compose.yml`) are currently running and provides direct links to them. Starting and stopping individual project containers must be done manually using `docker compose` commands in your terminal.

## Features

- Central web dashboard listing all bootcamp projects.
- Real-time status indication (Running/Stopped) for each project container.
- Direct links to access the web UI or API docs of running projects.
- Simple, clean interface using FastAPI and Jinja2 templates.

## Project Structure

```
Launcher/
├── main.py           # Main FastAPI application (serves the UI)
├── requirements.txt  # Launcher Python dependencies
├── static/           # Static files (CSS, JS - if any)
├── templates/        # HTML templates
│   └── index.html    # Main dashboard template
├── Dockerfile        # Builds the launcher service container
└── .env.template     # Template for required environment variables
```

## Setup & Usage (Docker Compose)

This launcher service is part of the multi-container setup defined in `docker-compose.yml`.

1.  **Prerequisites:**
    *   Ensure Docker and Docker Compose (or `docker compose` plugin) are installed on your system.

2.  **Environment Variables:**
    *   Navigate to the `Launcher` directory.
    *   Create a `.env` file if it doesn't exist (you can copy `.env.template`).
    *   Add any necessary API keys required by *other* services in the `.env` file (e.g., `GOOGLE_API_KEY=...`). The launcher itself doesn't need specific keys, but the compose file loads this `.env` for all services.

3.  **Build & Run All Services (Including Launcher):**
    *   Make sure you are in the `Launcher` directory in your terminal.
    *   Run the following command:
        ```bash
        docker-compose up -d
        ```
    *   This command performs several actions:
        *   Builds the Docker image for the `launcher` service (and any other services that haven't been built).
        *   Creates and starts containers for **all** services defined in `docker-compose.yml`, including the `launcher`.
        *   The `-d` flag runs the containers in detached mode (in the background).

4.  **Access the Launcher Dashboard:**
    *   Once the containers are running, open your web browser and navigate to:
        `http://localhost:3000`
    *   The dashboard will display the status (Running/Stopped) of the other project containers and provide direct links to access them.

5.  **Managing Other Services:**
    *   Use your terminal (in the `Launcher` directory) to manage the lifecycle of the other project containers (start, stop, view logs) using standard `docker compose` commands as needed:
        *   `docker compose stop <service_name>`
        *   `docker compose start <service_name>`
        *   `docker compose logs <service_name>`

6.  **Stopping Everything:**
    *   To stop and remove all containers defined in the compose file (including the launcher), run:
        ```bash
        docker-compose down
        ```

## Technical Details

-   **Backend:** Python with FastAPI.
-   **Frontend:** Jinja2 templates with basic HTML/CSS/JS.
-   **Status Check:** The backend periodically runs `docker compose ps --services --filter status=running` inside its container to determine which services are active.
-   **Docker Socket Requirement:** The launcher container requires access to the host's Docker socket (`/var/run/docker.sock`) to run `docker compose ps`. This is configured via a volume mount in the `docker-compose.yml` file.

## Project Ports

- Launcher: 3000
- Farsi Text Adventure MUD Game (fa-mud): 8001
- ASL Finger Spelling Application (finger-spelling): 8002
- Language Learning Portal (lang-portal): 8003
- Persian Learning Assistant (listening-comp): 8004
- Text-to-Speech Microservice (opea-comps): 8005 (API Docs at `/docs`)
- Farsi Song Vocabulary Generator (song-vocab): 8006 (API Docs at `/docs`)
- Farsi Learning Visual Novel (visual-novel): 8007
- Farsi Writing Practice App (writing-practice): 8008
- TTS Microservice (tts-service): 5005 (API only)

## Contributing

Feel free to submit issues or pull requests for improvements to the launcher dashboard. 