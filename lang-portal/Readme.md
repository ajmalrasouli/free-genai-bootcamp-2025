# DariMaster Language Portal

A modern web application for learning and practicing Dari language.

## Docker Setup

This application is containerized using Docker and can be run either in development or production mode.

### Prerequisites

- Docker
- Docker Compose

### Development Setup

To run the application in development mode with hot-reloading:

```bash
# Clone the repository
git clone <repository-url>
cd lang-portal

# Start the development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

The development server will be available at:
- Client: http://localhost:5173
- Server API: http://localhost:8003/api

### Production Setup

To build and run the application in production mode:

```bash
# Clone the repository
git clone <repository-url>
cd lang-portal

# Start production containers
docker-compose up -d

# View logs
docker-compose logs -f
```

The production application will be available at:
- Client: http://localhost:80
- Server API: http://localhost:8003/api

### Stopping Containers

```bash
# For development
docker-compose -f docker-compose.dev.yml down

# For production
docker-compose down
```

## Application Structure

- **client**: React frontend built with Vite
- **server**: Node.js backend with Express
- **shared**: Shared types and utilities

## Features

- Interactive flashcards for vocabulary learning
- Matching game for practice
- Word grouping for organized learning
- Study history tracking
- Progress dashboard

## License

This project is licensed under the MIT License.