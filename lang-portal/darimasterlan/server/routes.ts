import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWordSchema, insertWordGroupSchema, insertStudySessionSchema, insertWordReviewSchema, insertWordsToGroupsSchema } from "@shared/schema";
import { db } from "./db";

export function registerRoutes(app: Express): Server {
  // Words
  app.get("/api/words", (_req, res) => {
    try {
      const words = db.prepare(`
        SELECT 
          w.*,
          COALESCE(r.correct_count, 0) as correct,
          COALESCE(r.incorrect_count, 0) as wrong
        FROM words w
        LEFT JOIN (
          SELECT 
            word_id,
            SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) as correct_count,
            SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) as incorrect_count
          FROM word_review_items
          GROUP BY word_id
        ) r ON w.id = r.word_id
      `).all();
      
      res.json(words);
    } catch (error) {
      console.error('Error fetching words:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get("/api/words/:id", (req, res) => {
    try {
      const word = db.prepare('SELECT * FROM words WHERE id = ?').get(req.params.id);
      if (!word) {
        return res.status(404).json({ error: 'Word not found' });
      }
      res.json(word);
    } catch (error) {
      console.error('Error fetching word:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post("/api/words", (req, res) => {
    try {
      const { dariWord, englishTranslation, pronunciation, exampleSentence } = req.body;
      const result = db.prepare(`
        INSERT INTO words (dari_word, english_translation, pronunciation, example_sentence)
        VALUES (?, ?, ?, ?)
      `).run(dariWord, englishTranslation, pronunciation, exampleSentence);
      
      res.status(201).json({
        id: result.lastInsertRowid,
        dariWord,
        englishTranslation,
        pronunciation,
        exampleSentence
      });
    } catch (error) {
      console.error('Error creating word:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Groups
  app.get("/api/groups", (_req, res) => {
    try {
      const groups = db.prepare(`
        SELECT 
          wg.*,
          COUNT(wtg.word_id) as word_count
        FROM word_groups wg
        LEFT JOIN words_to_groups wtg ON wg.id = wtg.group_id
        GROUP BY wg.id
      `).all();
      res.json(groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get("/api/groups/:id", (req, res) => {
    try {
      const group = db.prepare('SELECT * FROM word_groups WHERE id = ?').get(req.params.id);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
      res.json(group);
    } catch (error) {
      console.error('Error fetching group:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post("/api/groups", async (req, res) => {
    const parsed = insertWordGroupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const group = await storage.createGroup(parsed.data);
    res.json(group);
  });

  // Words in Groups
  app.get("/api/groups/:id/words", (req, res) => {
    try {
      const words = db.prepare(`
        SELECT w.* 
        FROM words w
        JOIN words_to_groups wtg ON w.id = wtg.word_id
        WHERE wtg.group_id = ?
      `).all(req.params.id);
      res.json(words);
    } catch (error) {
      console.error('Error fetching group words:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post("/api/groups/:groupId/words/:wordId", async (req, res) => {
    const parsed = insertWordsToGroupsSchema.safeParse({
      group_id: parseInt(req.params.groupId),
      word_id: parseInt(req.params.wordId)
    });
    if (!parsed.success) return res.status(400).json(parsed.error);
    const relation = await storage.addWordToGroup(parsed.data);
    res.json(relation);
  });

  // Study Sessions
  app.get("/api/study_sessions", (_req, res) => {
    try {
      const sessions = db.prepare(`
        SELECT 
          ss.id,
          ss.created_at,
          wg.name as group_name,
          COUNT(DISTINCT wri.word_id) as words_studied,
          ROUND(
            (SUM(CASE WHEN wri.correct = 1 THEN 1 ELSE 0 END) * 100.0) / 
            COUNT(wri.id)
          ) as success_rate
        FROM study_sessions ss
        LEFT JOIN word_groups wg ON ss.group_id = wg.id
        LEFT JOIN word_review_items wri ON ss.id = wri.study_session_id
        GROUP BY ss.id, ss.created_at, wg.name
        ORDER BY ss.created_at DESC
      `).all();

      res.json(sessions);
    } catch (error) {
      console.error('Error fetching study sessions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get("/api/study_sessions/:id", async (req, res) => {
    const session = await storage.getStudySession(parseInt(req.params.id));
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  });

  app.post("/api/study_sessions", (req, res) => {
    try {
      const { group_id } = req.body;
      const result = db.prepare(`
        INSERT INTO study_sessions (group_id, created_at)
        VALUES (?, datetime('now', 'localtime'))
      `).run(group_id);

      const session = {
        id: result.lastInsertRowid,
        group_id,
        created_at: new Date().toISOString()
      };

      res.status(201).json(session);
    } catch (error) {
      console.error('Error creating study session:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Study Session Words
  app.get("/api/study_sessions/:id/words", async (req, res) => {
    const sessionId = parseInt(req.params.id);
    const session = await storage.getStudySession(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const groupWords = await storage.getGroupWords(session.group_id!);
    const reviews = await storage.getWordReviews(sessionId);

    const wordsWithReviews = groupWords.map(word => {
      const review = reviews.find(r => r.word_id === word.id);
      return {
        ...word,
        review: review || null
      };
    });

    res.json(wordsWithReviews);
  });

  // Word Reviews
  app.post("/api/word_reviews", (req, res) => {
    try {
      const { word_id, study_session_id, correct } = req.body;
      const result = db.prepare(`
        INSERT INTO word_review_items (word_id, study_session_id, correct, created_at)
        VALUES (?, ?, ?, datetime('now', 'localtime'))
      `).run(word_id, study_session_id, correct ? 1 : 0);

      res.status(201).json({
        id: result.lastInsertRowid,
        word_id,
        study_session_id,
        correct,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating word review:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Stats
  app.get("/api/words/:id/stats", async (req, res) => {
    const stats = await storage.getWordStats(parseInt(req.params.id));
    res.json(stats);
  });

  // Add new dashboard routes
  app.get("/api/dashboard/last_study_session", (_req, res) => {
    try {
      const lastSession = db.prepare(`
        SELECT 
          ss.id,
          ss.created_at,
          wg.name as groupName,
          COUNT(wri.id) as total,
          SUM(CASE WHEN wri.correct = 1 THEN 1 ELSE 0 END) as correct
        FROM study_sessions ss
        LEFT JOIN word_groups wg ON ss.group_id = wg.id
        LEFT JOIN word_review_items wri ON ss.id = wri.study_session_id
        GROUP BY ss.id
        ORDER BY ss.created_at DESC
        LIMIT 1
      `).get() as {
        id: number;
        created_at: string;
        groupName: string;
        total: number;
        correct: number;
      } | undefined;

      if (!lastSession) {
        return res.json(null);
      }

      res.json({
        groupName: lastSession.groupName,
        date: lastSession.created_at,
        correct: lastSession.correct,
        total: lastSession.total
      });
    } catch (error) {
      console.error('Error fetching last study session:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get("/api/dashboard/study_progress", (_req, res) => {
    try {
      const totalWords = db.prepare('SELECT COUNT(*) as count FROM words').get() as { count: number };
      
      const studiedWords = db.prepare(`
        SELECT COUNT(DISTINCT word_id) as count 
        FROM word_review_items
      `).get() as { count: number };

      const reviews = db.prepare(`
        SELECT correct 
        FROM word_review_items
      `).all() as { correct: number }[];

      const totalReviews = reviews.length;
      const correctReviews = reviews.filter(r => r.correct).length;
      
      const mastery = totalReviews > 0
        ? Math.round((correctReviews / totalReviews) * 100)
        : 0;

      res.json({
        totalWords: totalWords.count,
        totalStudied: studiedWords.count,
        mastery
      });
    } catch (error) {
      console.error('Error fetching study progress:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get("/api/dashboard/quick-stats", (_req, res) => {
    try {
      const studySessions = db.prepare('SELECT * FROM study_sessions').all();
      const groups = db.prepare('SELECT * FROM word_groups').all();
      
      // Calculate success rate
      const reviews = db.prepare(`
        SELECT correct 
        FROM word_review_items
        WHERE created_at >= date('now', '-30 days')
      `).all() as { correct: number }[];

      const totalReviews = reviews.length;
      const correctReviews = reviews.filter(r => r.correct).length;
      const successRate = totalReviews > 0 
        ? Math.round((correctReviews / totalReviews) * 100)
        : 0;

      // Calculate study streak
      const sessionDates = db.prepare(`
        SELECT DISTINCT date(created_at) as study_date
        FROM study_sessions
        WHERE created_at >= date('now', '-30 days')
        ORDER BY study_date DESC
      `).all() as { study_date: string }[];

      let streak = 0;
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (sessionDates.some(d => d.study_date === today || d.study_date === yesterday)) {
        streak = 1;
        let checkDate = new Date(Date.now() - 86400000);
        
        while (sessionDates.some(d => d.study_date === checkDate.toISOString().split('T')[0])) {
          streak++;
          checkDate = new Date(checkDate.getTime() - 86400000);
        }
      }

      res.json({
        successRate,
        totalSessions: studySessions.length,
        activeGroups: groups.length,
        streak
      });
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Reset
  app.post("/api/reset_history", async (_req, res) => {
    await storage.resetHistory();
    res.json({ message: "History reset successfully" });
  });

  app.post("/api/full_reset", async (_req, res) => {
    await storage.resetAll();
    res.json({ message: "Full reset completed successfully" });
  });

  // Add this new route
  app.get("/api/groups/:id/study_sessions", async (req, res) => {
    const groupId = parseInt(req.params.id);
    const sessions = await storage.getStudySessions();
    const groupSessions = sessions.filter(s => s.group_id === groupId);
    res.json(groupSessions);
  });

  app.post('/api/study-sessions/review', async (req, res) => {
    try {
      const { sessionId, wordId, correct } = req.body;

      // Strict validation
      if (!sessionId || !wordId || typeof correct !== 'boolean') {
        console.error('Invalid review data:', { sessionId, wordId, correct });
        return res.status(400).json({ 
          error: 'Invalid review data',
          details: {
            sessionId: typeof sessionId,
            wordId: typeof wordId,
            correct: typeof correct
          }
        });
      }

      // Insert the review with explicit boolean
      db.prepare(`
        INSERT INTO word_review_items (
          word_id,
          study_session_id,
          correct
        ) VALUES (?, ?, ?)
      `).run(wordId, sessionId, correct ? 1 : 0); // SQLite uses 1/0 for booleans

      res.json({ success: true });
    } catch (error) {
      console.error('Error recording review:', error);
      res.status(500).json({ error: 'Failed to record review' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}