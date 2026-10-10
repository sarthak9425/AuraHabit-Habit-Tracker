import React from 'react';
import { Trophy, Flame, Zap, Award, Star, CheckCircle, ShieldCheck, Lock } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Badge } from '../ui/Badge';

export const AchievementsView = () => {
  const { currentMaxStreak, longestEverStreak, logs, activeHabits } = useHabits();

  const totalLogs = logs.filter((log) => log.completed).length;
  const habitIds = new Set(activeHabits.map((habit) => habit.id));
  const completedByDate = new Map();
  logs.filter((log) => log.completed && habitIds.has(log.habitId)).forEach((log) => {
    const completed = completedByDate.get(log.date) || new Set();
    completed.add(log.habitId);
    completedByDate.set(log.date, completed);
  });
  const completedAllHabitsInADay = activeHabits.length > 0 && [...completedByDate.values()]
    .some((completed) => activeHabits.every((habit) => completed.has(habit.id)));
  const completedMorningHabit = logs.some((log) => {
    if (!log.completed || !habitIds.has(log.habitId) || !log.timestamp) return false;
    const completedAt = new Date(log.timestamp);
    return !Number.isNaN(completedAt.getTime()) && completedAt.getHours() < 8;
  });

  const ACHIEVEMENTS_LIST = [
    {
      id: 'ach_1',
      title: '7-Day Ignition 🔥',
      description: 'Maintain an uninterrupted 7-day habit streak.',
      icon: Flame,
      unlocked: currentMaxStreak >= 7 || longestEverStreak >= 7,
      progress: Math.min(currentMaxStreak, 7),
      target: 7,
      color: 'amber'
    },
    {
      id: 'ach_2',
      title: '30-Day Master 🏆',
      description: 'Reach a 30-day streak on any core habit.',
      icon: Trophy,
      unlocked: longestEverStreak >= 30,
      progress: Math.min(longestEverStreak, 30),
      target: 30,
      color: 'indigo'
    },
    {
      id: 'ach_3',
      title: 'Centurion Club 💯',
      description: 'Log 100 total habit completions in system history.',
      icon: Award,
      unlocked: totalLogs >= 100,
      progress: Math.min(totalLogs, 100),
      target: 100,
      color: 'emerald'
    },
    {
      id: 'ach_4',
      title: 'Daily Perfectionist ⚡',
      description: 'Complete 100% of scheduled habits in a single day.',
      icon: Zap,
      unlocked: completedAllHabitsInADay,
      progress: completedAllHabitsInADay ? 1 : 0,
      target: 1,
      color: 'purple'
    },
    {
      id: 'ach_5',
      title: 'Early Bird Practitioner 🌅',
      description: 'Log a morning habit before 8:00 AM.',
      icon: Star,
      unlocked: completedMorningHabit,
      progress: completedMorningHabit ? 1 : 0,
      target: 1,
      color: 'cyan'
    },
    {
      id: 'ach_6',
      title: 'Century Streak Titan 🛡️',
      description: 'Achieve an legendary 100-day habit streak.',
      icon: ShieldCheck,
      unlocked: longestEverStreak >= 100,
      progress: Math.min(longestEverStreak, 100),
      target: 100,
      color: 'rose'
    }
  ];

  const unlockedCount = ACHIEVEMENTS_LIST.filter(a => a.unlocked).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#5E6AD2] uppercase font-semibold block mb-1">
            Gamification Engine
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-gradient-white">Milestones & Achievements</h1>
          <p className="text-sm text-foreground-muted mt-1">
            Unlock badges, build momentum, and celebrate your behavior consistency.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#0a0a0c] p-3 rounded-xl border border-white/10">
          <Trophy className="w-6 h-6 text-amber-400" />
          <div>
            <span className="text-[10px] font-mono text-foreground-muted block uppercase">Badges Unlocked</span>
            <span className="text-lg font-bold text-white font-mono">{unlockedCount} / {ACHIEVEMENTS_LIST.length}</span>
          </div>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACHIEVEMENTS_LIST.map((ach) => {
          const Icon = ach.icon;
          return (
            <SpotlightCard
              key={ach.id}
              className={`space-y-4 relative ${
                ach.unlocked ? 'border-accent/40 bg-[#0d0d14]' : 'opacity-60 grayscale hover:grayscale-0 transition-all'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  ach.unlocked ? 'bg-[#5E6AD2]/20 border border-[#5E6AD2]/40 text-[#818CF8]' : 'bg-white/5 border border-white/10 text-foreground-muted'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>

                <Badge variant={ach.unlocked ? 'success' : 'default'} icon={ach.unlocked ? CheckCircle : Lock}>
                  {ach.unlocked ? 'Unlocked' : 'Locked'}
                </Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{ach.title}</h3>
                <p className="text-xs text-foreground-muted mt-1 leading-relaxed">{ach.description}</p>
              </div>

              {/* Progress Indicator */}
              <div className="pt-2 border-t border-white/[0.06] space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-foreground-muted">
                  <span>Progress</span>
                  <span className="text-white font-bold">{ach.progress} / {ach.target}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#5E6AD2] rounded-full transition-all duration-500"
                    style={{ width: `${(ach.progress / ach.target) * 100}%` }}
                  />
                </div>
              </div>

            </SpotlightCard>
          );
        })}
      </div>

    </div>
  );
};
