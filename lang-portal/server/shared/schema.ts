// Basic shared type declarations for client and server
export interface Word {
  id: number;
  dariWord: string;
  englishTranslation: string;
  pronunciation: string;
  exampleSentence: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  words: number[];
}

export interface GroupWithCount extends Group {
  wordCount: number;
}

export interface WordReview {
  id: number;
  wordId: number;
  sessionId: number;
  correct: boolean;
  createdAt: string;
}

export interface StudySession {
  id: number;
  groupId: number;
  date: string;
  completed: boolean;
  reviews: WordReview[];
}

export interface WordWithReview extends Word {
  review?: {
    rating: number;
    notes?: string;
  };
}

export interface LastStudySession {
  id: number;
  name: string;
  correct: number;
  wrong: number;
  date: string;
}

export interface Progress {
  totalWords: number;
  studiedWords: number;
  masteryProgress: number;
}

export interface Stats {
  successRate: number;
  studySessions: number;
  activeGroups: number;
  studyStreak: string;
}

export interface Dashboard {
  lastStudySession: LastStudySession;
  progress: Progress;
  stats: Stats;
} 