# DariMaster Language Portal

A modern web application for learning and practicing Dari language.

## Features

- Interactive flashcards for vocabulary learning
- Matching game for practice
- Word grouping for organized learning
- Study history tracking
- Progress dashboard
- SQLite database for persistent data storage
- Modern React frontend with Vite
- Node.js backend with Express

## Prerequisites

- Node.js (v18 or higher)
- npm (included with Node.js)
- SQLite3 (automatically installed with project dependencies)

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd lang-portal
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Start the development servers:
```bash
# In server directory
cd server
node dari-api.mjs

# In a new terminal, in client directory
cd client
npm run dev
```

The application will be available at:
- Client: http://localhost:5173
- Server API: http://localhost:8003/api

## API Endpoints

- `GET /api/dashboard` - Get learning statistics and progress
- `GET /api/words` - List all words or filter by group
- `GET /api/groups` - List all word groups
- `GET /api/study_sessions` - List all study sessions
- `POST /api/study_sessions` - Create a new study session
- `PATCH /api/study_sessions/:id` - Update an existing study session
- `POST /api/word_reviews` - Create word review records

## Database Structure

The application uses SQLite3 for data persistence. The database schema includes:

- `Words` table: Stores Dari vocabulary words with translations and examples
- `WordGroups` table: Organizes words into logical groups
- `StudySessions` table: Tracks user study sessions and progress

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

## License

This project is licensed under the MIT License.