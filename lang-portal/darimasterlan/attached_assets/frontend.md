**# Frontend Technical Specifications (React Implementation for Dari Language Support)**

## Technical Stack

- **Framework:** React with TypeScript
- **Routing:** Wouter
- **Data Fetching:** TanStack Query
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui

## Pages

### Dashboard `/dashboard`

**Purpose:** Provides a summary of learning and acts as the default page when a user visits the web app.

**Components:**

-   **Last Study Session**

    -   Shows last activity used

    -   Displays when last activity was used

    -   Summarizes incorrect vs. correct answers

    -   Provides a link to the group

-   **Study Progress**

    -   Total words studied (e.g., `3/124`)

    -   Displays mastery progress (e.g., `0%`)

-   **Quick Stats**

    -   Success rate (e.g., `80%`)

    -   Total study sessions (e.g., `4`)

    -   Total active groups (e.g., `3`)

### Words `/words`

**Purpose:** View, add, and manage vocabulary words.

**Components:**

- **Word List** - Paginated list of all words
- **Word Details** - View details of a single word
- **Add Word Form** - Form to add new words

### Groups `/groups`

**Purpose:** Manage word groups for organized study.

**Components:**

- **Group List** - List of all word groups
- **Group Details** - View details of a group and its words
- **Add Group Form** - Form to create new word groups

### Study Activities `/activities`

**Purpose:** Access different study activities.

**Activities:**

- **Flashcards** - Traditional flashcard-based learning
- **Matching Game** - Interactive card matching game

### Study Sessions `/study-sessions`

**Purpose:** Track study history and performance.

**Components:**

- **Session List** - List of past study sessions
- **Session Details** - Performance details for a specific session

## Directory Structure

```
client/
├── src/
│   ├── components/       # Reusable components
│   │   ├── activities/   # Activity-specific components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components from shadcn
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and constants
│   ├── pages/            # Page components
│   │   ├── activities/   # Activity pages
│   │   ├── groups/       # Group management pages
│   │   ├── study-sessions/ # Study session pages
│   │   └── words/        # Word management pages
│   └── App.tsx           # Main application component
```

## Running the Application

The frontend is built using Vite and is integrated with the backend server. To run the full application:

```bash
npm install       # Install dependencies
npm run db:setup  # Set up the database
npm run dev       # Start the development server
```

This will build the frontend and start the Express server that serves both the API and the frontend application.