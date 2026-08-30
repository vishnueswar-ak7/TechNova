const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const router = express.Router();
let googleClient;

// Helper to init the client lazily so it doesn't crash if env is missing
function getGoogleClient() {
  if (!googleClient) {
    googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID());
  }
  return googleClient;
}

// ── Google Login Verification ──────────────────────────────────────────────
router.post('/google', async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Missing credential' });
    }

    const client = getGoogleClient();
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID(),
    });
    
    const payload = ticket.getPayload();
    // payload contains sub (id), email, name, picture
    
    // Create an internal session token
    const token = jwt.sign(
      {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      },
      env.JWT_SECRET(),
      { expiresIn: '7d' } // Secure 7-day session
    );

    // Set HttpOnly cookie
    res.cookie('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
    });
  } catch (error) {
    console.error('[auth] Google verification failed:', error);
    res.status(401).json({ error: 'Invalid Google credential' });
  }
});

// ── Get Current Session User ────────────────────────────────────────────────
router.get('/me', (req, res) => {
  const token = req.cookies.session;
  if (!token) {
    return res.status(401).json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET());
    res.json({ user: decoded });
  } catch (error) {
    res.clearCookie('session');
    res.status(401).json({ user: null });
  }
});

// ── Logout ────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.json({ success: true });
});

module.exports = router;
