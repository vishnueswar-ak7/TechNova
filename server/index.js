require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const { validateEnv } = require('./config/env');
const { analyzeRateLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const healthRoute = require('./routes/health');
const analyzeRoute = require('./routes/analyze');
const notifyRoute = require('./routes/notify');
const authRoute = require('./routes/auth');

// Validate env vars before anything else — fail fast
validateEnv();

const app = express();
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoute);
app.use('/api/analyze', analyzeRateLimiter, analyzeRoute);
app.use('/api/notify', notifyRoute);
app.use('/api/auth', authRoute);

// ── 404 catch-all ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Centralised error handler (must be last) ─────────────────────────────────
app.use(errorHandler);

// ── Unhandled rejections / exceptions ─────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('[Trustwise] Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[Trustwise] Uncaught exception:', err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`[Trustwise] Server running on http://localhost:${PORT}`);
});

module.exports = app;
