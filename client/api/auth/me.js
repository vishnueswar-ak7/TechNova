import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.session;

  if (!token) {
    return res.status(401).json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    res.json({ user: decoded });
  } catch (error) {
    res.setHeader('Set-Cookie', cookie.serialize('session', '', { maxAge: -1, path: '/' }));
    res.status(401).json({ user: null });
  }
};
