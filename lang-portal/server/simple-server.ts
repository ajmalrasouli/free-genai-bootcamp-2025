import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import type { Word, WordGroup, StudySession, Dashboard } from './shared/schema.js';

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

// Mock data
const mockData = {
  words: [
    // Numbers (groupId: 1)
    {
      id: 1,
      dariWord: 'یک',
      pronunciation: 'yak',
      englishTranslation: 'One',
      exampleSentence: 'من یک کتاب دارم',
      groupId: 1
    },
    {
      id: 2,
      dariWord: 'دو',
      pronunciation: 'do',
      englishTranslation: 'Two',
      exampleSentence: 'دو نفر آمدند',
      groupId: 1
    },
    {
      id: 3,
      dariWord: 'سه',
      pronunciation: 'se',
      englishTranslation: 'Three',
      exampleSentence: 'سه ساعت گذشت',
      groupId: 1
    },
    {
      id: 4,
      dariWord: 'چهار',
      pronunciation: 'chahār',
      englishTranslation: 'Four',
      exampleSentence: 'چهار روز باقی مانده',
      groupId: 1
    },
    {
      id: 5,
      dariWord: 'پنج',
      pronunciation: 'panj',
      englishTranslation: 'Five',
      exampleSentence: 'پنج دقیقه صبر کن',
      groupId: 1
    },
    {
      id: 6,
      dariWord: 'شش',
      pronunciation: 'shesh',
      englishTranslation: 'Six',
      exampleSentence: 'شش ماه گذشت',
      groupId: 1
    },
    {
      id: 7,
      dariWord: 'هفت',
      pronunciation: 'haft',
      englishTranslation: 'Seven',
      exampleSentence: 'هفت روز در هفته',
      groupId: 1
    },
    {
      id: 8,
      dariWord: 'هشت',
      pronunciation: 'hasht',
      englishTranslation: 'Eight',
      exampleSentence: 'هشت ساعت کار کردم',
      groupId: 1
    },
    
    // Family Members (groupId: 2)
    {
      id: 9,
      dariWord: 'پدر',
      pronunciation: 'padar',
      englishTranslation: 'Father',
      exampleSentence: 'پدر من دکتر است',
      groupId: 2
    },
    {
      id: 10,
      dariWord: 'مادر',
      pronunciation: 'mādar',
      englishTranslation: 'Mother',
      exampleSentence: 'مادر من معلم است',
      groupId: 2
    },
    {
      id: 11,
      dariWord: 'برادر',
      pronunciation: 'barādar',
      englishTranslation: 'Brother',
      exampleSentence: 'برادر من در دانشگاه درس می‌خواند',
      groupId: 2
    },
    {
      id: 12,
      dariWord: 'خواهر',
      pronunciation: 'khāhar',
      englishTranslation: 'Sister',
      exampleSentence: 'خواهر من پزشک است',
      groupId: 2
    },
    {
      id: 13,
      dariWord: 'همسر',
      pronunciation: 'hamsar',
      englishTranslation: 'Spouse',
      exampleSentence: 'همسر من مهندس است',
      groupId: 2
    },
    {
      id: 14,
      dariWord: 'پسر',
      pronunciation: 'pesar',
      englishTranslation: 'Son',
      exampleSentence: 'پسر من به مکتب میرود',
      groupId: 2
    },
    {
      id: 15,
      dariWord: 'دختر',
      pronunciation: 'dokhtar',
      englishTranslation: 'Daughter',
      exampleSentence: 'دختر من باهوش است',
      groupId: 2
    },
    {
      id: 16,
      dariWord: 'کاکا',
      pronunciation: 'kākā',
      englishTranslation: 'Uncle',
      exampleSentence: 'کاکایم در کابل زندگی میکند',
      groupId: 2
    },
    {
      id: 17,
      dariWord: 'خاله',
      pronunciation: 'khāla',
      englishTranslation: 'Aunt',
      exampleSentence: 'خاله ام معلم است',
      groupId: 2
    },
    {
      id: 18,
      dariWord: 'پدرکلان',
      pronunciation: 'padar kalān',
      englishTranslation: 'Grandfather',
      exampleSentence: 'پدرکلانم داستان های خوب میگوید',
      groupId: 2
    },
    
    // Basic Phrases (groupId: 3)
    {
      id: 19,
      dariWord: 'سلام',
      pronunciation: 'salām',
      englishTranslation: 'Hello',
      exampleSentence: 'سلام، حال شما چطور است؟',
      groupId: 3
    },
    {
      id: 20,
      dariWord: 'خداحافظ',
      pronunciation: 'khudā hāfiz',
      englishTranslation: 'Goodbye',
      exampleSentence: 'خداحافظ، فردا می‌بینمت',
      groupId: 3
    },
    {
      id: 21,
      dariWord: 'تشکر',
      pronunciation: 'tashakor',
      englishTranslation: 'Thank you',
      exampleSentence: 'تشکر از کمک شما',
      groupId: 3
    },
    {
      id: 22,
      dariWord: 'ببخشید',
      pronunciation: 'bebakhshid',
      englishTranslation: 'Excuse me / Sorry',
      exampleSentence: 'ببخشید، ساعت چند است؟',
      groupId: 3
    },
    {
      id: 23,
      dariWord: 'بلی',
      pronunciation: 'bale',
      englishTranslation: 'Yes',
      exampleSentence: 'بلی، من می‌توانم کمک کنم',
      groupId: 3
    },
    {
      id: 24,
      dariWord: 'نه',
      pronunciation: 'na',
      englishTranslation: 'No',
      exampleSentence: 'نه، من نمی‌توانم بیایم',
      groupId: 3
    },
    {
      id: 25,
      dariWord: 'چطور استی؟',
      pronunciation: 'chetor asti?',
      englishTranslation: 'How are you?',
      exampleSentence: 'سلام، چطور استی؟',
      groupId: 3
    },
    {
      id: 26,
      dariWord: 'خوب استم',
      pronunciation: 'khob astam',
      englishTranslation: 'I am fine',
      exampleSentence: 'تشکر، خوب استم',
      groupId: 3
    },
    
    // Common Phrases (groupId: 4)
    {
      id: 27,
      dariWord: 'نام شما چیست؟',
      pronunciation: 'nām e shomā chist?',
      englishTranslation: 'What is your name?',
      exampleSentence: 'سلام، نام شما چیست؟',
      groupId: 4
    },
    {
      id: 28,
      dariWord: 'از کجا استید؟',
      pronunciation: 'az kojā astid?',
      englishTranslation: 'Where are you from?',
      exampleSentence: 'از کجا استید؟ من از کابل استم',
      groupId: 4
    },
    {
      id: 29,
      dariWord: 'دری میفهمید؟',
      pronunciation: 'dari mifamid?',
      englishTranslation: 'Do you understand Dari?',
      exampleSentence: 'آیا شما دری میفهمید؟',
      groupId: 4
    },
    {
      id: 30,
      dariWord: 'کمی دری میفهمم',
      pronunciation: 'kami dari mifamam',
      englishTranslation: 'I understand a little Dari',
      exampleSentence: 'من کمی دری میفهمم',
      groupId: 4
    },
    {
      id: 31,
      dariWord: 'من گرسنه استم',
      pronunciation: 'man goresna astam',
      englishTranslation: 'I am hungry',
      exampleSentence: 'من گرسنه استم، بیا نان بخوریم',
      groupId: 4
    },
    {
      id: 32,
      dariWord: 'من تشنه استم',
      pronunciation: 'man teshna astam',
      englishTranslation: 'I am thirsty',
      exampleSentence: 'من تشنه استم، لطفاً آب بیاورید',
      groupId: 4
    },
    {
      id: 33,
      dariWord: 'بسیار خوب',
      pronunciation: 'besyār khob',
      englishTranslation: 'Very good',
      exampleSentence: 'کار شما بسیار خوب است',
      groupId: 4
    },
    {
      id: 34,
      dariWord: 'لطفاً آهسته صحبت کنید',
      pronunciation: 'lutfan āhesta sohbat konid',
      englishTranslation: 'Please speak slowly',
      exampleSentence: 'لطفاً آهسته صحبت کنید، من تازه دری یاد میگیرم',
      groupId: 4
    }
  ],
  groups: [
    {
      id: 1,
      name: 'Numbers',
      description: 'Basic numbers from 1-20',
      wordCount: 20
    },
    {
      id: 2,
      name: 'Family Members',
      description: 'Common family relations',
      wordCount: 10
    },
    {
      id: 3,
      name: 'Basic Phrases',
      description: 'Essential everyday phrases',
      wordCount: 8
    },
    {
      id: 4,
      name: 'Common Phrases',
      description: 'Frequently used expressions',
      wordCount: 10
    }
  ],
  dashboard: {
    lastStudySession: {
      id: 1,
      groupId: 1,
      groupName: 'Common Phrases',
      startTime: new Date(Date.now() - 86400000).toISOString(),
      endTime: new Date(Date.now() - 85800000).toISOString(),
      score: 100,
      correctCount: 10,
      incorrectCount: 0
    },
    progress: {
      totalWords: 48,
      masteredWords: 35,
      masteryProgress: 48
    },
    stats: {
      totalWords: 48,
      masteredWords: 35,
      totalGroups: 4,
      activeGroups: 4,
      totalSessions: 3,
      successRate: 48,
      studyStreak: 1,
      averageScore: 75
    },
    recentSessions: [
      {
        id: 1,
        groupId: 1,
        groupName: 'Numbers',
        startTime: new Date(Date.now() - 86400000).toISOString(),
        endTime: new Date(Date.now() - 85800000).toISOString(),
        score: 85,
        correctCount: 17,
        incorrectCount: 3,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 2,
        groupId: 2,
        groupName: 'Family Members',
        startTime: new Date(Date.now() - 172800000).toISOString(),
        endTime: new Date(Date.now() - 172600000).toISOString(),
        score: 90,
        correctCount: 9,
        incorrectCount: 1,
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 3,
        groupId: 3,
        groupName: 'Basic Phrases',
        startTime: new Date(Date.now() - 259200000).toISOString(),
        endTime: new Date(Date.now() - 259000000).toISOString(),
        score: 75,
        correctCount: 6,
        incorrectCount: 2,
        createdAt: new Date(Date.now() - 259200000).toISOString()
      }
    ],
    recentWords: [
      {
        id: 1,
        dariWord: 'یک',
        pronunciation: 'yak',
        englishTranslation: 'One',
        exampleSentence: 'من یک کتاب دارم',
        groupId: 1
      },
      {
        id: 2,
        dariWord: 'دو',
        pronunciation: 'do',
        englishTranslation: 'Two',
        exampleSentence: 'دو نفر آمدند',
        groupId: 1
      },
      {
        id: 3,
        dariWord: 'سه',
        pronunciation: 'se',
        englishTranslation: 'Three',
        exampleSentence: 'سه ساعت گذشت',
        groupId: 1
      },
      {
        id: 4,
        dariWord: 'چهار',
        pronunciation: 'chahār',
        englishTranslation: 'Four',
        exampleSentence: 'چهار روز باقی مانده',
        groupId: 1
      }
    ]
  }
};

