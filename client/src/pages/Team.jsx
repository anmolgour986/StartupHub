import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Github, Linkedin, Globe, UserMinus, Users } from 'lucide-react';
import { useState } from 'react';
import { useStartup } from '../hooks/useStartup';
import { startupAPI } from '../services/api';
import { FullPageSpinner } from '../components/ui/Spinner';
import StartupHeader from '../components/startup/StartupHeader';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const Team = () => {
  const { id } = useParams();
  const { startup, loading, isFounder, isTeamMember, reload } = useStartup(id);
  const [removeTarget, setRemoveTarget] = useState(null);

  if (loading) return <FullPageSpinner />;
  if (!startup) return null;

  const handleRemove = async () => {
    try {
      await startupAPI.removeTeamMember(id, removeTarget._id);
      toast.success('Removed from team');
      setRemoveTarget(null);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <div className="space-y-6">
      <StartupHeader startup={startup} isFounder={isFounder} isTeamMember={isTeamMember} activeTab="Team" />

      {startup.team?.length === 0 ? (
        <EmptyState icon={Users} title="No team members yet" description="Accepted applicants will appear here." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {startup.team.map((t) => (
            <div key={t.user?._id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar user={t.user} size="lg" />
                  <div>
                    <p className="font-semibold">{t.user?.name}</p>
                    <p className="text-xs text-gray-400">{t.roleTitle}</p>
                  </div>
                </div>
                {isFounder && String(t.user?._id) !== String(startup.founder._id) && (
                  <button onClick={() => setRemoveTarget(t.user)} className="btn-ghost !p-1.5 text-red-500" title="Remove from team">
                    <UserMinus size={16} />
                  </button>
                )}
              </div>

              {t.user?.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {t.user.skills.slice(0, 4).map((s) => (
                    <span key={s} className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">{s}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                {t.user?.github && (
                  <a href={t.user.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><Github size={16} /></a>
                )}
                {t.user?.linkedin && (
                  <a href={t.user.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><Linkedin size={16} /></a>
                )}
                {t.user?.portfolio && (
                  <a href={t.user.portfolio} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><Globe size={16} /></a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        title={`Remove ${removeTarget?.name} from the team?`}
        description="They will lose access to tasks, files, and team chat for this startup."
        confirmText="Remove"
      />
    </div>
  );
};

export default Team;
