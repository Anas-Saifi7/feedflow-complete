const express = require('express');
const router = express.Router();
const memStore = new Map();

let Preferences;
try { Preferences = require('../models').Preferences; } catch (e) {}

// POST /api/preferences
router.post('/', async (req, res) => {
  try {
    const { userId, likedTopics, avoidedTopics } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    try {
      if (Preferences) {
        await Preferences.findOneAndUpdate(
          { userId },
          { likedTopics, avoidedTopics, updatedAt: new Date() },
          { upsert: true, new: true }
        );
      } else throw new Error('no db');
    } catch {
      memStore.set(userId, { likedTopics, avoidedTopics });
    }

    res.json({ success: true, likedTopics, avoidedTopics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/preferences/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let data;

    try {
      if (Preferences) {
        data = await Preferences.findOne({ userId });
      } else throw new Error('no db');
    } catch {
      data = memStore.get(userId);
    }

    res.json(data || { likedTopics: [], avoidedTopics: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