// State to store study sessions and word masteries
let studySessions = [
  {
    id: 1,
    groupId: 1,
    groupName: 'Numbers',
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 85800000).toISOString(),
    score: 85,
    correctCount: 17,
    incorrectCount: 3,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    groupId: 2,
    groupName: 'Family Members',
    startTime: new Date(Date.now() - 172800000).toISOString(),
    endTime: new Date(Date.now() - 172600000).toISOString(),
    score: 90,
    correctCount: 9,
    incorrectCount: 1,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 3,
    groupId: 3,
    groupName: 'Basic Phrases',
    startTime: new Date(Date.now() - 259200000).toISOString(),
    endTime: new Date(Date.now() - 259000000).toISOString(),
    score: 75,
    correctCount: 6,
    incorrectCount: 2,
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
];

// Track word mastery
let wordMasteries = {};

// Helper function to update dashboard
function updateDashboard() {
  // Update last study session
  if (studySessions.length > 0) {
    // Sort sessions by date (newest first)
    const sortedSessions = [...studySessions].sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    
    mockData.dashboard.lastStudySession = sortedSessions[0];
    
    // Update recent sessions (up to 5)
    mockData.dashboard.recentSessions = sortedSessions.slice(0, 5);
  }
  
  // Count mastered words
  const masteredWordsCount = Object.values(wordMasteries).filter(value => value >= 3).length;
  
  // Update progress
  mockData.dashboard.progress = {
    totalWords: mockData.words.length,
    masteredWords: masteredWordsCount,
    masteryProgress: Math.round((masteredWordsCount / mockData.words.length) * 100)
  };
  
  // Calculate success rate from all sessions
  const totalCorrect = studySessions.reduce((sum, session) => sum + session.correctCount, 0);
  const totalReviews = studySessions.reduce((sum, session) => sum + session.correctCount + session.incorrectCount, 0);
  const successRate = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;
  
  // Update stats
  mockData.dashboard.stats = {
    totalWords: mockData.words.length,
    masteredWords: masteredWordsCount,
    totalGroups: mockData.groups.length,
    activeGroups: studySessions.length > 0 ? 
      [...new Set(studySessions.map(session => session.groupId))].length : 0,
    totalSessions: studySessions.length,
    successRate: successRate,
    studyStreak: calculateStudyStreak(),
    averageScore: calculateAverageScore()
  };
}

