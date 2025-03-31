import express from 'express';
import { mockWords, mockGroups, mockSessions, mockDashboard } from './mockData.js';
import type { Word, GroupWithCount } from './shared/schema.js';

const router = express.Router();

// Get all words
router.get('/words', async (req, res) => {
  const groupId = req.query.groupId ? parseInt(req.query.groupId as string) : undefined;
  const words = groupId 
    ? mockWords.filter(word => word.groupId === groupId)
    : mockWords;
  res.json(words);
});

// Get all groups
router.get('/groups', async (_req, res) => {
  const groupsWithCount = mockGroups.map(group => ({
    ...group,
    wordCount: mockWords.filter(word => word.groupId === group.id).length
  }));
  res.json(groupsWithCount);
});

// Get words for a specific group
router.get('/groups/:id/words', async (req, res) => {
  const groupId = parseInt(req.params.id);
  const words = mockWords.filter(word => word.groupId === groupId);
  res.json(words);
});

// Get dashboard data
router.get('/dashboard', async (_req, res) => {
  res.json(mockDashboard);
});

// Create a new study session
router.post('/study_sessions', async (req, res) => {
  const newSession = {
    ...mockSessions[0],
    id: mockSessions.length + 1,
    startTime: new Date().toISOString(),
    endTime: undefined,
    score: undefined
  };
  res.json(newSession);
});

// Create a word review
router.post('/word_reviews', async (req, res) => {
  res.json({ success: true });
});

export default router;