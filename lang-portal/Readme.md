# DariMaster

A modern web application for learning Dari language through interactive study activities.

## Features

### Study Activities
- **Flashcards**: Traditional flashcard-based learning with Dari words, translations, and example sentences
- **Matching Game**: Interactive card matching game to pair Dari words with their English translations
- **Progress Tracking**: Detailed study history with success rates and word counts

### Word Management
- Create and manage word groups
- Add words with Dari text, English translations, pronunciations, and example sentences
- Organize words into thematic groups

### Study Progress
- Track study sessions and performance
- View success rates per session
- Monitor learning progress over time
- Study streak tracking

### Dashboard
- Quick overview of study progress
- Recent study sessions
- Success rate statistics
- Active word groups
- Current study streak

## Technical Stack

### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Tailwind CSS for styling
- Shadcn/ui for UI components

### Backend
- Node.js with Express
- SQLite with Better-SQLite3
- Drizzle ORM for database operations
- Zod for schema validation

## Database Schema

```sql
-- Words table
CREATE TABLE words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dari_word TEXT NOT NULL,
    english_translation TEXT NOT NULL,
    pronunciation TEXT NOT NULL,
    example_sentence TEXT NOT NULL
);

-- Word groups
CREATE TABLE word_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- Words to groups mapping
CREATE TABLE words_to_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    FOREIGN KEY (word_id) REFERENCES words(id),
    FOREIGN KEY (group_id) REFERENCES word_groups(id)
);

-- Study sessions
CREATE TABLE study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES word_groups(id)
);

-- Word review items
CREATE TABLE word_review_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER,
    study_session_id INTEGER,
    correct BOOLEAN NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (word_id) REFERENCES words(id),
    FOREIGN KEY (study_session_id) REFERENCES study_sessions(id)
);

-- Study activities
CREATE TABLE study_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm (v7 or newer)
- Visual Studio with "Desktop development with C++" workload
  - This is required for compiling the native SQLite3 dependencies
  - You can download Visual Studio Community (free) from [https://visualstudio.microsoft.com/downloads/](https://visualstudio.microsoft.com/downloads/)
  - During installation, select the "Desktop development with C++" workload

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lang-portal.git

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:setup
```

4. Start the development server:
```bash
npm run dev
```

## Development

### Available Scripts
- `npm run dev`: Start development server (builds frontend and starts Express server)
- `npm run build`: Build for production
- `npm run db:setup`: Initialize database
- `npm run db:seed` or `npm run seed`: Seed database with sample data
- `npm run db:check`: Check database integrity

### Project Structure
```
darimaster/
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   └── App.tsx     # Main application component
├── server/             # Backend Express server
│   ├── routes.ts       # API routes
│   ├── db.ts           # Database configuration
│   ├── storage.ts      # Data access layer
│   └── index.ts        # Server entry point
├── shared/             # Shared types and schemas
└── scripts/            # Database and utility scripts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE) - Copyright (c) 2024 Ajmal Rasouli