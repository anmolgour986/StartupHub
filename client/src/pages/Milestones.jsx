import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Flag, Pencil, Trash2, CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { useStartup } from '../hooks/useStartup';
import { milestoneAPI } from '../services/api';
import { FullPageSpinner } from '../components/ui/Spinner';
import StartupHeader from '../components/startup/StartupHeader';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatDate } from '../utils/helpers';

const STATUS_META = {
  pending: { icon: Circle, color: 'text-gray-400' },
  'in-progress': { icon: Clock, color: 'text-blue-500' },
  completed: { icon: CheckCircle2, color: 'text-emerald-500' },
  delayed: { icon: AlertCircle, color: 'text-red-500' },
};

const Milestones = () => {
  const { id } = useParams();
  const { startup, loading: startupLoading, isFounder, isTeamMember } = useStartup(id);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const load = async () => {
    try {
      const { data } = await milestoneAPI.forStartup(id);
      setMilestones(data.milestones);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const openCreate = () => { setEditing(null); reset({ title: '', description: '', dueDate: '', status: 'pending' }); setModalOpen(true); };
  const openEdit = (m) => {
    setEditing(m);
    reset({ title: m.title, description: m.description, dueDate: m.dueDate ? m.dueDate.slice(0, 10) : '', status: m.status });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editing) {
        await milestoneAPI.update(editing._id, formData);
        toast.success('Milestone updated');
      } else {
        await milestoneAPI.create({ ...formData, startupId: id });
        toast.success('Milestone created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save milestone');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    try {
      await milestoneAPI.remove(deleteTarget._id);
      toast.success('Milestone deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (startupLoading) return <FullPageSpinner />;
  if (!startup) return null;

  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const progress = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <StartupHeader startup={startup} isFounder={isFounder} isTeamMember={isTeamMember} activeTab="Milestones" />

      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Milestones</h2>
        {isFounder && <button onClick={openCreate} className="btn-primary"><Plus size={16} /> New Milestone</button>}
      </div>

      {milestones.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall progress</span>
            <span className="text-sm text-gray-400">{completedCount}/{milestones.length} completed</span>
          </div>
          <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div className="h-full bg-brand-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-400">Loading milestones...</div>
      ) : milestones.length === 0 ? (
        <EmptyState icon={Flag} title="No milestones yet" description="Set project goals and track progress toward them." />
      ) : (
        <div className="space-y-3">
          {milestones.map((m) => {
            const Meta = STATUS_META[m.status];
            return (
              <div key={m._id} className="card p-5 flex items-start gap-4">
                <Meta.icon size={20} className={`shrink-0 mt-0.5 ${Meta.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{m.title}</p>
                    <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 capitalize">{m.status.replace('-', ' ')}</span>
                  </div>
                  {m.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{m.description}</p>}
                  {m.dueDate && <p className="text-xs text-gray-400 mt-2">Due {formatDate(m.dueDate)}</p>}
                </div>
                {isFounder && (
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(m)} className="btn-ghost !p-1.5 rounded-lg"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteTarget(m)} className="btn-ghost !p-1.5 rounded-lg text-red-500"><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Milestone' : 'New Milestone'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input" placeholder="e.g. Private beta launch" {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={3} className="input" placeholder="What does this milestone involve?" {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Due Date</label>
              <input type="date" className="input" {...register('dueDate')} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" {...register('status')}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Milestone'}</button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete this milestone?"
        description={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmText="Delete"
      />
    </div>
  );
};

export default Milestones;