// Helper function to calculate study streak
function calculateStudyStreak() {
  if (studySessions.length === 0) return 0;
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...studySessions].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
  
  // Check if there's a session today
  const today = new Date().setHours(0, 0, 0, 0);
  const latestSessionDate = new Date(sortedSessions[0].startTime).setHours(0, 0, 0, 0);
  
  // If no session today, no streak
  if (latestSessionDate < today) return 0;
  
  // Count consecutive days
  let streak = 1;
  let currentDay = today - 86400000; // yesterday
  
  for (let i = 1; i < sortedSessions.length; i++) {
    const sessionDay = new Date(sortedSessions[i].startTime).setHours(0, 0, 0, 0);
    
    if (sessionDay === currentDay) {
      currentDay -= 86400000; // go back one more day
    } else if (sessionDay < currentDay) {
      // Gap in streak
      break;
    }
  }
  
  return streak;
}

// Helper function to calculate average score
function calculateAverageScore() {
  if (studySessions.length === 0) return 0;
  
  // Only consider sessions with scores
  const sessionsWithScores = studySessions.filter(s => s.score !== undefined);
  if (sessionsWithScores.length === 0) return 0;
  
  const totalScore = sessionsWithScores.reduce((sum, session) => sum + session.score, 0);
  return Math.round(totalScore / sessionsWithScores.length);
}

