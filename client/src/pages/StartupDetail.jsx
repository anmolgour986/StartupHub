import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Users, BarChart3 } from 'lucide-react';
import { applicationAPI, startupAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useStartup } from '../hooks/useStartup';
import { FullPageSpinner } from '../components/ui/Spinner';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StartupHeader from '../components/startup/StartupHeader';

const StartupDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { startup, loading, isFounder, isTeamMember } = useStartup(id);
  const [applyOpen, setApplyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  if (loading) return <FullPageSpinner />;
  if (!startup) return null;

  const onApply = async (formData) => {
    setApplying(true);
    try {
      await applicationAPI.apply({
        startupId: id,
        message: formData.message,
        skills: user.skills || [],
        experience: formData.experience,
      });
      toast.success('Application submitted!');
      setApplyOpen(false);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const onDelete = async () => {
    try {
      await startupAPI.remove(id);
      toast.success('Startup deleted');
      navigate('/my-startups');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <StartupHeader
        startup={startup}
        isFounder={isFounder}
        isTeamMember={isTeamMember}
        activeTab="Overview"
        canApply={!isTeamMember && user.role !== 'admin'}
        onApply={() => setApplyOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-semibold mb-3">About</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{startup.description}</p>

          {startup.requiredSkills?.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Skills needed</h4>
              <div className="flex flex-wrap gap-2">
                {startup.requiredSkills.map((s) => (
                  <span key={s} className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">{s}</span>
                ))}
              </div>
            </div>
          )}

          {startup.tags?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {startup.tags.map((t) => (
                  <span key={t} className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">#{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Users size={15} /> Founder</h4>
            <div className="flex items-center gap-3">
              <Avatar user={startup.founder} size="md" />
              <div>
                <p className="text-sm font-medium">{startup.founder.name}</p>
                <p className="text-xs text-gray-400">@{startup.founder.username}</p>
              </div>
            </div>
          </div>

          {isFounder && (
            <button
              onClick={() => toast('Open the Applications and Tasks tabs to see live analytics.', { icon: '📊' })}
              className="card p-5 flex items-center gap-3 hover:shadow-card transition-shadow w-full text-left"
            >
              <BarChart3 size={18} className="text-brand-600" />
              <span className="text-sm font-medium">Views: {startup.views} total</span>
            </button>
          )}

          <div className="card p-5">
            <h4 className="text-sm font-semibold mb-3">Team ({startup.team?.length})</h4>
            <div className="space-y-3">
              {startup.team?.slice(0, 6).map((t) => (
                <div key={t.user?._id} className="flex items-center gap-2.5">
                  <Avatar user={t.user} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{t.roleTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title={`Apply to ${startup.name}`}>
        <form onSubmit={handleSubmit(onApply)} className="space-y-4">
          <div>
            <label className="label">Why do you want to join?</label>
            <textarea rows={4} className="input" placeholder="Tell them why you're a great fit..." {...register('message', { required: 'A message is required' })} />
            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
          </div>
          <div>
            <label className="label">Relevant experience</label>
            <textarea rows={3} className="input" placeholder="Briefly describe your relevant experience" {...register('experience')} />
          </div>
          <button type="submit" disabled={applying} className="btn-primary w-full">
            {applying ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        title="Delete this startup?"
        description="This will permanently remove the startup, its tasks, and applications. This cannot be undone."
        confirmText="Delete Startup"
      />
    </div>
  );
};

export default StartupDetail;
