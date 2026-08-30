const cookie = require('cookie');

module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  res.setHeader('Set-Cookie', cookie.serialize('session', '', { maxAge: -1, path: '/' }));
  res.json({ success: true });
};
