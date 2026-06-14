const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const igStore = new Map();

let Instagram;
try { Instagram = require('../models').Instagram; } catch (e) {}

// POST /api/instagram/connect
router.post('/connect', async (req, res) => {
  try {
    const { userId, username, password } = req.body;
    if (!userId || !username) return res.status(400).json({ message: 'userId and username required' });

    const passwordHash = await bcrypt.hash(password || '', 10);
    const now = new Date();

    const data = {
      userId, username: username.toLowerCase(),
      passwordHash,
      connected: true,
      connectedAt: now,
      lastSync: now,
    };

    try {
      if (Instagram) {
        await Instagram.findOneAndUpdate({ userId }, data, { upsert: true, new: true });
      } else throw new Error('no db');
    } catch {
      igStore.set(userId, data);
    }

    // Simulate verification delay
    await new Promise(r => setTimeout(r, 1500));

    res.json({
      success: true,
      username: username.toLowerCase(),
      connected: true,
      connectedAt: now,
      message: `Successfully connected @${username}`,
    });
  } catch (err) {
    res.status(500).json({ message: 'Connection failed', error: err.message });
  }
});

// POST /api/instagram/disconnect
router.post('/disconnect', async (req, res) => {
  try {
    const { userId } = req.body;

    try {
      if (Instagram) {
        await Instagram.findOneAndUpdate({ userId }, { connected: false });
      } else throw new Error('no db');
    } catch {
      const existing = igStore.get(userId);
      if (existing) igStore.set(userId, { ...existing, connected: false });
    }

    res.json({ success: true, message: 'Disconnected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/instagram/status/:userId
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let data;

    try {
      if (Instagram) data = await Instagram.findOne({ userId });
      else throw new Error('no db');
    } catch {
      data = igStore.get(userId);
    }

    if (!data) return res.json({ connected: false });

    // Update lastSync
    const lastSync = new Date();
    try {
      if (Instagram) await Instagram.findOneAndUpdate({ userId }, { lastSync });
      else throw new Error('no db');
    } catch {
      if (data) igStore.set(userId, { ...data, lastSync });
    }

    res.json({
      connected: data.connected,
      username: data.username,
      connectedAt: data.connectedAt,
      lastSync,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
