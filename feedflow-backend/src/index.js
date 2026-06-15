require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const preferencesRoutes = require('./routes/preferences');
const instagramRoutes = require('./routes/instagram');
const automationRoutes = require('./routes/automation');

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// DB Connection
const MONGO_URI = process.env.MONGO_URI ;
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('⚠️  MongoDB error (using in-memory):', err.message));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'FeedFlow API running 🚀', version: '1.0.0', timestamp: new Date() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/automation', automationRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 FeedFlow backend running on port ${PORT}`);
});
