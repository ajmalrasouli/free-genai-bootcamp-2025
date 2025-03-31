import type { Word, WordGroup, StudySession, Dashboard } from './shared/schema.js';

export const mockWords: Word[] = [
  {
    id: 1,
    dariWord: 'سلام',
    pronunciation: 'salām',
    englishTranslation: 'hello',
    exampleSentence: 'سلام، چطور هستی؟',
    groupId: 1
  },
  {
    id: 2,
    dariWord: 'خداحافظ',
    pronunciation: 'khodāhāfez',
    englishTranslation: 'goodbye',
    exampleSentence: 'خداحافظ، فردا می‌بینمت.',
    groupId: 1
  },
  {
    id: 3,
    dariWord: 'متشکرم',
    pronunciation: 'moteshakkeram',
    englishTranslation: 'thank you',
    exampleSentence: 'متشکرم برای کمکت.',
    groupId: 1
  },
  {
    id: 4,
    dariWord: 'آب',
    pronunciation: 'āb',
    englishTranslation: 'water',
    exampleSentence: 'آب خنک است.',
    groupId: 2
  },
  {
    id: 5,
    dariWord: 'نان',
    pronunciation: 'nān',
    englishTranslation: 'bread',
    exampleSentence: 'نان تازه است.',
    groupId: 2
  }
];

export const mockGroups: WordGroup[] = [
  {
    id: 1,
    name: 'Basic Greetings',
    description: 'Common greetings and expressions'
  },
  {
    id: 2,
    name: 'Food and Drink',
    description: 'Essential food and drink vocabulary'
  }
];

export const mockSessions: StudySession[] = [
  {
    id: 1,
    groupId: 1,
    groupName: 'Basic Greetings',
    startTime: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    endTime: new Date(Date.now() - 85800000).toISOString(), // 23.5 hours ago
    score: 75,
    correctCount: 3,
    incorrectCount: 1,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const mockDashboard: Dashboard = {
  lastStudySession: {
    id: 1,
    groupId: 1,
    groupName: 'Basic Greetings',
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 85800000).toISOString(),
    score: 75,
    correctCount: 3,
    incorrectCount: 1
  },
  progress: {
    totalWords: mockWords.length,
    masteredWords: 3,
    masteryProgress: 60
  },
  stats: {
    totalWords: mockWords.length,
    masteredWords: 3,
    totalGroups: mockGroups.length,
    activeGroups: 2,
    totalSessions: 1,
    successRate: 75,
    studyStreak: 1,
    averageScore: 75
  },
  recentSessions: mockSessions,
  recentWords: mockWords.slice(0, 3)
}; 