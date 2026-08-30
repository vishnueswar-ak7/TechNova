const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for the /api/analyze endpoint.
 * 100 requests per 15 minutes per IP — generous enough for real use,
 * strict enough to prevent abuse.
 */
const analyzeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait a few minutes before trying again.',
  },
  handler: (req, res, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

module.exports = { analyzeRateLimiter };
