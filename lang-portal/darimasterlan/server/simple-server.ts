import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Word, Group, StudySession, WordReview, Dashboard } from './shared/schema.js';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample data
const sampleWords: Word[] = [
  {
    id: 1,
    dariWord: 'سلام',
    englishTranslation: 'hello',
    pronunciation: 'salām',
    partOfSpeech: 'noun',
    example: 'سلام، حالت چطوره؟',
    difficulty: 'beginner'
  },
  {
    id: 2,
    dariWord: 'خداحافظ',
    englishTranslation: 'goodbye',
    pronunciation: 'khodāhāfez',
    example: 'خداحافظ، فردا می‌بینمت.',
    difficulty: 'beginner'
  },
  {
    id: 3,
    dariWord: 'متشکرم',
    englishTranslation: 'thank you',
    pronunciation: 'moteshakkeram',
    example: 'متشکرم برای کمکت.',
    difficulty: 'beginner'
  },
  {
    id: 4,
    dariWord: 'آب',
    englishTranslation: 'water',
    pronunciation: 'āb',
    partOfSpeech: 'noun',
    difficulty: 'beginner'
  },
  {
    id: 5,
    dariWord: 'نان',
    englishTranslation: 'bread',
    pronunciation: 'nān',
    partOfSpeech: 'noun',
    difficulty: 'beginner'
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
      { wordId: 1, rating: 5 },
      { wordId: 2, rating: 4 },
      { wordId: 3, rating: 3 }
    ]
  }
];

// Create Express application
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8003;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  next();
});

// Log more details about directories
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);

// Serve static files if they exist
const publicDir = path.join(__dirname, 'public');
console.log('Looking for public directory at:', publicDir);

