**# Backend Server Technical Specifications (Node.js/Express Implementation)**

## Business Goal

A language-learning school wants to build a prototype learning portal that will serve three purposes:

1. **Inventory of possible vocabulary** that can be learned.
2. **Learning Record Store (LRS)** to track correct and incorrect scores in vocabulary practice.
3. **A unified launchpad** to launch different learning applications.

## Technical Requirements

- **Backend Framework:** Node.js with Express
- **Database:** SQLite3 with Better-SQLite3
- **API Framework:** Express.js
- **API Response Format:** JSON
- **Authentication & Authorization:** None (treated as a single user system)

## Directory Structure

```
server/
├── index.ts       # Main server entry point
├── db.ts          # Database configuration
├── routes.ts      # API route definitions
├── storage.ts     # Data access layer
├── vite.ts        # Vite configuration for server
├── seed.ts        # Database seeding
```

## Database Schema

### `words` Table

| Column               | Type                  | Description            |
| -------------------- | --------------------- | ---------------------- |
| id                   | INTEGER (Primary Key) | Unique identifier      |
| dari\_word           | TEXT                  | Dari vocabulary word   |
| english\_translation | TEXT                  | English equivalent     |
| pronunciation        | TEXT                  | Phonetic pronunciation |
| example\_sentence    | TEXT                  | Example usage in Dari  |

### `word_groups` Table

| Column | Type                  | Description                       |
| ------ | --------------------- | --------------------------------- |
| id     | INTEGER (Primary Key) | Unique identifier                 |
| name   | TEXT                  | Group name (e.g., "Common Verbs") |

### `words_to_groups` Table

| Column   | Type                  | Description          |
| -------- | --------------------- | -------------------- |
| id       | INTEGER (Primary Key) | Unique identifier    |
| word\_id | INTEGER (Foreign Key) | Reference to word    |
| group\_id| INTEGER (Foreign Key) | Reference to group   |

### `study_sessions` Table

| Column      | Type                  | Description                |
| ----------- | --------------------- | -------------------------- |
| id          | INTEGER (Primary Key) | Unique session identifier  |
| group\_id   | INTEGER (Foreign Key) | Associated group ID        |
| created\_at | DATETIME              | Timestamp of study session |

### `study_activities` Table

| Column      | Type                  | Description               |
| ----------- | --------------------- | ------------------------- |
| id          | INTEGER (Primary Key) | Unique identifier         |
| name        | TEXT                  | Activity name             |
| type        | TEXT                  | Activity type             |
| description | TEXT                  | Activity description      |
| thumbnail\_url | TEXT               | URL for activity thumbnail |
| created\_at | DATETIME              | Timestamp of creation     |

### `word_review_items` Table

| Column             | Type                  | Description                             |
| ------------------ | --------------------- | --------------------------------------- |
| id                 | INTEGER (Primary Key) | Unique identifier                       |
| word\_id           | INTEGER (Foreign Key) | Word being reviewed                     |
| study\_session\_id | INTEGER (Foreign Key) | Associated study session                |
| correct            | BOOLEAN               | Whether the word was answered correctly |
| created\_at        | DATETIME              | Timestamp of review                     |

## Running the Application

### Install Dependencies

```bash
npm install
```

### Setup Database

```bash
npm run db:setup
```

### Seed Database with Sample Data

```bash
npm run db:seed
# or
npm run seed
```

### Start Development Server

```bash
npm run dev
```

This will build the frontend with Vite and start the Express server using tsx.
