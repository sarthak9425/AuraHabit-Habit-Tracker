import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, XCircle, AlertCircle, Flame } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Badge } from '../ui/Badge';
import { getTodayString } from '../../services/mockApi';

export const CalendarView = () => {
  const { activeHabits, logs, selectedDate, setSelectedDate } = useHabits();
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  // First day of month & number of days in month
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday start index 0-6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Get habits logged for selected date
  const habitsForSelectedDate = activeHabits.map(habit => {
    const isDone = logs.some(l => l.habitId === habit.id && l.date === selectedDate && l.completed);
    return { ...habit, isDone };
  });

  const selectedDateCompletedCount = habitsForSelectedDate.filter(h => h.isDone).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#5E6AD2] uppercase font-semibold block mb-1">
            Historical Matrix
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-gradient-white">Interactive Calendar</h1>
          <p className="text-sm text-foreground-muted mt-1">
            Review past performance, inspect daily logs, and track monthly consistency.
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-3 bg-[#0a0a0c] p-1.5 rounded-xl border border-white/10">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg text-foreground-muted hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold font-mono text-white px-3 min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg text-foreground-muted hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Calendar Matrix + Right Day Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        
        {/* Calendar Matrix (Span 5) */}
        <SpotlightCard className="lg:col-span-5 p-6">
          
          {/* Day Headers (Mon - Sun) */}
          <div className="grid grid-cols-7 gap-2 mb-3 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <span key={day} className="text-xs font-mono font-bold text-foreground-muted uppercase tracking-wider py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Day Tiles */}
          <div className="grid grid-cols-7 gap-2">
            
            {/* Empty padding tiles for previous month */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty_${idx}`} className="h-20 sm:h-24 rounded-xl bg-white/[0.01] border border-white/[0.02]" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
              const dayNum = dayIdx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === getTodayString();

              // Calculate logs for this date
              const dayLogs = logs.filter(l => l.date === dateStr && l.completed);
              const completedCount = dayLogs.length;
              const totalHabits = activeHabits.length;
              const percentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-20 sm:h-24 p-2 rounded-xl border flex flex-col justify-between text-left transition-all duration-200 relative ${
                    isSelected
                      ? 'bg-[#5E6AD2]/20 border-accent shadow-linear-accent ring-2 ring-accent/50'
                      : isToday
                      ? 'bg-indigo-950/30 border-indigo-500/50'
                      : 'bg-white/[0.03] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${isToday ? 'text-accent' : 'text-white'}`}>
                      {dayNum}
                    </span>
                    {isToday && (
                      <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-accent/30 text-accent font-bold">
                        TODAY
                      </span>
                    )}
                  </div>

                  {/* Visual Status Indicator */}
                  {totalHabits > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-foreground-muted">{completedCount}/{totalHabits}</span>
                        <span className="font-bold text-white">{percentage}%</span>
                      </div>
                      
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percentage === 100 ? 'bg-emerald-500' : percentage > 50 ? 'bg-indigo-400' : percentage > 0 ? 'bg-amber-400' : 'bg-transparent'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}

          </div>

        </SpotlightCard>

        {/* Selected Day Inspector (Span 2) */}
        <SpotlightCard className="lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="border-b border-white/[0.08] pb-3">
              <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-wider block">Selected Date Log</span>
              <h3 className="text-lg font-bold text-white font-mono mt-0.5">{selectedDate}</h3>
              <p className="text-xs text-foreground-muted mt-1">
                {selectedDateCompletedCount} of {activeHabits.length} habits logged complete
              </p>
            </div>

            {/* Habit Breakdown for Selected Date */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {habitsForSelectedDate.map(h => (
                <div
                  key={h.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    h.isDone 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                      : 'bg-white/[0.02] border-white/[0.06] text-foreground-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{h.icon}</span>
                    <span className="text-xs font-semibold text-white">{h.name}</span>
                  </div>
                  {h.isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-foreground-muted/40 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

          </div>

          <div className="pt-4 border-t border-white/[0.08] text-center">
            <span className="text-[11px] font-mono text-foreground-muted">
              Select any date box to inspect log history.
            </span>
          </div>
        </SpotlightCard>

      </div>
    </div>
  );
};
