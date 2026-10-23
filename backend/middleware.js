import jwt from 'jsonwebtoken';
import fs from 'fs';

export function authMiddleware(req, res, next) {
  console.log(`[Auth] ${req.method} ${req.path}`);
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('[Auth] No token');
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    req.user = {
      id: decoded.userId,
      userId: decoded.userId,
      username: decoded.username
    };
    console.log(`[Auth] OK userId=${decoded.userId}`);
    next();
  } catch (err) {
    console.error('[Auth] Error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
}

export default authMiddleware;
