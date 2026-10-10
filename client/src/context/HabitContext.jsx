import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { mockApi, getTodayString } from '../services/mockApi';
const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]); const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [searchQuery, setSearchQuery] = useState(''); const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); const [notifications, setNotifications] = useState([]);
  const [dataLoading, setDataLoading] = useState(false); const [dataError, setDataError] = useState('');

  const refreshData = useCallback(async () => {
    if (!user) { setHabits([]); setLogs([]); return; }
    setDataLoading(true); setDataError('');
    try { const data = await mockApi.getHabitsAndLogs(); setHabits(data.habits || []); setLogs(data.logs || []); }
    catch (error) { setDataError(error.message); }
    finally { setDataLoading(false); }
  }, [user]);
  useEffect(() => { refreshData(); }, [refreshData]);

  const addNotification = (notif) => setNotifications(prev => [notif, ...prev.slice(0, 9)]);
  const toggleLog = async (habitId, dateStr = selectedDate) => {
    if (!user) return;
    try { const isNowCompleted = await mockApi.toggleHabitLog(user.id, habitId, dateStr); await refreshData();
      const habit = habits.find(h => h.id === habitId);
      if (habit && isNowCompleted) addNotification({ id: `notif_${Date.now()}`, type: 'success', title: 'Habit Completed! 🎉', message: `Awesome job! Marked "${habit.name}" complete for ${dateStr}.`, time: 'Just now' });
    } catch (error) { addNotification({ id: `notif_${Date.now()}`, type: 'error', title: 'Could not update habit', message: error.message, time: 'Just now' }); }
  };
  const addHabit = async (habitData) => {
    if (!user) return;
    try { const newH = await mockApi.addHabit(user.id, habitData); await refreshData(); addNotification({ id: `notif_${Date.now()}`, type: 'info', title: 'Habit Created 🚀', message: `Started tracking "${newH.name}".`, time: 'Just now' }); return newH; }
    catch (error) { addNotification({ id: `notif_${Date.now()}`, type: 'error', title: 'Could not create habit', message: error.message, time: 'Just now' }); throw error; }
  };
  const updateHabit = async (habitId, updates) => { await mockApi.updateHabit(habitId, updates); await refreshData(); };
  const archiveHabit = async (habitId) => { await mockApi.archiveHabit(habitId); await refreshData(); };
  const deleteHabit = async (habitId) => { await mockApi.deleteHabit(habitId); await refreshData(); };
  const clearNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  const todayStr = getTodayString();
  const todayLogsSet = new Set(logs.filter(l => l.date === todayStr && l.completed).map(l => l.habitId));
  const activeHabits = habits.filter(h => !h.archived);
  const completedTodayCount = activeHabits.filter(h => todayLogsSet.has(h.id)).length;
  const totalTodayCount = activeHabits.length;
  const todayPercentage = totalTodayCount > 0 ? Math.round((completedTodayCount / totalTodayCount) * 100) : 0;
  const currentMaxStreak = habits.length ? Math.max(...habits.map(h => h.streak || 0), 0) : 0;
  const longestEverStreak = habits.length ? Math.max(...habits.map(h => h.longestStreak || 0), 0) : 0;
  const filteredHabits = activeHabits.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || (h.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || h.category === categoryFilter;
    const isCompleted = todayLogsSet.has(h.id);
    const matchesStatus = statusFilter === 'All' || (statusFilter === 'Completed' && isCompleted) || (statusFilter === 'Pending' && !isCompleted);
    return matchesSearch && matchesCategory && matchesStatus;
  });
  return <HabitContext.Provider value={{ habits, logs, activeHabits, filteredHabits, selectedDate, setSelectedDate, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, statusFilter, setStatusFilter, toggleLog, addHabit, updateHabit, archiveHabit, deleteHabit, completedTodayCount, totalTodayCount, todayPercentage, currentMaxStreak, longestEverStreak, todayLogsSet, notifications, addNotification, clearNotification, refreshData, dataLoading, dataError }}>{children}</HabitContext.Provider>;
};
export const useHabits = () => useContext(HabitContext);
