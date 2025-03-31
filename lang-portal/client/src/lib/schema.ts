export interface Word {
  id: number;
  dariWord: string;
  pronunciation: string;
  englishTranslation: string;
  exampleSentence: string;
  groupId: number;
}

export interface WordGroup {
  id: number;
  name: string;
  description: string;
}

export interface GroupWithCount extends WordGroup {
  wordCount: number;
}

export interface WordReview {
  id: number;
  wordId: number;
  studySessionId: number;
  correct: boolean;
  createdAt: string;
}

export interface StudySession {
  id: number;
  groupId: number;
  groupName: string;
  startTime: string;
  endTime?: string;
  score?: number;
  correctCount: number;
  incorrectCount: number;
  createdAt: string;
}

export interface LastStudySession {
  id: number;
  groupId: number;
  groupName: string;
  startTime: string;
  endTime?: string;
  score?: number;
  correctCount: number;
  incorrectCount: number;
}

export interface Progress {
  totalWords: number;
  masteredWords: number;
  masteryProgress: number;
}

export interface Stats {
  totalWords: number;
  masteredWords: number;
  totalGroups: number;
  activeGroups: number;
  totalSessions: number;
  successRate: number;
  studyStreak: number;
}

export interface Dashboard {
  lastStudySession?: LastStudySession;
  progress: Progress;
  stats: Stats;
  recentSessions: StudySession[];
  recentWords: Word[];
} 