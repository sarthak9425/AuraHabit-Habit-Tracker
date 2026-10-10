import mongoose from 'mongoose';
const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  category: { type: String, default: 'Personal', trim: true, maxlength: 40 },
  frequency: { type: String, enum: ['daily', 'weekdays', 'weekends', '3x_week', 'weekly'], default: 'daily' },
  goal: { type: String, default: '10 minutes', maxlength: 100 },
  reminder: { type: String, default: '' },
  color: { type: String, default: '#6366F1', match: /^#[0-9A-Fa-f]{6}$/ },
  icon: { type: String, default: '✨', maxlength: 8 },
  startDate: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  archived: { type: Boolean, default: false },
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 }
}, { timestamps: true, toJSON: { virtuals: true, transform: (_doc, ret) => { ret.id = String(ret._id); ret.createdAt = ret.createdAt?.toISOString().slice(0,10); delete ret.userId; delete ret._id; delete ret.__v; return ret; } } });
export default mongoose.model('Habit', habitSchema);
