import mongoose from 'mongoose';
const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  completed: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true, toJSON: { virtuals: true, transform: (_doc, ret) => { ret.id = String(ret._id); ret.habitId = String(ret.habitId); ret.timestamp = ret.timestamp?.toISOString(); delete ret._id; delete ret.__v; delete ret.userId; return ret; } } });
logSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });
export default mongoose.model('HabitLog', logSchema);