// API Routes
app.get('/api/words', (_req, res) => {
  res.json(mockData.words);
});

app.get('/api/groups', (_req, res) => {
  res.json(mockData.groups);
});

app.get('/api/groups/:id/words', (req, res) => {
  const groupId = parseInt(req.params.id);
  const words = mockData.words.filter(word => word.groupId === groupId);
  res.json(words);
});

app.get('/api/dashboard', (_req, res) => {
  // Update dashboard before sending
  updateDashboard();
  res.json(mockData.dashboard);
});

app.post('/api/study-sessions', (req, res) => {
  const { groupId = 1 } = req.body;
  
  // Find group name
  const group = mockData.groups.find(g => g.id === groupId) || { name: 'Unknown Group' };
  
  const newSession = {
    id: studySessions.length + 1,
    groupId,
    groupName: group.name,
    startTime: new Date().toISOString(),
    endTime: null,
    score: null,
    correctCount: 0,
    incorrectCount: 0,
    createdAt: new Date().toISOString()
  };
  
  studySessions.push(newSession);
  
  // Update dashboard
  updateDashboard();
  
  res.json(newSession);
});

// Update study session
app.put('/api/study-sessions/:id', (req, res) => {
  const sessionId = parseInt(req.params.id);
  const { correctCount, incorrectCount, endTime } = req.body;
  
  const sessionIndex = studySessions.findIndex(s => s.id === sessionId);
  if (sessionIndex === -1) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  // Update session
  studySessions[sessionIndex] = {
    ...studySessions[sessionIndex],
    correctCount: correctCount || studySessions[sessionIndex].correctCount,
    incorrectCount: incorrectCount || studySessions[sessionIndex].incorrectCount,
    endTime: endTime || new Date().toISOString()
  };
  
  // Calculate score
  const totalAnswers = studySessions[sessionIndex].correctCount + studySessions[sessionIndex].incorrectCount;
  if (totalAnswers > 0) {
    studySessions[sessionIndex].score = Math.round(
      (studySessions[sessionIndex].correctCount / totalAnswers) * 100
    );
  }
  
  // Update dashboard
  updateDashboard();
  
  res.json(studySessions[sessionIndex]);
});

