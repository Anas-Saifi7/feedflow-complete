const express = require('express');
const router = express.Router();
const autoStore = new Map();

let Automation;
try { Automation = require('../models').Automation; } catch (e) {}

const HASHTAGS_MAP = {
  tech: ['technology', 'coding', 'programming', 'developer', 'software'],
  ai: ['artificialintelligence', 'machinelearning', 'deeplearning', 'AI', 'chatgpt'],
  startups: ['startup', 'entrepreneur', 'founder', 'ycombinator', 'venturecapital'],
  business: ['business', 'entrepreneurship', 'leadership', 'CEO', 'hustle'],
  finance: ['investing', 'stocks', 'finance', 'wealth', 'money'],
  fitness: ['fitness', 'gym', 'workout', 'health', 'bodybuilding'],
  health: ['wellness', 'mentalhealth', 'selfcare', 'nutrition', 'mindfulness'],
  education: ['learning', 'education', 'studytips', 'knowledge', 'growth'],
  travel: ['travel', 'wanderlust', 'explore', 'adventure', 'backpacking'],
  gaming: ['gaming', 'gamer', 'videogames', 'esports', 'twitch'],
  design: ['design', 'ui', 'ux', 'graphicdesign', 'creative'],
  photography: ['photography', 'photo', 'photographer', 'canon', 'nikon'],
  food: ['food', 'foodie', 'cooking', 'recipe', 'chef'],
  music: ['music', 'musician', 'producer', 'hiphop', 'indie'],
  crypto: ['crypto', 'bitcoin', 'ethereum', 'web3', 'blockchain'],
  science: ['science', 'research', 'physics', 'biology', 'innovation'],
};

const getDefaultStats = (userId) => ({
  userId,
  isActive: false,
  actionsCompleted: 0,
  sessionsRun: 0,
  todayActions: 0,
  progressScore: 0,
  lastActivity: null,
  lastReset: new Date(),
});

const getStats = async (userId) => {
  try {
    if (Automation) {
      const doc = await Automation.findOne({ userId });
      return doc || getDefaultStats(userId);
    }
  } catch (_) {}
  return autoStore.get(userId) || getDefaultStats(userId);
};

const saveStats = async (userId, data) => {
  try {
    if (Automation) {
      await Automation.findOneAndUpdate({ userId }, data, { upsert: true, new: true });
      return;
    }
  } catch (_) {}
  autoStore.set(userId, { ...autoStore.get(userId), ...data });
};

// Simulate what automation actually does
const simulateAction = (topics = []) => {
  const topic = topics[Math.floor(Math.random() * topics.length)] || 'tech';
  const hashtags = HASHTAGS_MAP[topic] || ['technology'];
  const hashtag = hashtags[Math.floor(Math.random() * hashtags.length)];

  const actions = [
    { type: 'like', description: `Liked a post under #${hashtag}` },
    { type: 'follow', description: `Followed a creator in ${topic} niche` },
    { type: 'explore', description: `Explored #${hashtag} feed` },
    { type: 'save', description: `Saved a relevant ${topic} post` },
  ];

  return actions[Math.floor(Math.random() * actions.length)];
};

// POST /api/automation/start
router.post('/start', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const stats = await getStats(userId);
    const updated = {
      ...stats,
      isActive: true,
      sessionsRun: (stats.sessionsRun || 0) + 1,
      lastActivity: new Date(),
    };
    await saveStats(userId, updated);

    res.json({ success: true, message: 'Automation started', stats: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/automation/stop
router.post('/stop', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const stats = await getStats(userId);
    const updated = { ...stats, isActive: false, lastActivity: new Date() };
    await saveStats(userId, updated);

    res.json({ success: true, message: 'Automation paused', stats: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/automation/run-session
router.post('/run-session', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const likedTopics = preferences?.liked || [];
    const action = simulateAction(likedTopics);

    const stats = await getStats(userId);
    const newTotal = (stats.actionsCompleted || 0) + 1;
    const newToday = (stats.todayActions || 0) + 1;
    const newScore = Math.min(100, Math.floor((newTotal / 50) * 100));

    const updated = {
      ...stats,
      actionsCompleted: newTotal,
      todayActions: newToday,
      progressScore: newScore,
      lastActivity: new Date(),
      isActive: true,
    };

    await saveStats(userId, updated);

    res.json({
      success: true,
      action,
      stats: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/automation/stats/:userId
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await getStats(userId);

    // Reset todayActions if a new day
    const lastReset = new Date(stats.lastReset || 0);
    const now = new Date();
    if (lastReset.toDateString() !== now.toDateString()) {
      stats.todayActions = 0;
      stats.lastReset = now;
      await saveStats(userId, stats);
    }

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
