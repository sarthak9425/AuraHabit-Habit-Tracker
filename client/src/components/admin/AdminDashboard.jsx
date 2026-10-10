import React, { useState } from 'react';
import { ShieldCheck, Users, Activity, Database, Key } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { mockApi } from '../../services/mockApi';

export const AdminDashboard = () => {
  const [userList, setUserList] = useState([]);
  const [totalHabitsCount, setTotalHabitsCount] = useState(0);
  const [loadError, setLoadError] = useState('');
  React.useEffect(() => { mockApi.getAdminStats().then((data) => { setUserList(data.users || []); setTotalHabitsCount(data.habitsCount || 0); }).catch((error) => setLoadError(error.message)); }, []);

  const totalUsers = userList.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Workspace Header */}
      <div className="border-b border-white/[0.08] pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono tracking-widest text-purple-400 uppercase font-semibold flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4" /> System Administration Mode
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-gradient-white">Admin Operations Panel</h1>
          <p className="text-sm text-foreground-muted mt-1">
            Manage user accounts, inspect global system metrics, and audit category settings.
          </p>
        </div>

        <Badge variant="accent" icon={Key}>
          Superuser Access
        </Badge>
      </div>

      {loadError && <p className="text-sm text-amber-300">Admin metrics unavailable: {loadError}</p>}
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <SpotlightCard className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-foreground-muted uppercase block">Total Registered Users</span>
            <span className="text-2xl font-bold text-white font-mono mt-1 block">{totalUsers}</span>
            <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">Registered accounts</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-foreground-muted uppercase block">System Habits Count</span>
            <span className="text-2xl font-bold text-accent font-mono mt-1 block">{totalHabitsCount}</span>
            <span className="text-[10px] text-accent font-mono mt-0.5 block">Stored in MongoDB</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-foreground-muted uppercase block">Database Engine</span>
            <span className="text-sm font-bold text-emerald-400 font-mono mt-1 block">MongoDB</span>
            <span className="text-[10px] text-foreground-muted font-mono mt-0.5 block">Persistent database</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-foreground-muted uppercase block">System Status</span>
            <span className="text-sm font-bold text-white font-mono mt-1 block">API Connected</span>
            <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">Metrics loaded from API</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </SpotlightCard>

      </div>

      {/* User Management Table */}
      <SpotlightCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" /> User Directory Management
          </h3>
          <span className="text-xs font-mono text-foreground-muted">{userList.length} User Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground-muted">
            <thead className="bg-white/[0.03] text-white font-mono text-[10px] uppercase">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined Date</th>
                <th className="px-4 py-3 text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {userList.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 flex items-center gap-3 font-semibold text-white">
                    <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                    <span>{u.name}</span>
                  </td>
                  <td className="px-4 py-3 font-mono">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === 'admin' ? 'accent' : 'default'}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 font-mono">{u.joinedDate}</td>
                  <td className="px-4 py-3 text-right text-foreground-muted">Read-only</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SpotlightCard>

    </div>
  );
};
