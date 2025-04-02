// API-only server for the Persian/Dari Language Learning Portal
import express from 'express';
import cors from 'cors';
import { Op } from 'sequelize';
import { sequelize, Word, WordGroup, StudySession, WordReview } from './database.js';

const app = express();
const port = 8003; // Changed to use the exposed port in Docker

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Initialize database
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models with database
    await sequelize.sync();
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Mount all API routes under /api prefix
const apiRouter = express.Router();

// API Home
apiRouter.get('/', (req, res) => {
  res.json({
    message: "Dari Language Learning Portal API",
    endpoints: [
      "/groups",
      "/words",
      "/groups/:id/words",
      "/dashboard",
      "/study_sessions",
      "/reset_study_history",
      "/full_reset"
    ]
  });
});

// Groups endpoint
apiRouter.get('/groups', async (req, res) => {
  try {
    const groups = await WordGroup.findAll();
    res.json(groups);
  } catch (error) {
    console.error('Error fetching word groups:', error);
    res.status(500).json({ error: 'Failed to fetch word groups' });
  }
});

// Words endpoint
apiRouter.get('/words', async (req, res) => {
  try {
    const groupId = req.query.groupId ? parseInt(req.query.groupId) : undefined;
    const words = groupId 
      ? await Word.findAll({ where: { groupId } })
      : await Word.findAll();
    
    res.json(words);
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ error: 'Failed to fetch words' });
  }
});

// Group words endpoint
apiRouter.get('/groups/:id/words', async (req, res) => {
  try {
    const groupId = parseInt(req.params.id);
    const words = await Word.findAll({ where: { groupId } });
    
    res.json(words);
  } catch (error) {
    console.error('Error fetching group words:', error);
    res.status(500).json({ error: 'Failed to fetch group words' });
  }
});

// Dashboard endpoint
apiRouter.get('/dashboard', async (req, res) => {
  try {
    // Get statistics from database
    const [totalWords, totalGroups, recentSessions, lastSession, totalSessions] = await Promise.all([
      Word.count(),
      WordGroup.count(),
      StudySession.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5
      }),
      StudySession.findOne({
        order: [['createdAt', 'DESC']],
        where: { score: { [Op.not]: null } }
      }),
      StudySession.count()
    ]);

    // Calculate study streak
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const hasSessionOnDay = await StudySession.findOne({
        where: {
          createdAt: {
            [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
            [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
          }
        }
      });
      
      if (!hasSessionOnDay) break;
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Calculate average score
    const completedSessions = await StudySession.findAll({
      where: { score: { [Op.not]: null } }
    });

    const averageScore = completedSessions.length > 0
      ? Math.round(completedSessions.reduce((sum, s) => sum + s.score, 0) / completedSessions.length)
      : 0;

    // Get recent words
    const recentWords = await Word.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    const dashboard = {
      lastStudySession: lastSession,
      progress: {
        totalWords,
        masteredWords: recentSessions.reduce((sum, s) => sum + (s.correctCount || 0), 0),
        masteryProgress: Math.round((recentSessions.reduce((sum, s) => sum + (s.correctCount || 0), 0) / totalWords) * 100)
      },
      stats: {
        totalWords,
        totalGroups,
        activeGroups: totalGroups,
        totalSessions,
        successRate: averageScore,
        studyStreak: streak
      },
      recentSessions,
      recentWords
    };

    res.json(dashboard);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Study sessions endpoint
apiRouter.get('/study_sessions', async (req, res) => {
  try {
    const sessions = await StudySession.findAll();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching study sessions:', error);
    res.status(500).json({ error: 'Failed to fetch study sessions' });
  }
});

// Create study session endpoint
apiRouter.post('/study_sessions', async (req, res) => {
  try {
    const { groupId, groupName } = req.body;
    const session = await StudySession.create({
      groupId,
      groupName,
      startTime: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    res.json(session);
  } catch (error) {
    console.error('Error creating study session:', error);
    res.status(500).json({ error: 'Failed to create study session' });
  }
});

// Update study session endpoint
apiRouter.patch('/study_sessions/:id', async (req, res) => {
  try {
    const { score, correctCount, incorrectCount } = req.body;
    const session = await StudySession.findByPk(req.params.id);
    
    if (!session) {
      return res.status(404).json({ error: 'Study session not found' });
    }

    session.endTime = new Date().toISOString();
    session.score = score;
    session.correctCount = correctCount;
    session.incorrectCount = incorrectCount;
    await session.save();

    res.json(session);
  } catch (error) {
    console.error('Error updating study session:', error);
    res.status(500).json({ error: 'Failed to update study session' });
  }
});

// Word reviews endpoint
apiRouter.post('/word_reviews', async (req, res) => {
  try {
    res.json({ success: true, id: Date.now() });
  } catch (error) {
    console.error('Error creating word review:', error);
    res.status(500).json({ error: 'Failed to create word review' });
  }
});

// Reset endpoints
apiRouter.post('/reset_study_history', async (req, res) => {
  try {
    // Delete all study sessions
    await StudySessions.destroy({
      where: {}
    });

    // Delete all word reviews
    await WordReviews.destroy({
      where: {}
    });

    res.json({ success: true, message: 'Study history reset successfully' });
  } catch (error) {
    console.error('Error resetting study history:', error);
    res.status(500).json({ error: 'Failed to reset study history' });
  }
});

apiRouter.post('/full_reset', async (req, res) => {
  try {
    // Delete all study sessions
    await StudySessions.destroy({
      where: {}
    });

    // Delete all word reviews
    await WordReviews.destroy({
      where: {}
    });

    // Reset word mastery levels
    await Words.update(
      {
        masteryLevel: 1,
        lastReviewed: null,
        correctCount: 0,
        incorrectCount: 0
      },
      {
        where: {}
      }
    );

    res.json({ success: true, message: 'Full reset completed successfully' });
  } catch (error) {
    console.error('Error performing full reset:', error);
    res.status(500).json({ error: 'Failed to perform full reset' });
  }
});

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'dari-language-api',
    version: '1.0.0'
  });
});

// Mount the API router
app.use('/api', apiRouter);

// Root route with redirect to API
app.get('/', (req, res) => {
  res.json({
    message: "Dari Language Learning Portal API Server",
    apiEndpoint: "/api"
  });
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Dari Language Learning Portal API Server running on port ${port}`);
  });
});
