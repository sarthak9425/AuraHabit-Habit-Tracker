import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.aurahabit_token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  if (!token) return res.status(401).json({ message: 'Please sign in to continue.' });
  let payload; try { payload = jwt.verify(token, process.env.JWT_SECRET); } catch { return res.status(401).json({ message: 'Session expired. Please sign in again.' }); }
  const user = await User.findById(payload.sub);
  if (!user) return res.status(401).json({ message: 'Account no longer exists.' });
  req.user = user; next();
});
export const requireAdmin = (req, res, next) => req.user?.role === 'admin' ? next() : res.status(403).json({ message: 'Administrator access required.' });
