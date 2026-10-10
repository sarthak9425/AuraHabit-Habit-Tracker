import React, { useState } from 'react';
import { 
  Zap, 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Trophy, 
  ShieldCheck, 
  User, 
  Bell, 
  Search, 
  LogOut, 
  LogIn,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHabits } from '../../context/HabitContext';
import { Button } from '../ui/Button';

export const Navbar = ({ activeTab, setActiveTab, onOpenAuthModal }) => {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery, notifications, clearNotification } = useHabits();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: 'My Habits', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'achievements', label: 'Badges', icon: Trophy },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: ShieldCheck }] : []),
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#050506]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5E6AD2] to-indigo-400 text-white shadow-linear-accent">
              <Zap className="w-5 h-5 fill-white" />
              <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                AuraHabit <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-foreground-muted border border-white/10">MERN</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-foreground-muted uppercase">Linear Design</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#5E6AD2] text-white shadow-linear-accent'
                      : 'text-foreground-muted hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Notifications, Auth */}
          <div className="flex items-center gap-3">
            
            {/* Search Input Bar (Desktop) */}
            <div className="relative hidden lg:block w-48 xl:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search habits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/[0.04] border border-white/10 rounded-lg text-white placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-foreground-muted hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#5E6AD2] ring-2 ring-[#050506] animate-pulse" />
                )}
              </button>

              {/* Notification Popover Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl p-4 z-50 animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground-muted">Notifications</span>
                    <span className="text-[10px] font-mono text-[#5E6AD2] px-2 py-0.5 rounded bg-[#5E6AD2]/10">{notifications.length} New</span>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-xs text-center py-6 text-foreground-muted">No recent notifications</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold text-white">{n.title}</p>
                            <p className="text-[11px] text-foreground-muted mt-0.5">{n.message}</p>
                            <span className="text-[9px] text-foreground-muted/60 mt-1 block font-mono">{n.time}</span>
                          </div>
                          <button onClick={() => clearNotification(n.id)} className="text-foreground-muted hover:text-white p-1">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Auth / Profile Switcher */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full bg-white/[0.05] border border-white/10 hover:border-white/20 transition-all"
                >
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-accent" />
                  <span className="text-xs font-medium text-white hidden sm:inline">{user.name}</span>
                </button>

                {/* User Menu Dropdown */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <p className="text-[10px] text-foreground-muted font-mono">{user.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-accent/20 text-accent font-bold">
                        {user.role} mode
                      </span>
                    </div>

                    <button
                      onClick={() => { setActiveTab('profile'); setShowUserDropdown(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-foreground-muted hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5" /> Profile Settings
                    </button>

                    <div className="my-1 border-t border-white/[0.08]" />

                    <button
                      onClick={() => { logout().catch((error) => console.error(error)); setShowUserDropdown(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="primary" size="sm" icon={LogIn} onClick={onOpenAuthModal}>
                Sign In
              </Button>
            )}

            {/* Mobile Navigation Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground-muted hover:text-white hover:bg-white/[0.06] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/[0.08] space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#5E6AD2] text-white shadow-linear-accent'
                      : 'text-foreground-muted hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
};
