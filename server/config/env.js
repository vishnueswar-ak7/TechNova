/**
 * env.js — Validates all required environment variables at startup.
 * Call validateEnv() once before the server starts; throws immediately if
 * anything critical is missing so the error is impossible to miss.
 */

const REQUIRED = ['GEMINI_API_KEY'];

const PLACEHOLDER_KEYS = new Set([
  'your_gemini_api_key_here',
  'YOUR_GEMINI_API_KEY',
  'test_key',
  '',
]);

function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `[Trustwise] Missing required environment variables: ${missing.join(', ')}\n` +
      `Copy .env.example to .env and fill in the values.`
    );
  }

  // Warn (don't throw) if placeholder key — mock mode will activate automatically
  const key = process.env.GEMINI_API_KEY || '';
  if (PLACEHOLDER_KEYS.has(key.trim())) {
    console.warn('[Trustwise] ⚠️  MOCK MODE: GEMINI_API_KEY is a placeholder. Using demo responses.');
    console.warn('[Trustwise]    Set a real key in server/.env to enable live AI.');
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    console.warn('[Trustwise] ⚠️  WARNING: GOOGLE_CLIENT_ID is not set in server/.env. Google Login will not work.');
  }
}

module.exports = {
  validateEnv,
  GEMINI_API_KEY: () => process.env.GEMINI_API_KEY,
  PORT: () => parseInt(process.env.PORT || '3001', 10),
  ALLOWED_ORIGIN: () => process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  CONFIDENCE_THRESHOLD: () => parseFloat(process.env.CONFIDENCE_THRESHOLD || '0.55'),
  MONEY_CONFIDENCE_THRESHOLD: () => parseFloat(process.env.MONEY_CONFIDENCE_THRESHOLD || '0.80'),
  GOOGLE_CLIENT_ID: () => process.env.GOOGLE_CLIENT_ID,
  JWT_SECRET: () => process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod',
};
