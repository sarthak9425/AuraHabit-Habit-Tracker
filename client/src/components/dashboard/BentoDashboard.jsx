import React, { useState } from 'react';
import { 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Calendar, 
  Target, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHabits } from '../../context/HabitContext';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressRing } from '../ui/ProgressRing';
import { getTodayString } from '../../services/mockApi';

export const BentoDashboard = ({ onOpenAddModal, onOpenDetailModal, setActiveTab }) => {
  const { user } = useAuth();
  const { 
    filteredHabits, 
    activeHabits, 
    toggleLog, 
    todayLogsSet, 
    completedTodayCount, 
    totalTodayCount, 
    todayPercentage, 
    currentMaxStreak, 
    longestEverStreak,
    logs
  } = useHabits();

  const todayStr = getTodayString();
  const remainingCount = totalTodayCount - completedTodayCount;

  // Generate last 7 days completion data for Weekly Chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = getTodayString(d);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    // Count logs for this date
    const dayLogsCount = logs.filter(l => l.date === dStr && l.completed).length;
    const dayPercentage = totalTodayCount > 0 ? Math.min(Math.round((dayLogsCount / totalTodayCount) * 100), 100) : 0;

    return { dayName, dateStr: dStr, percentage: dayPercentage, isToday: dStr === todayStr };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Banner & Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono tracking-widest text-[#5E6AD2] uppercase font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Performance Dashboard
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient-white">
            Good Morning, {user?.name || 'Practitioner'} 👋
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            You have <strong className="text-white font-mono">{totalTodayCount} habits</strong> scheduled for today. Keep building your momentum.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" icon={Calendar} onClick={() => setActiveTab('calendar')}>
            Calendar History
          </Button>
          <Button variant="primary" size="md" icon={Plus} onClick={onOpenAddModal}>
            Add Habit
          </Button>
        </div>
      </div>

      {/* 2. Asymmetric Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

        {/* HERO CARD (Span 4) — Daily Completion Status & Ring */}
        <SpotlightCard className="md:col-span-4 bg-gradient-to-br from-[#0a0a0c] via-[#0d0d12] to-[#0a0a0c]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            
            <div className="space-y-4 max-w-md">
              <Badge variant="accent" icon={Target}>
                Today's Target Overview
              </Badge>
              
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {todayPercentage === 100 
                  ? "🎉 Outstanding! All habits completed today!" 
                  : `${completedTodayCount} of ${totalTodayCount} Habits Completed Today`}
              </h2>

              <p className="text-xs text-foreground-muted leading-relaxed">
                Consistency is key to permanent neural wiring. You have <span className="text-amber-400 font-semibold">{remainingCount} habits remaining</span> for today.
              </p>

              {/* Progress Summary Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-foreground-muted block uppercase">Done</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">{completedTodayCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-foreground-muted block uppercase">Pending</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">{remainingCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-foreground-muted block uppercase">Score</span>
                  <span className="text-lg font-bold text-[#5E6AD2] font-mono">{todayPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Glowing Interactive Progress Ring */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center p-4">
              <ProgressRing 
                percentage={todayPercentage} 
                size={140} 
                strokeWidth={12} 
                color={todayPercentage === 100 ? '#10B981' : '#5E6AD2'}
                label="TODAY"
              />
            </div>

          </div>
        </SpotlightCard>

        {/* STREAK ENGINE CARD (Span 2) — Fire & Trophy */}
        <SpotlightCard className="md:col-span-2 bg-gradient-to-br from-[#0a0a0c] via-amber-950/10 to-[#0a0a0c]">
          <div className="h-full flex flex-col justify-between space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-amber-400" /> Momentum Engine
              </span>
              <span className="text-[10px] font-mono text-foreground-muted bg-white/[0.05] px-2 py-0.5 rounded">Active Streak</span>
            </div>

            <div className="space-y-3 my-auto">
              {/* Current Streak */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-300 uppercase block">Current Streak</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl font-extrabold text-white font-mono">{currentMaxStreak}</span>
                    <span className="text-xs text-amber-400 font-semibold">Days 🔥</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
              </div>

              {/* Best Streak */}
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-indigo-300 uppercase block">Longest Streak</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold text-white font-mono">{longestEverStreak}</span>
                    <span className="text-xs text-indigo-300">Days Record</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-indigo-300" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-foreground-muted italic">
              "Don't break the chain. 1 day missed is a slip, 2 days is a new habit."
            </p>

          </div>
        </SpotlightCard>

        {/* TODAY'S HABITS CHECK-OFF LIST (Span 4) */}
        <SpotlightCard className="md:col-span-4">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#5E6AD2]" /> Today's Habit Checklist
                </h3>
                <span className="text-xs text-foreground-muted">Click any checkbox to mark your progress in real-time</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('habits')} icon={ChevronRight}>
                View All ({activeHabits.length})
              </Button>
            </div>

            {filteredHabits.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <Zap className="w-8 h-8 text-foreground-muted mx-auto opacity-50" />
                <p className="text-sm text-foreground-muted">No habits scheduled matching filters.</p>
                <Button variant="secondary" size="sm" onClick={onOpenAddModal} icon={Plus}>
                  Create First Habit
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {filteredHabits.map((habit) => {
                  const isCompleted = todayLogsSet.has(habit.id);
                  return (
                    <div
                      key={habit.id}
                      className={`group p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                        isCompleted
                          ? 'bg-emerald-500/[0.05] border-emerald-500/30'
                          : 'bg-white/[0.03] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      {/* Checkbox & Habit Name */}
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => toggleLog(habit.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                            isCompleted
                              ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-105'
                              : 'border border-white/20 hover:border-accent text-transparent hover:text-accent/50'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5 fill-current" />
                        </button>

                        <div 
                          className="cursor-pointer min-w-0" 
                          onClick={() => onOpenDetailModal(habit)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{habit.icon}</span>
                            <span className={`text-sm font-semibold truncate transition-colors ${
                              isCompleted ? 'line-through text-foreground-muted' : 'text-white group-hover:text-accent'
                            }`}>
                              {habit.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-foreground-muted flex items-center gap-1">
                              <Clock className="w-3 h-3 text-foreground-muted" /> {habit.reminder || '08:00 AM'}
                            </span>
                            <span className="text-foreground-muted/40">•</span>
                            <span className="text-[10px] font-mono text-foreground-muted">Target: {habit.goal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Tag Badges */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="category">{habit.category}</Badge>
                        <Badge variant="warning" icon={Flame}>
                          {habit.streak || 0}d
                        </Badge>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </SpotlightCard>

        {/* WEEKLY PROGRESS BAR CHART (Span 2) */}
        <SpotlightCard className="md:col-span-2">
          <div className="h-full flex flex-col justify-between space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#5E6AD2]" /> 7-Day Performance
              </h3>
              <span className="text-[10px] font-mono text-foreground-muted">This Week</span>
            </div>

            {/* Custom SVG Vertical Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-44 pt-4 px-2">
              {last7Days.map((d, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[9px] font-mono text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.percentage}%
                  </span>

                  {/* Vertical Bar Container */}
                  <div className="w-full bg-white/[0.06] rounded-t-lg h-32 relative overflow-hidden flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        d.isToday 
                          ? 'bg-gradient-to-t from-[#5E6AD2] to-indigo-400 shadow-[0_0_15px_rgba(94,106,210,0.5)]' 
                          : d.percentage > 70 
                          ? 'bg-emerald-500/80' 
                          : d.percentage > 0 
                          ? 'bg-indigo-500/50' 
                          : 'bg-transparent'
                      }`}
                      style={{ height: `${Math.max(d.percentage, 6)}%` }}
                    />
                  </div>

                  <span className={`text-[10px] font-mono uppercase ${d.isToday ? 'text-accent font-bold' : 'text-foreground-muted'}`}>
                    {d.dayName}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-foreground-muted">
              <span>Weekly Completion</span>
              <span className="text-white font-bold">
                {Math.round(last7Days.reduce((acc, curr) => acc + curr.percentage, 0) / 7)}% Avg
              </span>
            </div>

          </div>
        </SpotlightCard>

      </div>
    </div>
  );
};
