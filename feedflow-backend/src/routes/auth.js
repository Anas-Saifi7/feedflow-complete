const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'feedflow_secret_2024';

// In-memory store as fallback when MongoDB is unavailable
const memoryUsers = new Map();

let User;
try {
  User = require('../models/User');
} catch (e) {}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    let user;

    try {
      if (User) {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered' });

        user = await User.create({ name, email, password });
      } else {
        throw new Error('No DB');
      }
    } catch (dbErr) {
      // Fallback: in-memory
      if (memoryUsers.has(email)) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash(password, 10);
      const id = 'user_' + Date.now();
      memoryUsers.set(email, { id, name, email, password: hash });
      user = { id, name, email };
    }

    const token = jwt.sign(
      { id: user._id || user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id || user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'All fields required' });

    let user;
    const bcrypt = require('bcryptjs');

    try {
      if (User) {
        user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const valid = await user.comparePassword(password);
        if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
      } else throw new Error('No DB');
    } catch (dbErr) {
      const mem = memoryUsers.get(email);
      if (!mem) return res.status(400).json({ message: 'Invalid credentials' });
      const valid = await bcrypt.compare(password, mem.password);
      if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
      user = mem;
    }

    const token = jwt.sign(
      { id: user._id || user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: { id: user._id || user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
