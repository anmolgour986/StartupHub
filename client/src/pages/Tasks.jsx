import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, KanbanSquare } from 'lucide-react';
import { useStartup } from '../hooks/useStartup';
import { taskAPI } from '../services/api';
import { FullPageSpinner } from '../components/ui/Spinner';
import StartupHeader from '../components/startup/StartupHeader';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';

const COLUMNS = [
  { key: 'todo', label: 'Todo' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'completed', label: 'Completed' },
];

const Tasks = () => {
  const { id } = useParams();
  const { startup, loading: startupLoading, isFounder, isTeamMember } = useStartup(id);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dragOverCol, setDragOverCol] = useState(null);

  const loadTasks = async () => {
    try {
      const { data } = await taskAPI.forStartup(id);
      setTasks(data.tasks);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const teamMembers = startup
    ? [startup.founder, ...(startup.team?.map((t) => t.user) || [])].filter(
        (v, i, arr) => v && arr.findIndex((x) => x._id === v._id) === i
      )
    : [];

  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditingTask(task); setModalOpen(true); };

  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      const payload = { ...formData, assignee: formData.assignee || null, dueDate: formData.dueDate || null };
      if (editingTask) {
        await taskAPI.update(editingTask._id, payload);
        toast.success('Task updated');
      } else {
        await taskAPI.create({ ...payload, startupId: id });
        toast.success('Task created');
      }
      setModalOpen(false);
      loadTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    try {
      await taskAPI.remove(deleteTarget._id);
      toast.success('Task deleted');
      setDeleteTarget(null);
      loadTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('taskId', task._id);
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === status) return;

    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    try {
      await taskAPI.update(taskId, { status });
    } catch {
      toast.error('Failed to move task');
      loadTasks();
    }
  };

  if (startupLoading) return <FullPageSpinner />;
  if (!startup) return null;

  return (
    <div className="space-y-6">
      <StartupHeader startup={startup} isFounder={isFounder} isTeamMember={isTeamMember} activeTab="Tasks" />

      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Kanban Board</h2>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> New Task</button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <EmptyState icon={KanbanSquare} title="No tasks yet" description="Create your first task to start tracking work." action={<button onClick={openCreate} className="btn-primary">Create Task</button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div
                key={col.key}
                onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.key); }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={(e) => handleDrop(e, col.key)}
                className={`rounded-2xl p-3 min-h-[200px] transition-colors ${
                  dragOverCol === col.key ? 'bg-brand-50 dark:bg-brand-500/10' : 'bg-gray-100/70 dark:bg-gray-900/50'
                }`}
              >
                <div className="flex items-center justify-between px-1.5 mb-3">
                  <h3 className="text-sm font-semibold">{col.label}</h3>
                  <span className="text-xs text-gray-400 bg-white dark:bg-gray-800 rounded-full px-2 py-0.5">{colTasks.length}</span>
                </div>
                <div className="space-y-3">
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onDragStart={handleDragStart}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onSubmit}
        task={editingTask}
        teamMembers={teamMembers}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete this task?"
        description={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmText="Delete"
      />
    </div>
  );
};

export default Tasks;
