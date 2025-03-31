import express from 'express';
import { db } from './db.js';
import { Storage } from './storage.js';
import { Word, Group, StudySession, WordReview } from './shared/schema.js';

const router = express.Router();
const storage = new Storage();

// Get all words
router.get('/words', async (req, res) => {
  try {
    const words = await storage.getAllWords();
    res.json(words);
  } catch (error) {
    console.error('Error getting words:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific word
router.get('/words/:id', async (req, res) => {
  try {
    const word = await storage.getWord(parseInt(req.params.id));
    if (!word) {
      res.status(404).json({ error: 'Word not found' });
      return;
    }
    res.json(word);
  } catch (error) {
    console.error('Error getting word:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new word
router.post('/words', async (req, res) => {
  try {
    const word = await storage.createWord(req.body);
    res.status(201).json(word);
  } catch (error) {
    console.error('Error creating word:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all groups
router.get('/groups', async (req, res) => {
  try {
    const groups = await storage.getAllGroups();
    res.json(groups);
  } catch (error) {
    console.error('Error getting groups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific group
router.get('/groups/:id', async (req, res) => {
  try {
    const group = await storage.getGroup(parseInt(req.params.id));
    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }
    res.json(group);
  } catch (error) {
    console.error('Error getting group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new group
router.post('/groups', async (req, res) => {
  try {
    const group = await storage.createGroup(req.body);
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new study session
router.post('/study-sessions', async (req, res) => {
  try {
    const session = await storage.createStudySession(req.body);
    res.json(session);
  } catch (error) {
    console.error('Error creating study session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific study session
router.get('/study-sessions/:id', async (req, res) => {
  try {
    const session = await storage.getStudySession(parseInt(req.params.id));
    if (!session) {
      res.status(404).json({ error: 'Study session not found' });
      return;
    }
    res.json(session);
  } catch (error) {
    console.error('Error getting study session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const dashboard = await storage.getDashboard();
    res.json(dashboard);
  } catch (error) {
    console.error('Error getting dashboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;