// Basic shared type declarations for client and server
export interface Word {
  id: number;
  dariWord: string;
  englishTranslation: string;
  pronunciation?: string;
  partOfSpeech?: string;
  example?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  words: number[];
}

export interface GroupWithCount extends Group {
  wordCount: number;
}

export interface StudySession {
  id: number;
  groupId: number;
  date: string;
  completed: boolean;
  reviews?: WordReview[];
}

export interface WordReview {
  wordId: number;
  rating: number;
  notes?: string;
}

export interface WordWithReview extends Word {
  review?: {
    rating: number;
    notes?: string;
  };
}

export interface Dashboard {
  lastStudySession: {
    id: number;
    name: string;
    correct: number;
    wrong: number;
    date: string;
  };
  progress: {
    totalWords: number;
    studiedWords: number;
    masteryProgress: number;
  };
  stats: {
    successRate: number;
    studySessions: number;
    activeGroups: number;
    studyStreak: string;
  };
} 