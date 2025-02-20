# Week 1 Development Journal - DariMaster Language Learning App

## Overview
Created a full-stack web application for learning Dari language using modern web technologies. The application features interactive study tools including flashcards and matching games.

## Technical Achievements

### Day 1-2: Project Setup & Infrastructure
- Initialized project with Vite and TypeScript
- Set up Express.js backend with SQLite database
- Configured project structure for client/server architecture
- Implemented basic routing with Wouter
- Set up TanStack Query for data fetching

### Day 3-4: Core Features Development
- Created database schema for words, groups, and study sessions
- Implemented word groups functionality:
  - Numbers (1-20)
  - Family Members
  - Basic Phrases
  - Common Phrases
- Developed flashcard study system
- Created matching game functionality
- Added progress tracking system

### Day 5-6: UI/UX Implementation
- Integrated Tailwind CSS for styling
- Implemented Shadcn/ui components
- Created responsive sidebar navigation
- Designed study session interface
- Added progress indicators and statistics
- Implemented RTL (Right-to-Left) support for Dari text

### Day 7: Data & Performance
- Created seed data for word groups
- Implemented database optimization
- Added error handling
- Improved loading states
- Enhanced user feedback systems

## Key Features Implemented
1. Interactive Flashcards
2. Matching Game
3. Word Groups Management
4. Study Progress Tracking
5. Performance Statistics
6. Bilingual Interface

## Technical Stack
- Frontend: React 18, TypeScript, Tailwind CSS
- Backend: Node.js, Express, SQLite
- State Management: TanStack Query
- Routing: Wouter
- UI Components: Shadcn/ui

## Challenges Overcome
1. RTL text handling for Dari language
2. Database schema design for flexible word grouping
3. State management for study sessions
4. Performance optimization for card animations
5. User progress tracking implementation

## Next Steps
1. Implement user authentication
2. Add more word groups and vocabulary
3. Create additional study activities
4. Add comprehensive testing
5. Implement spaced repetition algorithm
6. Add pronunciation audio support

## Learning Outcomes
1. Advanced React patterns with TypeScript
2. SQLite database optimization
3. RTL layout implementation
4. State management best practices
5. Modern CSS techniques with Tailwind


## Technical Difficulties & Solutions

### 1. Database Issues
**Problem**: Foreign key constraint errors when seeding data
**Solution**: 
- Restructured database operations to delete tables in correct order
- Implemented proper cascading deletes
- Added proper error handling in seed scripts
```typescript
// Fixed deletion order in seed-db.ts
db.exec(`
  -- First delete child tables
  DELETE FROM word_review_items;
  DELETE FROM words_to_groups;
  DELETE FROM study_sessions;
  -- Then delete parent tables
  DELETE FROM words;
  DELETE FROM word_groups;
`);
```

### 2. RTL Text Rendering
**Problem**: Mixed RTL (Dari) and LTR (English) text causing layout issues
**Solution**:
- Added proper dir="rtl" attributes
- Implemented text alignment classes
```tsx
<TableCell dir="rtl" className="text-right">
  {word.example_sentence}
</TableCell>
```

### 3. State Management
**Problem**: Study session progress not persisting correctly
**Solution**:
- Implemented proper state management with TanStack Query
- Added proper error handling and loading states
```typescript
const { data: session } = useQuery({
  queryKey: ["study-session", sessionId],
  queryFn: async () => {
    const response = await fetch(`/api/study-sessions/${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch session');
    return response.json();
  }
});
```

### 4. Flashcard Logic
**Problem**: Flashcards showing answers immediately
**Solution**:
- Restructured Flashcard component to manage show/hide state
- Added proper transition between cards
```typescript
const [showAnswer, setShowAnswer] = useState(false);
const [currentIndex, setCurrentIndex] = useState(0);

const handleShowAnswer = () => {
  setShowAnswer(true);
};
```

### 5. API Integration
**Problem**: Inconsistent data structure between frontend and backend
**Solution**:
- Created shared schema types
- Implemented Zod validation
```typescript
export const wordSchema = z.object({
  dari_word: z.string(),
  english_translation: z.string(),
  pronunciation: z.string(),
  example_sentence: z.string()
});
```

### 6. Performance Issues
**Problem**: Slow loading times for word groups
**Solution**:
- Implemented proper data caching
- Added loading skeletons
```typescript
const { data: words = [], isLoading } = useQuery({
  queryKey: ["words", groupId],
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
});
```

### 7. Matching Game Logic
**Problem**: Cards not properly resetting after matches
**Solution**:
- Improved state management for matched pairs
- Added proper timeouts for card flips
```typescript
const handleCardMatch = (card1: Card, card2: Card) => {
  if (card1.wordId === card2.wordId) {
    setMatchedPairs(prev => [...prev, card1.wordId]);
    setTimeout(() => {
      // Reset selection after match
      setSelectedCards([]);
    }, 1000);
  }
};
```

## Learning Outcomes from Difficulties
1. Better understanding of SQLite foreign key constraints
2. Improved knowledge of RTL layout handling
3. More effective state management patterns
4. Better error handling strategies
5. Improved TypeScript type definitions
6. Better understanding of React performance optimization

## Future Improvements Based on Lessons Learned
1. Implement proper error boundary components
2. Add comprehensive input validation
3. Improve loading state management
4. Add proper error logging system
5. Implement better caching strategies
6. Add automated testing for critical paths