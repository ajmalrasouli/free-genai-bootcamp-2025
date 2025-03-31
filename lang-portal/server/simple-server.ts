import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { Word, Group, StudySession, WordReview, Dashboard } from './shared/schema.js';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8003;

// Enable CORS
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(express.json());

// Sample data
const sampleWords: Word[] = [
  {
    id: 1,
    dariWord: 'سلام',
    englishTranslation: 'hello',
    pronunciation: 'salām',
    exampleSentence: 'سلام، حالت چطوره؟'
  },
  {
    id: 2,
    dariWord: 'خداحافظ',
    englishTranslation: 'goodbye',
    pronunciation: 'khodāhāfez',
    exampleSentence: 'خداحافظ، فردا می‌بینمت.'
  },
  {
    id: 3,
    dariWord: 'متشکرم',
    englishTranslation: 'thank you',
    pronunciation: 'moteshakkeram',
    exampleSentence: 'متشکرم برای کمکت.'
  },
  {
    id: 4,
    dariWord: 'آب',
    englishTranslation: 'water',
    pronunciation: 'āb',
    exampleSentence: 'آب خنک است.'
  },
  {
    id: 5,
    dariWord: 'نان',
    englishTranslation: 'bread',
    pronunciation: 'nān',
    exampleSentence: 'نان تازه است.'
  }
];

const sampleGroups: Group[] = [
  {
    id: 1,
    name: 'Basic Greetings',
    description: 'Common greetings and expressions',
    words: [1, 2, 3]
  },
  {
    id: 2,
    name: 'Food and Drink',
    description: 'Essential food and drink vocabulary',
    words: [4, 5]
  }
];

const sampleSessions: StudySession[] = [
  {
    id: 1,
    groupId: 1,
    date: new Date().toISOString(),
    completed: true,
    reviews: [
      {
        id: 1,
        wordId: 1,
        sessionId: 1,
        correct: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        wordId: 2,
        sessionId: 1,
        correct: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        wordId: 3,
        sessionId: 1,
        correct: false,
        createdAt: new Date().toISOString()
      }
    ]
  }
];

// API Routes
app.get('/api/words', (req, res) => {
  res.json(sampleWords);
});

app.get('/api/dashboard', (req, res) => {
  const dashboard: Dashboard = {
    lastStudySession: {
      id: 1,
      name: 'Basic Greetings',
      correct: 2,
      wrong: 2,
      date: new Date().toISOString()
    },
    progress: {
      totalWords: sampleWords.length,
      studiedWords: 3,
      masteryProgress: 57
    },
    stats: {
      successRate: 57,
      studySessions: 2,
      activeGroups: 4,
      studyStreak: '1 days'
    }
  };
  res.json(dashboard);
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 