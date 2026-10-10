import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Flame, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Archive, 
  Trash2, 
  Edit3, 
  BarChart2, 
  Grid, 
  List,
  Sparkles
} from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

export const HabitList = ({ onOpenAddModal, onOpenEditModal, onOpenDetailModal }) => {
  const { 
    filteredHabits, 
    searchQuery, 
    setSearchQuery, 
    categoryFilter, 
    setCategoryFilter, 
    statusFilter, 
    setStatusFilter,
    toggleLog,
    todayLogsSet,
    archiveHabit,
    deleteHabit
  } = useHabits();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeActionMenu, setActiveActionMenu] = useState(null);

  const categories = ['All', 'Health', 'Study', 'Personal', 'Work', 'Fitness', 'Mindfulness'];
  const statuses = ['All', 'Pending', 'Completed'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#5E6AD2] uppercase font-semibold block mb-1">
            Habit Management Workspace
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-gradient-white">My Active Habits</h1>
          <p className="text-sm text-foreground-muted mt-1">
            Configure goals, track streaks, and optimize your routine daily.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={onOpenAddModal}>
          Create New Habit
        </Button>
      </div>

      {/* Control Bar — Search, Category Filters, View Switcher */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#0a0a0c] p-3 rounded-2xl border border-white/[0.08]">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search by habit name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-foreground-muted focus:outline-none focus:border-accent"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-[#5E6AD2] text-white shadow-linear-accent'
                  : 'bg-white/[0.03] text-foreground-muted hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter & View Toggle */}
        <div className="flex items-center gap-2">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/[0.04] border border-white/10 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-[#0a0a0c] text-white">
                {s} Status
              </option>
            ))}
          </select>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#5E6AD2] text-white' : 'text-foreground-muted hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#5E6AD2] text-white' : 'text-foreground-muted hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Habit Cards Container */}
      {filteredHabits.length === 0 ? (
        <SpotlightCard className="text-center py-16">
          <Sparkles className="w-10 h-10 text-foreground-muted mx-auto opacity-40 mb-3" />
          <h3 className="text-lg font-semibold text-white">No Habits Found</h3>
          <p className="text-xs text-foreground-muted max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search term or category filters, or add a new habit to start tracking.
          </p>
          <Button variant="primary" size="md" icon={Plus} onClick={onOpenAddModal}>
            Add Habit
          </Button>
        </SpotlightCard>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHabits.map((habit) => {
            const isCompleted = todayLogsSet.has(habit.id);
            return (
              <SpotlightCard key={habit.id} className="group relative flex flex-col justify-between space-y-4">
                
                {/* Top Row: Icon, Category & Actions */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shadow-inner"
                      style={{ 
                        backgroundColor: `${habit.color}15`, 
                        borderColor: `${habit.color}40` 
                      }}
                    >
                      {habit.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors">
                        {habit.name}
                      </h3>
                      <Badge variant="category" className="mt-1">{habit.category}</Badge>
                    </div>
                  </div>

                  {/* Actions Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveActionMenu(activeActionMenu === habit.id ? null : habit.id)}
                      className="p-1.5 rounded-lg text-foreground-muted hover:text-white hover:bg-white/[0.08]"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeActionMenu === habit.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl p-1 z-30 animate-in zoom-in-95">
                        <button
                          onClick={() => { onOpenDetailModal(habit); setActiveActionMenu(null); }}
                          className="w-full text-left px-3 py-1.5 text-xs text-foreground-muted hover:text-white hover:bg-white/[0.06] rounded-lg flex items-center gap-2"
                        >
                          <BarChart2 className="w-3.5 h-3.5" /> Analytics
                        </button>
                        <button
                          onClick={() => { onOpenEditModal(habit); setActiveActionMenu(null); }}
                          className="w-full text-left px-3 py-1.5 text-xs text-foreground-muted hover:text-white hover:bg-white/[0.06] rounded-lg flex items-center gap-2"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit Habit
                        </button>
                        <button
                          onClick={() => { archiveHabit(habit.id); setActiveActionMenu(null); }}
                          className="w-full text-left px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-500/10 rounded-lg flex items-center gap-2"
                        >
                          <Archive className="w-3.5 h-3.5" /> Archive
                        </button>
                        <button
                          onClick={() => { deleteHabit(habit.id); setActiveActionMenu(null); }}
                          className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Habit Stats Row */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] font-mono text-foreground-muted block">Streak</span>
                    <span className="text-sm font-bold text-amber-400 font-mono flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" /> {habit.streak || 0} Days
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] font-mono text-foreground-muted block">Target Goal</span>
                    <span className="text-xs font-semibold text-white font-mono truncate block mt-0.5">{habit.goal}</span>
                  </div>
                </div>

                {/* Quick Toggle Complete Button */}
                <button
                  onClick={() => toggleLog(habit.id)}
                  className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all duration-200 ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-white/[0.05] hover:bg-accent hover:text-white text-white border border-white/10'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'fill-emerald-400 text-black' : ''}`} />
                  <span>{isCompleted ? 'Completed Today ✅' : 'Mark as Complete'}</span>
                </button>

              </SpotlightCard>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-3">
          {filteredHabits.map((habit) => {
            const isCompleted = todayLogsSet.has(habit.id);
            return (
              <div
                key={habit.id}
                className="p-4 rounded-2xl bg-[#0a0a0c] border border-white/[0.06] hover:border-white/20 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLog(habit.id)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-emerald-500 text-white' : 'border border-white/20 text-transparent hover:text-accent'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 fill-current" />
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{habit.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{habit.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="category">{habit.category}</Badge>
                        <span className="text-[10px] font-mono text-foreground-muted">{habit.goal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-amber-400 font-mono block">{habit.streak || 0}d Streak</span>
                    <span className="text-[10px] font-mono text-foreground-muted">Reminder: {habit.reminder}</span>
                  </div>

                  <Button variant="secondary" size="sm" onClick={() => onOpenDetailModal(habit)}>
                    Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
