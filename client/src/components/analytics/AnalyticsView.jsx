import React, { useMemo } from 'react';
import {
  ArrowUpRight, Award, CalendarDays, Flame, Lightbulb, PieChart,
  Target, Trophy, TrendingUp
} from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { getTodayString } from '../../services/mockApi';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

const DAY_MS = 24 * 60 * 60 * 1000;
const toDateKey = (date) => getTodayString(date);
const formatDate = (dateKey) => new Date(`${dateKey}T12:00:00`).toLocaleDateString(undefined, {
  month: 'short', day: 'numeric', year: 'numeric'
});

export const AnalyticsView = () => {
  const { activeHabits, logs, currentMaxStreak, longestEverStreak } = useHabits();
  const today = new Date();
  const todayKey = toDateKey(today);
  const activeHabitIds = new Set(activeHabits.map((habit) => habit.id));
  const relevantLogs = logs.filter((log) => activeHabitIds.has(log.habitId) && log.completed);

  const last30Days = useMemo(() => {
    const dates = [];
    for (let offset = 29; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - offset);
      dates.push(toDateKey(date));
    }
    return dates;
  }, []);

  const last30Set = new Set(last30Days);
  const recentLogs = relevantLogs.filter((log) => last30Set.has(log.date));
  const logsByDate = new Map();
  relevantLogs.forEach((log) => {
    logsByDate.set(log.date, (logsByDate.get(log.date) || 0) + 1);
  });

  const completedToday = logsByDate.get(todayKey) || 0;
  const todayRate = activeHabits.length ? Math.round((completedToday / activeHabits.length) * 100) : 0;
  const activeDays30 = last30Days.filter((date) => (logsByDate.get(date) || 0) > 0).length;
  const totalCompletions30 = recentLogs.length;
  const averageDailyCompletions = (totalCompletions30 / 30).toFixed(1);

  const categoryStats = ['Health', 'Study', 'Personal', 'Work', 'Fitness', 'Mindfulness'].map((category) => {
    const categoryHabits = activeHabits.filter((habit) => habit.category === category);
    const ids = new Set(categoryHabits.map((habit) => habit.id));
    const count = recentLogs.filter((log) => ids.has(log.habitId)).length;
    const rate = categoryHabits.length ? Math.min(Math.round((count / (categoryHabits.length * 30)) * 100), 100) : 0;
    return { category, count: categoryHabits.length, rate, completions: count };
  });

  const habitPerformance = activeHabits.map((habit) => {
    const habitLogs = recentLogs.filter((log) => log.habitId === habit.id);
    const daysCompleted = new Set(habitLogs.map((log) => log.date)).size;
    return { ...habit, completions30: habitLogs.length, daysCompleted, rate: Math.round((daysCompleted / 30) * 100) };
  }).sort((a, b) => b.rate - a.rate || b.completions30 - a.completions30);
  const topHabit = habitPerformance[0] || null;

  // A 13-week activity heatmap, based on actual stored completion logs.
  const heatmapDays = useMemo(() => {
    const days = [];
    for (let offset = 90; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - offset);
      const key = toDateKey(date);
      days.push({ date, key, count: 0 });
    }
    return days;
  }, []);
  const heatmap = heatmapDays.map((day) => {
    const count = logsByDate.get(day.key) || 0;
    const intensity = count === 0 ? 0 : activeHabits.length ? Math.min(Math.ceil((count / activeHabits.length) * 4), 4) : 1;
    return { ...day, count, intensity };
  });
  const insight = !activeHabits.length
    ? 'Add your first habit to unlock personalized consistency insights.'
    : !totalCompletions30
      ? 'Your next step: complete one habit today. Your activity trends will appear here as you build history.'
      : `${topHabit.name} is your most consistent habit over the last 30 days (${topHabit.rate}% of days). You logged activity on ${activeDays30} of 30 days.`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-white/[0.08] pb-6">
        <span className="text-xs font-mono tracking-widest text-[#5E6AD2] uppercase font-semibold block mb-1">Behavioral Intelligence</span>
        <h1 className="text-3xl font-bold tracking-tight text-gradient-white">Performance Analytics & Insights</h1>
        <p className="text-sm text-foreground-muted mt-1">Understand your real completion history, consistency, and habit momentum.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpotlightCard className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-foreground-muted uppercase block">Active Habits</span>
            <span className="text-2xl font-bold text-white font-mono mt-1 block">{activeHabits.length}</span>
            <span className="text-[10px] text-foreground-muted font-mono mt-0.5 block">Currently tracking</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><Target className="w-5 h-5" /></div>
        </SpotlightCard>

        <SpotlightCard className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-foreground-muted uppercase block">Best Active Streak</span>
            <span className="text-2xl font-bold text-amber-400 font-mono mt-1 block flex items-center gap-1"><Flame className="w-5 h-5 fill-amber-400" /> {currentMaxStreak} days</span>
            <span className="text-[10px] text-foreground-muted font-mono mt-0.5 block">Personal record: {longestEverStreak}d</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400"><Flame className="w-5 h-5" /></div>
        </SpotlightCard>

        <SpotlightCard className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-foreground-muted uppercase block">Completions · 30 days</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">{totalCompletions30}</span>
            <span className="text-[10px] text-foreground-muted font-mono mt-0.5 block">{averageDailyCompletions} per day on average</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><Award className="w-5 h-5" /></div>
        </SpotlightCard>

        <SpotlightCard className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-foreground-muted uppercase block">Today's Completion</span>
            <span className="text-2xl font-bold text-white font-mono mt-1 block">{todayRate}%</span>
            <span className="text-[10px] text-foreground-muted font-mono mt-0.5 block">{completedToday} of {activeHabits.length} habits</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400"><TrendingUp className="w-5 h-5" /></div>
        </SpotlightCard>
      </div>

      <SpotlightCard className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2"><CalendarDays className="w-5 h-5 text-[#5E6AD2]" /> Consistency Heatmap</h3>
            <p className="text-xs text-foreground-muted mt-1">Daily habit completions over the last 13 weeks</p>
          </div>
          <Badge variant="default">{heatmap.filter((day) => day.count > 0).length} active days</Badge>
        </div>
        <div className="overflow-x-auto pb-1">
          <div className="min-w-[570px]">
            <div className="grid grid-rows-7 grid-flow-col gap-1" style={{ gridTemplateColumns: `repeat(${Math.ceil(heatmap.length / 7)}, minmax(0, 1fr))` }}>
              {heatmap.map((day) => (
                <div
                  key={day.key}
                  title={`${formatDate(day.key)} · ${day.count} completion${day.count === 1 ? '' : 's'}`}
                  aria-label={`${formatDate(day.key)}: ${day.count} completions`}
                  className={`aspect-square rounded-[3px] border transition-colors ${
                    day.intensity === 0 ? 'bg-white/[0.035] border-white/[0.04]' :
                    day.intensity === 1 ? 'bg-indigo-950 border-indigo-900' :
                    day.intensity === 2 ? 'bg-indigo-800 border-indigo-700' :
                    day.intensity === 3 ? 'bg-indigo-600 border-indigo-500' : 'bg-violet-400 border-violet-300'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 text-[10px] text-foreground-muted font-mono">
              <span>{formatDate(heatmap[0].key)}</span>
              <span className="flex items-center gap-1.5">Less <span className="w-2.5 h-2.5 rounded-[2px] bg-white/[0.05]" /><span className="w-2.5 h-2.5 rounded-[2px] bg-indigo-950" /><span className="w-2.5 h-2.5 rounded-[2px] bg-indigo-800" /><span className="w-2.5 h-2.5 rounded-[2px] bg-indigo-600" /><span className="w-2.5 h-2.5 rounded-[2px] bg-violet-400" /> More</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </SpotlightCard>

      <SpotlightCard className="flex items-start gap-4 border border-indigo-400/20 bg-indigo-500/[0.06]">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center text-indigo-300"><Lightbulb className="w-5 h-5" /></div>
        <div>
          <h3 className="text-sm font-bold text-white">Your 30-day insight</h3>
          <p className="text-sm text-foreground-muted mt-1 leading-relaxed">{insight}</p>
        </div>
      </SpotlightCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SpotlightCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2"><PieChart className="w-5 h-5 text-[#5E6AD2]" /> Category Performance</h3>
            <span className="text-xs font-mono text-foreground-muted">30-day completion rate</span>
          </div>
          <div className="space-y-4">
            {categoryStats.map((category) => (
              <div key={category.category} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono gap-2">
                  <span className="text-white font-semibold flex items-center gap-2">{category.category} <Badge variant="default">{category.count} habits</Badge></span>
                  <span className="text-[#5E6AD2] font-bold">{category.rate}%</span>
                </div>
                <ProgressBar percentage={category.rate} color="#5E6AD2" height="h-2.5" />
              </div>
            ))}
          </div>
        </SpotlightCard>

        <SpotlightCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" /> Habit Consistency Leaderboard</h3>
            <span className="text-xs font-mono text-foreground-muted">Ranked by last 30 days</span>
          </div>
          {habitPerformance.length === 0 ? (
            <p className="text-sm text-foreground-muted py-6 text-center">Create a habit to start your leaderboard.</p>
          ) : (
            <div className="space-y-3">
              {habitPerformance.map((habit, index) => (
                <div key={habit.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-mono text-xs font-bold ${index === 0 ? 'bg-amber-500 text-black' : index === 1 ? 'bg-slate-300 text-black' : index === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-foreground-muted'}`}>#{index + 1}</span>
                    <span className="text-xl">{habit.icon}</span>
                    <div className="min-w-0"><h4 className="text-xs font-bold text-white truncate">{habit.name}</h4><Badge variant="category" className="mt-0.5">{habit.category}</Badge></div>
                  </div>
                  <div className="text-right shrink-0"><span className="text-sm font-bold font-mono text-emerald-400 block">{habit.rate}%</span><span className="text-[10px] font-mono text-foreground-muted">{habit.daysCompleted}/30 days</span></div>
                </div>
              ))}
            </div>
          )}
        </SpotlightCard>
      </div>
      <p className="text-[10px] text-foreground-muted flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> Insights are calculated from locally stored habit logs; demo data may be present in a fresh installation.</p>
    </div>
  );
};
