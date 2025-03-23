import { db } from './db';
import type {
  Word,
  WordGroup,
  WordsToGroups,
  StudySession,
  WordReviewItem,
  InsertWord,
  InsertWordGroup,
  InsertWordsToGroups,
  InsertStudySession,
  InsertWordReview
} from '@shared/schema';

class Storage {
  async getWords(): Promise<Word[]> {
    return db.prepare('SELECT * FROM words').all() as Word[];
  }

  async getWord(id: number): Promise<Word | undefined> {
    return db.prepare('SELECT * FROM words WHERE id = ?').get(id) as Word | undefined;
  }

  async getGroups(): Promise<WordGroup[]> {
    return db.prepare(`
      SELECT 
        wg.*,
        COUNT(wtg.word_id) as word_count
      FROM word_groups wg
      LEFT JOIN words_to_groups wtg ON wg.id = wtg.group_id
      GROUP BY wg.id
    `).all() as WordGroup[];
  }

  async getGroup(id: number): Promise<WordGroup | undefined> {
    return db.prepare('SELECT * FROM word_groups WHERE id = ?').get(id) as WordGroup | undefined;
  }

  async getGroupWords(groupId: number): Promise<Word[]> {
    return db.prepare(`
      SELECT w.* 
      FROM words w
      JOIN words_to_groups wtg ON w.id = wtg.word_id
      WHERE wtg.group_id = ?
    `).all(groupId) as Word[];
  }

  async createWord(word: InsertWord): Promise<Word> {
    const result = db.prepare(`
      INSERT INTO words (dari_word, english_translation, pronunciation, example_sentence)
      VALUES (?, ?, ?, ?)
    `).run(
      word.dari_word,
      word.english_translation,
      word.pronunciation,
      word.example_sentence
    );

    return {
      id: Number(result.lastInsertRowid),
      ...word
    };
  }

  async createGroup(group: InsertWordGroup): Promise<WordGroup> {
    const result = db.prepare('INSERT INTO word_groups (name) VALUES (?)').run(group.name);
    return {
      id: Number(result.lastInsertRowid),
      ...group
    };
  }

  async addWordToGroup(wordId: number, groupId: number): Promise<void> {
    await db.prepare(`
      INSERT INTO words_to_groups (word_id, group_id)
      VALUES (?, ?)
    `).run(wordId, groupId);
  }

  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const result = db.prepare(`
      INSERT INTO study_sessions (group_id)
      VALUES (?)
    `).run(session.group_id);

    return {
      id: Number(result.lastInsertRowid),
      ...session,
      created_at: new Date().toISOString()
    };
  }

  async getStudySessions(): Promise<StudySession[]> {
    return db.prepare('SELECT * FROM study_sessions ORDER BY created_at DESC').all() as StudySession[];
  }

  async getWordReviews(sessionId: number): Promise<WordReviewItem[]> {
    return db.prepare(`
      SELECT * FROM word_review_items 
      WHERE study_session_id = ?
      ORDER BY created_at DESC
    `).all(sessionId) as WordReviewItem[];
  }

  async createWordReview(review: InsertWordReview): Promise<WordReviewItem> {
    const result = db.prepare(`
      INSERT INTO word_review_items (word_id, study_session_id, correct)
      VALUES (?, ?, ?)
    `).run(review.word_id, review.study_session_id, review.correct);

    return {
      id: Number(result.lastInsertRowid),
      ...review,
      created_at: new Date().toISOString()
    };
  }

  async getWordStats(wordId: number): Promise<{ correct: number; incorrect: number }> {
    const result = db.prepare(`
      SELECT 
        COALESCE(SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END), 0) as correct,
        COALESCE(SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END), 0) as incorrect
      FROM word_review_items
      WHERE word_id = ?
    `).get(wordId) as { correct: number; incorrect: number };

    return {
      correct: result.correct,
      incorrect: result.incorrect
    };
  }

  async resetHistory(): Promise<void> {
    db.prepare('DELETE FROM word_review_items').run();
    db.prepare('DELETE FROM study_sessions').run();
  }

  async resetAll(): Promise<void> {
    db.prepare('DELETE FROM word_review_items').run();
    db.prepare('DELETE FROM study_sessions').run();
    db.prepare('DELETE FROM words_to_groups').run();
    db.prepare('DELETE FROM words').run();
    db.prepare('DELETE FROM word_groups').run();
  }
}

export const storage = new Storage();

// Remove these exports as they're not defined
export { db };