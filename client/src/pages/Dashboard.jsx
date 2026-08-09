import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ClipboardList, CheckSquare, Users, Plus, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { startupAPI, applicationAPI, taskAPI } from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import StartupCard from '../components/startup/StartupCard';
import { SkeletonGrid } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { STATUS_COLORS, PRIORITY_COLORS, formatRelativeTime } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [owned, setOwned] = useState([]);
  const [joined, setJoined] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [startupsRes, appsRes, tasksRes] = await Promise.all([
          startupAPI.mine(),
          applicationAPI.mine(),
          taskAPI.mine(),
        ]);
        setOwned(startupsRes.data.owned);
        setJoined(startupsRes.data.joined);
        setApplications(appsRes.data.applications);
        setTasks(tasksRes.data.tasks);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chartData = [
    { name: 'Todo', value: tasks.filter((t) => t.status === 'todo').length },
    { name: 'In Progress', value: tasks.filter((t) => t.status === 'in-progress').length },
    { name: 'Review', value: tasks.filter((t) => t.status === 'review').length },
    { name: 'Done', value: tasks.filter((t) => t.status === 'completed').length },
  ];

  const allStartups = [...owned, ...joined];
  const isFounder = user?.role === 'founder';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here's what's happening across your projects.</p>
        </div>
        {isFounder && (
          <Link to="/startups/new" className="btn-primary">
            <Plus size={16} /> New Startup
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Rocket} label={isFounder ? 'Startups Founded' : 'Startups Joined'} value={isFounder ? owned.length : joined.length} accent="brand" />
        <StatCard icon={ClipboardList} label="Applications" value={applications.length} accent="orange" />
        <StatCard icon={CheckSquare} label="Assigned Tasks" value={tasks.length} accent="emerald" />
        <StatCard icon={Users} label="Total Projects" value={allStartups.length} accent="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-semibold mb-4">Task Progress</h3>
          {tasks.length === 0 ? (
            <EmptyState icon={CheckSquare} title="No tasks yet" description="Tasks assigned to you will show progress here." />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(109,84,249,0.06)' }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" fill="#6d54f9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {applications.slice(0, 4).map((a) => (
              <div key={a._id} className="flex items-start gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${a.status === 'accepted' ? 'bg-emerald-500' : a.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Applied to <span className="font-medium">{a.startup?.name}</span>
                  </p>
                  <p className="text-xs text-gray-400">{formatRelativeTime(a.createdAt)}</p>
                </div>
              </div>
            ))}
            {applications.length === 0 && <p className="text-sm text-gray-400">No recent activity</p>}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Your Startups</h3>
          <Link to="/my-startups" className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <SkeletonGrid count={3} />
        ) : allStartups.length === 0 ? (
          <EmptyState
            icon={Rocket}
            title={isFounder ? 'No startups yet' : "You haven't joined any startups"}
            description={isFounder ? 'Create your first startup to start building your team.' : 'Discover startups looking for people like you.'}
            action={
              <Link to={isFounder ? '/startups/new' : '/discover'} className="btn-primary">
                {isFounder ? 'Create Startup' : 'Discover Startups'}
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allStartups.slice(0, 3).map((s, i) => (
              <StartupCard key={s._id} startup={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
