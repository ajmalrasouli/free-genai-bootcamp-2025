import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('sqlite.db');

export interface Word {
  id: number;
  dari_word: string;
  english_translation: string;
  pronunciation: string;
  example_sentence: string;
}

export interface WordGroup {
  id: number;
  name: string;
}

export interface StudySession {
  id: number;
  group_id: number;
  created_at: string;
}

export interface WordReviewItem {
  id: number;
  word_id: number;
  study_session_id: number;
  correct: boolean;
  created_at: string;
}

// Word operations
export const getWords = () => {
  const words = db.prepare('SELECT * FROM words').all() as Word[];
  console.log('Retrieved words:', words);
  return words;
};

export const getWordById = (id: number) => {
  return db.prepare('SELECT * FROM words WHERE id = ?').get(id) as Word;
};

export const createWord = (word: Omit<Word, 'id'>) => {
  const stmt = db.prepare(`
    INSERT INTO words (dari_word, english_translation, pronunciation, example_sentence)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(
    word.dari_word,
    word.english_translation,
    word.pronunciation,
    word.example_sentence
  );
  return { ...word, id: result.lastInsertRowid as number };
};

// Word Group operations
export const getWordGroups = () => {
  return db.prepare('SELECT * FROM word_groups').all() as WordGroup[];
};

export const createWordGroup = (name: string) => {
  const stmt = db.prepare('INSERT INTO word_groups (name) VALUES (?)');
  const result = stmt.run(name);
  return { id: result.lastInsertRowid as number, name };
};

export const getWordsByGroup = (groupId: number) => {
  const words = db.prepare(`
    SELECT w.* 
    FROM words w
    JOIN words_to_groups wtg ON w.id = wtg.word_id
    WHERE wtg.group_id = ?
  `).all(groupId) as Word[];
  console.log('Retrieved words for group:', groupId, words);
  return words;
};

export const addWordToGroup = (wordId: number, groupId: number) => {
  const stmt = db.prepare(`
    INSERT INTO words_to_groups (word_id, group_id)
    VALUES (?, ?)
  `);
  return stmt.run(wordId, groupId);
};

// Study Session operations
export const createStudySession = (groupId: number | null) => {
  const stmt = db.prepare(`
    INSERT INTO study_sessions (group_id, created_at)
    VALUES (?, datetime('now'))
  `);
  const result = stmt.run(groupId);
  
  return {
    id: result.lastInsertRowid as number,
    group_id: groupId,
    created_at: new Date().toISOString()
  };
};

export const getStudySessions = () => {
  return db.prepare(`
    SELECT * FROM study_sessions
    ORDER BY created_at DESC
  `).all() as StudySession[];
};

// Word Review operations
export const createWordReview = (wordId: number, studySessionId: number, correct: boolean) => {
  const stmt = db.prepare(`
    INSERT INTO word_review_items (word_id, study_session_id, correct)
    VALUES (?, ?, ?)
  `);
  const result = stmt.run(wordId, studySessionId, correct);
  return {
    id: result.lastInsertRowid as number,
    word_id: wordId,
    study_session_id: studySessionId,
    correct,
    created_at: new Date().toISOString()
  };
};

export const getWordReviews = (wordId: number) => {
  return db.prepare(`
    SELECT * FROM word_review_items
    WHERE word_id = ?
    ORDER BY created_at DESC
  `).all(wordId) as WordReviewItem[];
};

export const getStudySessionReviews = (sessionId: number) => {
  return db.prepare(`
    SELECT 
      wri.*,
      w.dari_word,
      w.english_translation
    FROM word_review_items wri
    JOIN words w ON w.id = wri.word_id
    WHERE wri.study_session_id = ?
    ORDER BY wri.created_at DESC
  `).all(sessionId);
};

// Statistics and Analytics
export const getWordStats = (wordId: number) => {
  return db.prepare(`
    SELECT 
      COUNT(*) as total_reviews,
      SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) as correct_reviews
    FROM word_review_items
    WHERE word_id = ?
  `).get(wordId);
};

export const getGroupStats = (groupId: number) => {
  return db.prepare(`
    SELECT 
      COUNT(DISTINCT ss.id) as total_sessions,
      COUNT(DISTINCT wri.id) as total_reviews,
      SUM(CASE WHEN wri.correct = 1 THEN 1 ELSE 0 END) as correct_reviews
    FROM study_sessions ss
    LEFT JOIN word_review_items wri ON wri.study_session_id = ss.id
    WHERE ss.group_id = ?
  `).get(groupId);
};

export default db; 