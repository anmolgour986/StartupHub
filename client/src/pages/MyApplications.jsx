import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { applicationAPI } from '../services/api';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonRow } from '../components/ui/Skeleton';
import { APPLICATION_STATUS_COLORS, formatRelativeTime, STATUS_COLORS } from '../utils/helpers';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await applicationAPI.mine();
        setApplications(data.applications);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track the status of startups you've applied to.</p>
      </div>

      {loading ? (
        <div className="card divide-y divide-gray-100 dark:divide-gray-800">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="Apply to startups from the Discover page to see them here."
          action={<Link to="/discover" className="btn-primary">Discover Startups</Link>}
        />
      ) : (
        <div className="card divide-y divide-gray-100 dark:divide-gray-800">
          {applications.map((app) => (
            <Link key={app._id} to={`/startups/${app.startup?._id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              {app.startup?.logo ? (
                <img src={app.startup.logo} className="w-11 h-11 rounded-xl object-cover" alt="" />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold shrink-0">
                  {app.startup?.name?.[0]}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium truncate">{app.startup?.name}</p>
                  {app.startup?.status && <span className={`badge ${STATUS_COLORS[app.startup.status]}`}>{app.startup.status}</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{app.startup?.tagline}</p>
              </div>
              <div className="text-right shrink-0">
                <span className={`badge ${APPLICATION_STATUS_COLORS[app.status]}`}>{app.status}</span>
                <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(app.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
