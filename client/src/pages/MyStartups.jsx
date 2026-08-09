import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Rocket } from 'lucide-react';
import { startupAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StartupCard from '../components/startup/StartupCard';
import { SkeletonGrid } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const MyStartups = () => {
  const { user } = useAuth();
  const [owned, setOwned] = useState([]);
  const [joined, setJoined] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('owned');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await startupAPI.mine();
        setOwned(data.owned);
        setJoined(data.joined);
        if (data.owned.length === 0 && data.joined.length > 0) setTab('joined');
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const active = tab === 'owned' ? owned : joined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Startups</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage the projects you own or are part of.</p>
        </div>
        {user?.role === 'founder' && (
          <Link to="/startups/new" className="btn-primary">
            <Plus size={16} /> New Startup
          </Link>
        )}
      </div>

      <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setTab('owned')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'owned' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500'
          }`}
        >
          Owned ({owned.length})
        </button>
        <button
          onClick={() => setTab('joined')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'joined' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500'
          }`}
        >
          Joined ({joined.length})
        </button>
      </div>

      {loading ? (
        <SkeletonGrid count={3} />
      ) : active.length === 0 ? (
        <EmptyState
          icon={Rocket}
          title={tab === 'owned' ? 'No startups yet' : "You haven't joined any startups"}
          description={tab === 'owned' ? 'Create your first startup to start building your team.' : 'Apply to startups from the Discover page to join a team.'}
          action={
            <Link to={tab === 'owned' ? '/startups/new' : '/discover'} className="btn-primary">
              {tab === 'owned' ? 'Create Startup' : 'Discover Startups'}
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {active.map((s, i) => <StartupCard key={s._id} startup={s} index={i} />)}
        </div>
      )}
    </div>
  );
};

export default MyStartups;
