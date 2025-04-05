import express, { Request, Response } from 'express';
import cors from 'cors';
import { Op } from 'sequelize';
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // Import url module helpers
// Import from database.ts now, but keep .js extension for NodeNext module resolution
import { sequelize, Word, WordGroup, StudySession, WordReview, StudySessionAttributes } from './database.js';

// Helper to get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8003; // Use environment variable or default

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// --- Serve Static Client Files ---
// Define the path to the client build directory
const clientBuildPath = path.join(__dirname, '../../client/dist'); // Path relative to server/dist

// Serve static files (JS, CSS, images, etc.)
app.use(express.static(clientBuildPath));
// --- End Static File Serving ---


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
apiRouter.get('/', (req: Request, res: Response) => { // Add types
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
apiRouter.get('/groups', async (req: Request, res: Response) => { // Add types
  try {
    const groups = await WordGroup.findAll();
    res.json(groups);
  } catch (error) {
    console.error('Error fetching word groups:', error);
    res.status(500).json({ error: 'Failed to fetch word groups' });
  }
});

// Words endpoint
apiRouter.get('/words', async (req: Request, res: Response) => {
  try {
    // Explicitly handle query parameter type and parse correctly
    let groupId: number | undefined = undefined;
    if (typeof req.query.groupId === 'string') {
        const parsedId = parseInt(req.query.groupId, 10);
        if (!isNaN(parsedId)) {
            groupId = parsedId;
        }
    }

    const words = typeof groupId === 'number'
      ? await Word.findAll({ where: { groupId } })
      : await Word.findAll();
    res.json(words);
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ error: 'Failed to fetch words' });
  }
});

// Group words endpoint
apiRouter.get('/groups/:id/words', async (req: Request, res: Response) => { // Add types
  try {
    const groupId = parseInt(req.params.id, 10);
    if (isNaN(groupId)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }
    const words = await Word.findAll({ where: { groupId } });
    res.json(words);
  } catch (error) {
    console.error('Error fetching group words:', error);
    res.status(500).json({ error: 'Failed to fetch group words' });
  }
});

// Dashboard endpoint
apiRouter.get('/dashboard', async (req: Request, res: Response) => { // Add types
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
      const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      const hasSessionOnDay = await StudySession.findOne({
        where: {
          createdAt: {
            [Op.gte]: startOfDay,
            [Op.lt]: endOfDay
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

    // Use InstanceType<StudySessionAttributes> if StudySession is the class
    const averageScore = completedSessions.length > 0
      ? Math.round(completedSessions.reduce((sum: number, s: InstanceType<typeof StudySession>) => {
          const score = s.score === null ? 0 : s.score;
          return sum + score;
        }, 0) / completedSessions.length)
      : 0;

    // Get recent words
    const recentWords = await Word.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Use InstanceType<StudySessionAttributes>
    const masteredWordsCount = recentSessions.reduce((sum: number, s: InstanceType<typeof StudySession>) => {
        const correctCount = s.correctCount === null ? 0 : s.correctCount;
        return sum + correctCount;
    }, 0);
    const masteryProgressValue = totalWords > 0 ? Math.round((masteredWordsCount / totalWords) * 100) : 0;

    const dashboard = {
      lastStudySession: lastSession,
      progress: {
        totalWords,
        masteredWords: masteredWordsCount,
        masteryProgress: masteryProgressValue
      },
      stats: {
        totalWords,
        totalGroups,
        activeGroups: totalGroups, // Assuming all groups are active for now
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
apiRouter.get('/study_sessions', async (req: Request, res: Response) => { // Add types
  try {
    const sessions = await StudySession.findAll();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching study sessions:', error);
    res.status(500).json({ error: 'Failed to fetch study sessions' });
  }
});

// Create study session endpoint
apiRouter.post('/study_sessions', async (req: Request, res: Response) => {
  try {
    const { groupId, groupName } = req.body;
    const session = await StudySession.create({
      groupId,
      groupName,
      startTime: new Date() // Use Date object
    });
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating study session:', error);
    res.status(500).json({ error: 'Failed to create study session' });
  }
});

// Update study session endpoint
apiRouter.patch('/study_sessions/:id', async (req: Request, res: Response) => { // Add types
  try {
    const sessionId = parseInt(req.params.id, 10); // Add radix 10
     if (isNaN(sessionId)) { // Validate parsed id
        return res.status(400).json({ error: 'Invalid session ID' });
    }
    // TODO: Add validation for request body
    const { score, correctCount, incorrectCount } = req.body;
    const session = await StudySession.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Study session not found' });
    }

    // Update fields explicitly
    session.score = score;
    session.correctCount = correctCount;
    session.incorrectCount = incorrectCount;
    session.endTime = new Date(); // Use Date object
    await session.save();

    res.json(session);
  } catch (error) {
    console.error('Error updating study session:', error);
    res.status(500).json({ error: 'Failed to update study session' });
  }
});

// Word reviews endpoint
apiRouter.post('/word_reviews', async (req: Request, res: Response) => { // Add types
  try {
    const { wordId, sessionId, isCorrect } = req.body;
    const review = await WordReview.create({
        sessionId,
        wordId,
        isCorrect,
        timestamp: new Date() // Use Date object
    });
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating word review:', error);
    res.status(500).json({ error: 'Failed to create word review' });
  }
});

// Reset endpoints
apiRouter.post('/reset_study_history', async (req: Request, res: Response) => { // Add types
  try {
    // Fix typo
    await StudySession.destroy({ truncate: true });
    // Fix typo
    await WordReview.destroy({ truncate: true });
    res.json({ success: true, message: 'Study history reset successfully' });
  } catch (error) {
    console.error('Error resetting study history:', error);
    res.status(500).json({ error: 'Failed to reset study history' });
  }
});

apiRouter.post('/full_reset', async (req: Request, res: Response) => { // Add types
  try {
    // Fix typos
    await StudySession.destroy({ truncate: true });
    await WordReview.destroy({ truncate: true });
    await Word.destroy({ truncate: true });
    await WordGroup.destroy({ truncate: true });

    // TODO: Re-seed database if needed
    console.log('Database fully reset (data cleared).');
    res.json({ success: true, message: 'Database fully reset successfully' });
  } catch (error) {
    console.error('Error during full reset:', error);
    res.status(500).json({ error: 'Failed to perform full reset' });
  }
});

app.use('/api', apiRouter); // Mount API router

// --- Serve index.html for SPA routing ---
// This catch-all route should come AFTER API routes
// It serves the main HTML file for any non-API, non-static file requests
app.get('*', (req: Request, res: Response) => { // Add types
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});
// --- End SPA Fallback ---


// Start server
async function startServer() {
  await initializeDatabase();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer(); 