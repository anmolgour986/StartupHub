import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Users, Rocket, ClipboardList, CheckSquare, ShieldOff, ShieldCheck, EyeOff, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { adminAPI } from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import Avatar from '../components/ui/Avatar';
import { formatDate } from '../utils/helpers';

const COLORS = ['#6d54f9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [startups, setStartups] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, startupsRes] = await Promise.all([adminAPI.stats(), adminAPI.users(), adminAPI.startups()]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setStartups(startupsRes.data.startups);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleUser = async (id) => {
    try {
      await adminAPI.toggleUserStatus(id);
      toast.success('User status updated');
      load();
    } catch {
      toast.error('Failed to update user');
    }
  };

  const toggleStartup = async (id) => {
    try {
      await adminAPI.toggleStartupStatus(id);
      toast.success('Startup status updated');
      load();
    } catch {
      toast.error('Failed to update startup');
    }
  };

  if (loading) return <div className="text-sm text-gray-400">Loading admin panel...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Platform-wide oversight and moderation tools.</p>
      </div>

      <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800">
        {['overview', 'users', 'startups'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Users" value={stats.totalUsers} accent="brand" />
            <StatCard icon={Rocket} label="Total Startups" value={stats.totalStartups} accent="emerald" />
            <StatCard icon={ClipboardList} label="Applications" value={stats.totalApplications} accent="orange" />
            <StatCard icon={CheckSquare} label="Tasks" value={stats.totalTasks} accent="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Users by Role</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.usersByRole} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label>
                      {stats.usersByRole.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold mb-4">Startups by Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.startupsByStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label>
                      {stats.startupsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="card divide-y divide-gray-100 dark:divide-gray-800">
          {users.map((u) => (
            <div key={u._id} className="flex items-center gap-4 p-4">
              <Avatar user={u} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{u.name} <span className="text-gray-400 font-normal">@{u.username}</span></p>
                <p className="text-xs text-gray-400">{u.email} · <span className="capitalize">{u.role}</span> · Joined {formatDate(u.createdAt)}</p>
              </div>
              <span className={`badge ${u.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                {u.isActive ? 'Active' : 'Deactivated'}
              </span>
              <button onClick={() => toggleUser(u._id)} className="btn-ghost !p-2 rounded-lg" title={u.isActive ? 'Deactivate' : 'Activate'}>
                {u.isActive ? <ShieldOff size={16} className="text-red-500" /> : <ShieldCheck size={16} className="text-emerald-500" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'startups' && (
        <div className="card divide-y divide-gray-100 dark:divide-gray-800">
          {startups.map((s) => (
            <div key={s._id} className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold shrink-0">
                {s.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{s.name}</p>
                <p className="text-xs text-gray-400">by {s.founder?.name} · {formatDate(s.createdAt)}</p>
              </div>
              <span className={`badge ${s.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                {s.isActive ? 'Visible' : 'Hidden'}
              </span>
              <button onClick={() => toggleStartup(s._id)} className="btn-ghost !p-2 rounded-lg" title={s.isActive ? 'Hide' : 'Unhide'}>
                {s.isActive ? <EyeOff size={16} className="text-red-500" /> : <Eye size={16} className="text-emerald-500" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
