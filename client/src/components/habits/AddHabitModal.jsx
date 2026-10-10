import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useHabits } from '../../context/HabitContext';
import { getTodayString } from '../../services/mockApi';

const ICONS = ['🏃', '📚', '💧', '🧘', '💻', '📖', '😴', '🚭', '🎯', '🏋️', '🎨', '🎵'];
const COLORS = ['#10B981', '#6366F1', '#06B6D4', '#EC4899', '#F59E0B', '#8B5CF6', '#EF4444'];
const CATEGORIES = ['Health', 'Study', 'Personal', 'Work', 'Fitness', 'Mindfulness'];
const FREQUENCIES = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekdays', label: 'Mon-Fri (Weekdays)' },
  { id: 'weekends', label: 'Sat-Sun (Weekends)' },
  { id: '3x_week', label: '3 Days a Week' }
];

export const AddHabitModal = ({ isOpen, onClose, habitToEdit = null }) => {
  const { addHabit, updateHabit } = useHabits();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Health',
    frequency: 'daily',
    goal: '30 Minutes',
    reminder: '07:00',
    color: '#10B981',
    icon: '🏃',
    startDate: getTodayString()
  });
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (habitToEdit) {
      setFormData({
        name: habitToEdit.name || '',
        category: habitToEdit.category || 'Health',
        frequency: habitToEdit.frequency || 'daily',
        goal: habitToEdit.goal || '30 Minutes',
        reminder: habitToEdit.reminder || '07:00',
        color: habitToEdit.color || '#10B981',
        icon: habitToEdit.icon || '🏃',
        startDate: habitToEdit.startDate || getTodayString()
      });
    } else {
      setFormData({
        name: '',
        category: 'Health',
        frequency: 'daily',
        goal: '30 Minutes',
        reminder: '07:00',
        color: '#10B981',
        icon: '🏃',
        startDate: getTodayString()
      });
    }
  }, [habitToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSaving(true); setSubmitError('');
    try {
      if (habitToEdit) await updateHabit(habitToEdit.id, formData);
      else await addHabit(formData);
      onClose();
    } catch (error) { setSubmitError(error.message || 'Unable to save this habit.'); }
    finally { setSaving(false); }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={habitToEdit ? 'Edit Habit Parameters' : 'Create New Habit'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {submitError && <p role="alert" className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{submitError}</p>}
        {/* Habit Name Input */}
        <div>
          <label className="block text-xs font-mono text-foreground-muted mb-1.5 uppercase">
            Habit Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Morning Exercise, Hydrate 3L..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#050506] border border-white/10 rounded-xl text-white placeholder-foreground-muted focus:outline-none focus:border-accent text-sm"
          />
        </div>

        {/* Icon & Color Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-mono text-foreground-muted mb-1.5 uppercase">
              Choose Icon
            </label>
            <div className="grid grid-cols-6 gap-2 bg-[#050506] p-2 rounded-xl border border-white/10">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: ic })}
                  className={`h-9 text-lg flex items-center justify-center rounded-lg transition-transform ${
                    formData.icon === ic ? 'bg-white/20 scale-110 border border-white/40' : 'hover:bg-white/10'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-mono text-foreground-muted mb-1.5 uppercase">
              Accent Color
            </label>
            <div className="flex items-center gap-2 bg-[#050506] p-2.5 rounded-xl border border-white/10 h-[52px]">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c })}
                  className={`w-7 h-7 rounded-full transition-all ${
                    formData.color === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Category & Frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-xs font-mono text-foreground-muted mb-1.5 uppercase">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#050506] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0a0a0c]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-foreground-muted mb-1.5 uppercase">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#050506] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
            >
              {FREQUENCIES.map((freq) => (
                <option key={freq.id} value={freq.id} className="bg-[#0a0a0c]">
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Goal Target & Reminder Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-xs font-mono text-foreground-muted mb-1.5 uppercase">
              Target Goal (e.g. 30 Mins, 8 Glasses)
            </label>
            <input
              type="text"
              placeholder="30 Minutes"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#050506] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-foreground-muted mb-1.5 uppercase">
              Daily Reminder Time
            </label>
            <input
              type="time"
              value={formData.reminder}
              onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#050506] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" disabled={saving}>
            {saving ? 'Saving…' : habitToEdit ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
