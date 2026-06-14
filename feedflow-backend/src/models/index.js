const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  likedTopics: [String],
  avoidedTopics: [String],
  updatedAt: { type: Date, default: Date.now },
});

const instagramSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  username: String,
  passwordHash: String,
  connected: { type: Boolean, default: false },
  connectedAt: Date,
  lastSync: Date,
});

const automationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  isActive: { type: Boolean, default: false },
  actionsCompleted: { type: Number, default: 0 },
  sessionsRun: { type: Number, default: 0 },
  todayActions: { type: Number, default: 0 },
  progressScore: { type: Number, default: 0 },
  lastActivity: Date,
  lastReset: { type: Date, default: Date.now },
});

module.exports = {
  Preferences: mongoose.model('Preferences', preferencesSchema),
  Instagram: mongoose.model('Instagram', instagramSchema),
  Automation: mongoose.model('Automation', automationSchema),
};
