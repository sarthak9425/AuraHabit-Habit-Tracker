import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
  bio: { type: String, default: 'Building better habits, one day at a time.', maxlength: 180 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true, toJSON: { virtuals: true, transform: (_doc, ret) => { delete ret.passwordHash; delete ret.__v; return ret; } } });
userSchema.virtual('joinedDate').get(function () { return this.createdAt ? this.createdAt.toISOString().slice(0, 10) : null; });
export default mongoose.model('User', userSchema);
