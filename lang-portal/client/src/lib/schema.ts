export interface Word {
  id: number;
  dariWord: string;
  pronunciation: string;
  englishTranslation: string;
  exampleSentence?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupWithCount extends Group {
  wordCount: number;
}

export interface WordReview {
  id: number;
  wordId: number;
  userId: number;
  correct: boolean;
  createdAt: string;
}

export interface StudySession {
  id: number;
  userId: number;
  groupId: number;
  startTime: string;
  endTime?: string;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LastStudySession {
  id: number;
  groupId: number;
  startTime: string;
  endTime?: string;
  score?: number;
}

export interface Progress {
  groupId: number;
  totalWords: number;
  masteredWords: number;
  lastStudySession?: LastStudySession;
}

export interface Stats {
  totalWords: number;
  totalGroups: number;
  totalSessions: number;
  averageScore: number;
  progress: Progress[];
}

export interface Dashboard {
  stats: Stats;
  recentSessions: StudySession[];
  recentWords: Word[];
}

export type WordGroup = Group; 