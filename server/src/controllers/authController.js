import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.COOKIE_SAME_SITE || 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' });
const issueSession = (user, res) => { const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' }); res.cookie('aurahabit_token', token, cookieOptions()); };
export async function register(req, res) {
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  const { name, email, password } = req.body;
  if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with this email already exists.' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash }); issueSession(user, res);
  res.status(201).json({ user: user.toJSON() });
}
export async function login(req, res) {
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password.' });
  issueSession(user, res); res.json({ user: user.toJSON() });
}
export async function me(req, res) { res.json({ user: req.user.toJSON() }); }
export function logout(_req, res) { res.clearCookie('aurahabit_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.COOKIE_SAME_SITE || 'lax', path: '/' }); res.json({ message: 'Signed out successfully.' }); }
export async function updateProfile(req, res) {
  const { name, bio } = req.body;
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60) return res.status(400).json({ message: 'Name must contain 2–60 characters.' });
  req.user.name = name.trim(); if (typeof bio === 'string') req.user.bio = bio.trim().slice(0, 180);
  await req.user.save(); res.json({ user: req.user.toJSON() });
}
