import { db } from './db.js';
import { Word, Group, StudySession, WordReview, Dashboard, LastStudySession, Progress, Stats } from './shared/schema.js';

export class Storage {
  async createWord(word: Omit<Word, 'id'>): Promise<Word> {
    const result = await db.run(
      'INSERT INTO words (dariWord, englishTranslation, pronunciation, exampleSentence) VALUES (?, ?, ?, ?)',
      [word.dariWord, word.englishTranslation, word.pronunciation, word.exampleSentence]
    );
    return { ...word, id: result.lastID };
  }

  async getWord(id: number): Promise<Word | null> {
    return await db.get('SELECT * FROM words WHERE id = ?', [id]);
  }

  async getAllWords(): Promise<Word[]> {
    return await db.all('SELECT * FROM words');
  }

  async createGroup(group: Omit<Group, 'id'>): Promise<Group> {
    const result = await db.run(
      'INSERT INTO groups (name, description) VALUES (?, ?)',
      [group.name, group.description]
    );
    const groupId = result.lastID;

    // Add words to the group
    for (const wordId of group.words) {
      await db.run(
        'INSERT INTO words_to_groups (wordId, groupId) VALUES (?, ?)',
        [wordId, groupId]
      );
    }

    return { ...group, id: groupId };
  }

  async getGroup(id: number): Promise<Group | null> {
    const group = await db.get('SELECT * FROM groups WHERE id = ?', [id]);
    if (!group) return null;

    const words = await db.all(
      'SELECT wordId FROM words_to_groups WHERE groupId = ?',
      [id]
    );
    return { ...group, words: words.map(w => w.wordId) };
  }

  async getAllGroups(): Promise<Group[]> {
    const groups = await db.all('SELECT * FROM groups');
    const result: Group[] = [];

    for (const group of groups) {
      const words = await db.all(
        'SELECT wordId FROM words_to_groups WHERE groupId = ?',
        [group.id]
      );
      result.push({ ...group, words: words.map(w => w.wordId) });
    }

    return result;
  }

  async createStudySession(session: Omit<StudySession, 'id'>): Promise<StudySession> {
    const result = await db.run(
      'INSERT INTO study_sessions (groupId, date, completed) VALUES (?, ?, ?)',
      [session.groupId, session.date, session.completed]
    );
    const sessionId = result.lastID;

    // Add reviews
    for (const review of session.reviews) {
      await db.run(
        'INSERT INTO word_reviews (wordId, sessionId, correct, createdAt) VALUES (?, ?, ?, ?)',
        [review.wordId, sessionId, review.correct, review.createdAt]
      );
    }

    return { ...session, id: sessionId };
  }

  async getStudySession(id: number): Promise<StudySession | null> {
    const session = await db.get('SELECT * FROM study_sessions WHERE id = ?', [id]);
    if (!session) return null;

    const reviews = await db.all(
      'SELECT * FROM word_reviews WHERE sessionId = ?',
      [id]
    );

    return { ...session, reviews };
  }

  async getDashboard(): Promise<Dashboard> {
    // Get last study session
    const lastSession = await db.get(`
      SELECT 
        ss.id,
        g.name,
        COUNT(CASE WHEN wr.correct = 1 THEN 1 END) as correct,
        COUNT(CASE WHEN wr.correct = 0 THEN 1 END) as wrong,
        ss.date
      FROM study_sessions ss
      JOIN groups g ON g.id = ss.groupId
      LEFT JOIN word_reviews wr ON wr.sessionId = ss.id
      GROUP BY ss.id
      ORDER BY ss.date DESC
      LIMIT 1
    `);

    // Get progress stats
    const progress = await db.get(`
      SELECT 
        COUNT(DISTINCT w.id) as totalWords,
        COUNT(DISTINCT wr.wordId) as studiedWords,
        ROUND(AVG(CASE WHEN wr.correct = 1 THEN 100 ELSE 0 END)) as masteryProgress
      FROM words w
      LEFT JOIN word_reviews wr ON wr.wordId = w.id
    `);

    // Get general stats
    const stats = await db.get(`
      SELECT 
        ROUND(AVG(CASE WHEN wr.correct = 1 THEN 100 ELSE 0 END)) as successRate,
        COUNT(DISTINCT ss.id) as studySessions,
        COUNT(DISTINCT g.id) as activeGroups,
        '1 days' as studyStreak
      FROM study_sessions ss
      JOIN groups g ON g.id = ss.groupId
      LEFT JOIN word_reviews wr ON wr.sessionId = ss.id
    `);

    return {
      lastStudySession: lastSession as LastStudySession,
      progress: progress as Progress,
      stats: stats as Stats
    };
  }
}

export const storage = new Storage();

// Remove these exports as they're not defined
export { db };