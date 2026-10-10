import React from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Flame, Trophy, Calendar, CheckCircle2, Clock, Target, TrendingUp } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { getTodayString } from '../../services/mockApi';

export const HabitDetailModal = ({ isOpen, onClose, habit }) => {
  const { logs } = useHabits();

  if (!habit) return null;

  // Calculate habit-specific metrics
  const habitLogs = logs.filter(l => l.habitId === habit.id && l.completed);
  const totalCompletions = habitLogs.length;

  // Generate last 30 days matrix
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    const dStr = getTodayString(d);
    const isDone = habitLogs.some(l => l.date === dStr);
    return { dateStr: dStr, dayNum: d.getDate(), isDone };
  });

  const completionRate = Math.min(Math.round((totalCompletions / 30) * 100), 100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${habit.icon} ${habit.name}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Top Header Card */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="category">{habit.category}</Badge>
              <Badge variant="accent">{habit.frequency}</Badge>
            </div>
            <p className="text-xs text-foreground-muted">Started tracking on <span className="text-white font-mono">{habit.startDate}</span></p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-mono text-foreground-muted block uppercase">Daily Goal</span>
              <span className="text-sm font-bold text-white font-mono">{habit.goal}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-foreground-muted block uppercase">Reminder</span>
              <span className="text-sm font-bold text-accent font-mono">{habit.reminder}</span>
            </div>
          </div>
        </div>

        {/* Core Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[10px] font-mono uppercase text-amber-300 block">Current Streak</span>
            <span className="text-2xl font-extrabold text-white font-mono mt-1 block flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" /> {habit.streak || 0}d
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <span className="text-[10px] font-mono uppercase text-indigo-300 block">Best Streak</span>
            <span className="text-2xl font-extrabold text-white font-mono mt-1 block flex items-center justify-center gap-1">
              <Trophy className="w-5 h-5 text-indigo-300" /> {habit.longestStreak || 0}d
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[10px] font-mono uppercase text-emerald-300 block">Completions</span>
            <span className="text-2xl font-extrabold text-white font-mono mt-1 block">
              {totalCompletions}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <span className="text-[10px] font-mono uppercase text-purple-300 block">30D Rate</span>
            <span className="text-2xl font-extrabold text-white font-mono mt-1 block">
              {completionRate}%
            </span>
          </div>

        </div>

        {/* Overall Completion Progress */}
        <div className="space-y-2">
          <ProgressBar percentage={completionRate} color={habit.color} height="h-3" showLabel />
        </div>

        {/* 30-Day Completion Heatmap Matrix */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground-muted flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#5E6AD2]" /> 30-Day Completion History Matrix
            </h4>
            <span className="text-[10px] font-mono text-foreground-muted">Green = Completed</span>
          </div>

          <div className="grid grid-cols-10 gap-2 p-4 rounded-xl bg-[#050506] border border-white/[0.08]">
            {last30Days.map((day, idx) => (
              <div
                key={idx}
                title={`${day.dateStr}: ${day.isDone ? 'Completed' : 'Missed'}`}
                className={`h-9 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all ${
                  day.isDone 
                    ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)] scale-105' 
                    : 'bg-white/[0.04] text-foreground-muted/40 border border-white/[0.06]'
                }`}
              >
                {day.dayNum}
              </div>
            ))}
          </div>
        </div>

      </div>
    </Modal>
  );
};