app.get('/api/study_sessions', (_req, res) => {
  res.json(studySessions);
});

app.post('/api/word-reviews', (req, res) => {
  const { wordId, correct } = req.body;
  
  // Find the word
  const word = mockData.words.find(w => w.id === wordId);
  if (!word) {
    return res.status(404).json({ error: 'Word not found' });
  }
  
  // Initialize mastery level if not exists
  if (!wordMasteries[wordId]) {
    wordMasteries[wordId] = 0;
  }
  
  // Update mastery level
  if (correct) {
    wordMasteries[wordId] = Math.min(5, wordMasteries[wordId] + 1);
  } else {
    wordMasteries[wordId] = Math.max(0, wordMasteries[wordId] - 1);
  }
  
  // Add to recent words (at the beginning)
  mockData.dashboard.recentWords = [word, ...mockData.dashboard.recentWords].slice(0, 5);
  
  // Update dashboard
  updateDashboard();
  
  res.json({ 
    success: true, 
    masteryLevel: wordMasteries[wordId] 
  });
});

// Reset study history endpoint
app.post('/api/reset_history', (_req, res) => {
  try {
    // Clear study sessions
    studySessions = [];
    
    // Reset dashboard stats related to study sessions
    mockData.dashboard.lastStudySession = null;
    mockData.dashboard.recentSessions = [];
    mockData.dashboard.stats.totalSessions = 0;
    mockData.dashboard.stats.studyStreak = 0;
    mockData.dashboard.stats.successRate = 0;
    
    // Update dashboard
    updateDashboard();
    
    res.json({ success: true, message: "Study history reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reset study history" });
  }
});

// Full reset endpoint
app.post('/api/full_reset', (_req, res) => {
  try {
    // Clear study sessions and masteries
    studySessions = [];
    wordMasteries = {};
    
    // Reset dashboard
    mockData.dashboard.lastStudySession = null;
    mockData.dashboard.recentSessions = [];
    mockData.dashboard.recentWords = [];
    
    // Update dashboard
    updateDashboard();
    
    res.json({ success: true, message: "Full system reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to perform full reset" });
  }
});

// Serve index.html for all other routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize dashboard on startup
updateDashboard();

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 