// Check if the directory exists and what files it contains
if (fs.existsSync(publicDir)) {
  console.log('Public directory exists.');
  console.log('Files in public directory:');
  try {
    const files = fs.readdirSync(publicDir);
    files.forEach(file => {
      console.log(' -', file);
    });
    if (files.includes('index.html')) {
      console.log('index.html found in public directory');
    } else {
      console.log('index.html NOT found in public directory');
    }
  } catch (err) {
    console.error('Error reading public directory:', err);
  }
  
  app.use(express.static(publicDir));
} else {
  console.log('Public directory does not exist');
  // Create a simple fallback public directory with a basic HTML file
  try {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('Created public directory');
    
    // Create a basic index.html file
    const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DariMaster - Language Learning Portal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            display: flex;
            min-height: 100vh;
        }
        .sidebar {
            background-color: #7867D1;
            color: white;
            padding: 20px;
            width: 200px;
            min-height: 100vh;
        }
        .sidebar h1 {
            margin-top: 0;
            margin-bottom: 30px;
        }
        .sidebar ul {
            list-style: none;
            padding: 0;
        }
        .sidebar li {
            margin-bottom: 15px;
        }
        .sidebar a {
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
        }
        .sidebar a svg {
            margin-right: 10px;
        }
        .content {
            flex: 1;
            padding: 20px;
        }
        .card {
            background: #f9f9f9;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        button.primary {
            background-color: #7867D1;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .progress-bar {
            background-color: #f0f0f0;
            border-radius: 4px;
            height: 8px;
            margin-top: 5px;
        }
        .progress-bar .fill {
            background-color: #7867D1;
            height: 100%;
            border-radius: 4px;
            width: 57%;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <h1>DariMaster</h1>
        <ul>
            <li>
                <a href="#">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    Dashboard
                </a>
            </li>
            <li>
                <a href="#">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    Study Activities
                </a>
            </li>
            <li>
                <a href="#">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    Words
                </a>
            </li>
            <li>
                <a href="#">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    Word Groups
                </a>
            </li>
            <li>
                <a href="#">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Sessions
                </a>
            </li>
            <li>
                <a href="#">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Settings
                </a>
            </li>
        </ul>
    </div>
    <div class="content">
        <h1>Dashboard</h1>
        
        <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
            <button class="primary">Start Studying →</button>
        </div>
        
        <div class="stats-grid">
            <div class="card">
                <h2>Last Study Session</h2>
                <p><strong>Basic Greetings</strong></p>
                <p>2 correct - 2 wrong</p>
                <p>3/23/2025</p>
                <a href="#">View Group →</a>
            </div>
            
            <div class="card">
                <h2>Study Progress</h2>
                <p>Total Words Studied: 3 / 12</p>
                <p>Mastery Progress: 57%</p>
                <div class="progress-bar">
                    <div class="fill"></div>
                </div>
            </div>
            
            <div class="card">
                <h2>Quick Stats</h2>
                <p>Success Rate: 57%</p>
                <p>Study Sessions: 2</p>
                <p>Active Groups: 4</p>
                <p>Study Streak: 1 days</p>
            </div>
        </div>
        
        <div class="card">
            <h3>API Status</h3>
            <p>The Language Learning Portal API is running correctly!</p>
            <p>This is a fallback UI since the React client build wasn't found.</p>
            <p>API Endpoints available:</p>
            <ul>
                <li><a href="/api/dashboard">/api/dashboard</a></li>
                <li><a href="/api/words">/api/words</a></li>
                <li><a href="/api/groups">/api/groups</a></li>
                <li><a href="/api/study-sessions">/api/study-sessions</a></li>
            </ul>
        </div>
    </div>
</body>
</html>
    `;
    fs.writeFileSync(path.join(publicDir, 'index.html'), fallbackHtml);
    console.log('Created fallback index.html');
    app.use(express.static(publicDir));
  } catch (err) {
    console.error('Error creating fallback public directory:', err);
  }
}

// API routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Language Learning Portal is running' });
});

app.get('/api/words', (_req, res) => {
  res.json(sampleWords);
});

app.get('/api/words/:id', (req, res) => {
  const wordId = parseInt(req.params.id);
  const word = sampleWords.find(w => w.id === wordId);
  
  if (word) {
    res.json(word);
  } else {
    res.status(404).json({ error: 'Word not found' });
  }
});

app.get('/api/groups', (_req, res) => {
  const groupsWithCounts = sampleGroups.map(group => ({
    ...group,
    wordCount: group.words.length
  }));
  res.json(groupsWithCounts);
});

app.get('/api/groups/:id', (req, res) => {
  const groupId = parseInt(req.params.id);
  const group = sampleGroups.find(g => g.id === groupId);
  
  if (group) {
    const wordsInGroup = sampleWords.filter(word => group.words.includes(word.id));
    res.json({
      ...group,
      wordCount: group.words.length,
      words: wordsInGroup
    });
  } else {
    res.status(404).json({ error: 'Group not found' });
  }
});

app.get('/api/study-sessions', (_req, res) => {
  res.json(sampleSessions);
});

app.get('/api/study-sessions/:id', (req, res) => {
  const sessionId = parseInt(req.params.id);
  const session = sampleSessions.find(s => s.id === sessionId);
  
  if (session) {
    // Add word details to reviews
    const sessionWithWords = {
      ...session,
      reviews: session.reviews?.map(review => {
        const word = sampleWords.find(w => w.id === review.wordId);
        return { ...review, word };
      })
    };
    res.json(sessionWithWords);
  } else {
    res.status(404).json({ error: 'Study session not found' });
  }
});

// Additional dashboard endpoints to match the UI
app.get('/api/dashboard', (_req, res) => {
  // Return data for the dashboard UI
  const dashboardData: Dashboard = {
    lastStudySession: {
      id: 1,
      name: 'Basic Greetings',
      correct: 2,
      wrong: 2,
      date: '3/23/2025'
    },
    progress: {
      totalWords: 12,
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
  res.json(dashboardData);
});

// Serve index.html for client-side routing
app.get('*', (_req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({
      message: 'Language Learning Portal API is running, but no frontend is available.',
      error: 'Could not find index.html at ' + indexPath,
      publicDir,
      dirExists: fs.existsSync(publicDir)
    });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
}); 