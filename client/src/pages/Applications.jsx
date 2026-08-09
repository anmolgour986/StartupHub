import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check, X, ClipboardList, Github, Linkedin, Globe } from 'lucide-react';
import { useStartup } from '../hooks/useStartup';
import { applicationAPI } from '../services/api';
import { FullPageSpinner } from '../components/ui/Spinner';
import StartupHeader from '../components/startup/StartupHeader';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import { APPLICATION_STATUS_COLORS, formatRelativeTime } from '../utils/helpers';

const FILTERS = ['pending', 'accepted', 'rejected', 'all'];

const Applications = () => {
  const { id } = useParams();
  const { startup, loading: startupLoading, isFounder, isTeamMember } = useStartup(id);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [actingId, setActingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await applicationAPI.forStartup(id, { status: filter === 'all' ? undefined : filter });
      setApplications(data.applications);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, filter]);

  const act = async (appId, status) => {
    setActingId(appId);
    try {
      await applicationAPI.updateStatus(appId, status);
      toast.success(status === 'accepted' ? 'Application accepted!' : 'Application rejected');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActingId(null);
    }
  };

  if (startupLoading) return <FullPageSpinner />;
  if (!startup) return null;

  return (
    <div className="space-y-6">
      <StartupHeader startup={startup} isFounder={isFounder} isTeamMember={isTeamMember} activeTab="Applications" />

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">Loading applications...</div>
      ) : applications.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications here" description="Applications matching this filter will show up here." />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <Avatar user={app.applicant} size="lg" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{app.applicant.name}</p>
                      <span className={`badge ${APPLICATION_STATUS_COLORS[app.status]}`}>{app.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">@{app.applicant.username} · Applied {formatRelativeTime(app.createdAt)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 max-w-xl">{app.message}</p>
                    {app.experience && <p className="text-xs text-gray-400 mt-2 max-w-xl">Experience: {app.experience}</p>}
                    {app.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {app.skills.map((s) => (
                          <span key={s} className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">{s}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      {app.applicant.github && <a href={app.applicant.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><Github size={15} /></a>}
                      {app.applicant.linkedin && <a href={app.applicant.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><Linkedin size={15} /></a>}
                      {app.applicant.portfolio && <a href={app.applicant.portfolio} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><Globe size={15} /></a>}
                    </div>
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button disabled={actingId === app._id} onClick={() => act(app._id, 'accepted')} className="btn-primary !bg-emerald-600 hover:!bg-emerald-700 !py-2">
                      <Check size={15} /> Accept
                    </button>
                    <button disabled={actingId === app._id} onClick={() => act(app._id, 'rejected')} className="btn-danger !py-2">
                      <X size={15} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
