import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, me, logout, updateProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
const router=Router();
router.post('/register',[body('name').trim().isLength({min:2,max:60}).withMessage('Name must contain 2–60 characters.'),body('email').trim().isEmail().withMessage('Enter a valid email address.'),body('password').isLength({min:8,max:72}).withMessage('Password must be at least 8 characters.')],register);
router.post('/login',[body('email').trim().isEmail().withMessage('Enter a valid email address.'),body('password').isLength({min:1,max:72}).withMessage('Password is required.')],login);
router.get('/me',requireAuth,me); router.post('/logout',logout); router.patch('/profile',requireAuth,updateProfile); export default router;
