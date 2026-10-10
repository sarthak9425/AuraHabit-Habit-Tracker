import React, { useState } from 'react';
import { User, Download, Upload, Shield, Bell, Moon, Volume2, Save, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHabits } from '../../context/HabitContext';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Button } from '../ui/Button';
import { mockApi } from '../../services/mockApi';

export const ProfileView = () => {
  const { user, setUser } = useAuth();
  const { addNotification, refreshData } = useHabits();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || 'Productivity Enthusiast',
    timezone: 'UTC+05:30 (IST)'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importText, setImportText] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try { const updated = await mockApi.updateProfile({ name: formData.name, bio: formData.bio }); setUser(updated); setSavedSuccess(true); setTimeout(() => setSavedSuccess(false), 3000); } catch (error) { alert(error.message); return; }
    addNotification({
      id: `notif_${Date.now()}`,
      type: 'success',
      title: 'Profile Saved',
      message: 'Your profile settings have been updated.',
      time: 'Just now'
    });
  };

  const handleExportJSON = async () => {
    if (!user) return;
    let data;
    try { data = await mockApi.exportUserData(); } catch (error) { alert(error.message); return; }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurahabit_backup_${user.name}_${Date.now()}.json`;
    a.click();
  };

  const handleImportJSON = async () => {
    if (!user || !importText.trim()) return;
    try { await mockApi.importUserData(user.id, importText); await refreshData(); alert('Data imported successfully!'); setImportText(''); } catch (error) { alert(error.message || 'Invalid JSON backup file.'); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Workspace Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <span className="text-xs font-mono tracking-widest text-[#5E6AD2] uppercase font-semibold block mb-1">
          Account & Configuration
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gradient-white">Profile & Preferences</h1>
        <p className="text-sm text-foreground-muted mt-1">
          Update account details, export JSON backup files, and customize app settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Details Form (Span 2) */}
        <SpotlightCard className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-[#5E6AD2]" /> Account Information
            </h3>
            {savedSuccess && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4 pb-2">
              <img src={user?.avatar} alt={user?.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-accent" />
              <div>
                <h4 className="text-base font-bold text-white">{user?.name}</h4>
                <p className="text-xs text-foreground-muted font-mono">{user?.email}</p>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-accent font-bold mt-1 inline-block">
                  Role: {user?.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-foreground-muted mb-1 uppercase">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#050506] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-foreground-muted mb-1 uppercase">Email Address</label>
                <input
                  type="email"
                  readOnly
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-[#050506] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-foreground-muted mb-1 uppercase">Bio / Goal Tagline</label>
              <input
                type="text"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 bg-[#050506] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="md" type="submit" icon={Save}>
                Save Changes
              </Button>
            </div>
          </form>
        </SpotlightCard>

        {/* Data Backup & Export/Import (Span 1) */}
        <SpotlightCard className="space-y-6">
          <div className="border-b border-white/[0.08] pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-400" /> Data Backup & Migration
            </h3>
            <p className="text-xs text-foreground-muted mt-1">
              Export your full habits & completion history as JSON or restore from backup.
            </p>
          </div>

          <div className="space-y-3">
            <Button variant="secondary" size="md" className="w-full" icon={Download} onClick={handleExportJSON}>
              Export JSON Backup
            </Button>

            <div className="pt-3 border-t border-white/[0.08] space-y-2">
              <label className="block text-xs font-mono text-foreground-muted uppercase">Paste JSON to Restore</label>
              <textarea
                rows={3}
                placeholder="Paste JSON string here..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full p-2.5 bg-[#050506] border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-accent"
              />
              <Button variant="ghost" size="sm" className="w-full" icon={Upload} onClick={handleImportJSON}>
                Restore Data
              </Button>
            </div>
          </div>
        </SpotlightCard>

      </div>
    </div>
  );
};
