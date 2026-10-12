import { Router } from 'express';
import { body } from 'express-validator';

import { requireAuth, requireAdmin } from '../middleware/auth.js';

import {
  listHabits,
  createHabit,
  updateHabit,
  archiveHabit,
  deleteHabit,
  toggleLog,
  exportData,
  importData,
  adminStats,
} from '../controllers/habitController.js';

import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// All habit routes require authentication.
router.use(requireAuth);

// Get habits and completion logs.
router.get('/', asyncHandler(listHabits));

// Create a habit.
router.post(
  '/',
  [
    body('name')
      .isString()
      .withMessage('Habit name must be text.')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Habit name must contain 2–100 characters.'),
  ],
  asyncHandler(createHabit)
);

// Export and import user data.
router.get('/backup/export', asyncHandler(exportData));
router.post('/backup/import', asyncHandler(importData));

// Admin statistics.
router.get('/admin/stats', requireAdmin, asyncHandler(adminStats));

// Update, archive, delete, and toggle a habit.
router.patch('/:id', asyncHandler(updateHabit));
router.patch('/:id/archive', asyncHandler(archiveHabit));
router.delete('/:id', asyncHandler(deleteHabit));
router.post('/:id/toggle', asyncHandler(toggleLog));

export default router;