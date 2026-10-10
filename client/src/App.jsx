import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import { BackgroundCanvas } from './components/layout/BackgroundCanvas';
import { Navbar } from './components/layout/Navbar';
import { BentoDashboard } from './components/dashboard/BentoDashboard';
import { HabitList } from './components/habits/HabitList';
import { AddHabitModal } from './components/habits/AddHabitModal';
import { HabitDetailModal } from './components/habits/HabitDetailModal';
import { CalendarView } from './components/calendar/CalendarView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProfileView } from './components/profile/ProfileView';
import { AuthModal } from './components/auth/AuthModal';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null);
  const [habitToDetail, setHabitToDetail] = useState(null);

  useEffect(() => { if (!loading && !user) setIsAuthModalOpen(true); }, [loading, user]);

  const handleOpenAddModal = () => {
    setHabitToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (habit) => {
    setHabitToEdit(habit);
    setIsAddModalOpen(true);
  };

  const handleOpenDetailModal = (habit) => {
    setHabitToDetail(habit);
  };

  return (
    <div className="relative min-h-screen text-[#EDEDEF] selection:bg-[#5E6AD2]/30 selection:text-white">
      {/* 4-Layer Ambient Light Linear Background */}
      <BackgroundCanvas />

      {/* Glass Top Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAuthModal={() => setIsAuthModalOpen(true)} 
      />

      {/* Main Workspace Canvas */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'dashboard' && (
          <BentoDashboard 
            onOpenAddModal={handleOpenAddModal} 
            onOpenDetailModal={handleOpenDetailModal}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'habits' && (
          <HabitList 
            onOpenAddModal={handleOpenAddModal} 
            onOpenEditModal={handleOpenEditModal}
            onOpenDetailModal={handleOpenDetailModal}
          />
        )}

        {activeTab === 'calendar' && <CalendarView />}

        {activeTab === 'analytics' && <AnalyticsView />}

        {activeTab === 'achievements' && <AchievementsView />}

        {activeTab === 'admin' && <AdminDashboard />}

        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Modals */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        habitToEdit={habitToEdit}
      />

      <HabitDetailModal
        isOpen={!!habitToDetail}
        onClose={() => setHabitToDetail(null)}
        habit={habitToDetail}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Footer Branding */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 mt-16 text-center text-xs font-mono text-foreground-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>AuraHabit Systems © 2026 — Linear Design Integration</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-white transition-colors cursor-pointer">API Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HabitProvider>
        <MainApp />
      </HabitProvider>
    </AuthProvider>
  );
}
