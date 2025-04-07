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

This launcher is intended to be run using Docker Compose alongside the other project services.

1.  **Prerequisites:** Ensure Docker and Docker Compose are installed on your system.
2.  **Environment Variables:** Create a `.env` file in this `Launcher` directory (you can copy `.env.template`) and add any necessary API keys (like `GOOGLE_API_KEY` if required by other services managed indirectly).
3.  **Run All Services:** From this `Launcher` directory, start all defined services:
```bash
    docker-compose up -d
    ```
4.  **Access Launcher:** Open your browser to `http://localhost:3000`.
5.  **Access Projects:** Click the "Launch" link on a project card to open its specific URL (e.g., `http://localhost:8008` for Writing Practice) in a new tab. This only works if the corresponding service container is running.
6.  **Manage Services:** Use your terminal in the `Launcher` directory to manage individual services:
    *   `docker compose ps` (View status of all services)
    *   `docker compose start <service_name>` (e.g., `docker compose start writing-practice`)
    *   `docker compose stop <service_name>` (e.g., `docker compose stop writing-practice`)
    *   `docker compose logs <service_name>` (View logs for a service)
    *   `docker compose down` (Stop and remove all containers)

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