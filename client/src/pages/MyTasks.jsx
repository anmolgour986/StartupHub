import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { taskAPI } from '../services/api';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonRow } from '../components/ui/Skeleton';
import { PRIORITY_COLORS, formatDate } from '../utils/helpers';

const STATUS_LABELS = { todo: 'Todo', 'in-progress': 'In Progress', review: 'Review', completed: 'Completed' };

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await taskAPI.mine();
        setTasks(data.tasks);
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
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Everything assigned to you, across every startup.</p>
      </div>

      {loading ? (
        <div className="card divide-y divide-gray-100 dark:divide-gray-800">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No tasks assigned" description="Tasks assigned to you will show up here." />
      ) : (
        <div className="card divide-y divide-gray-100 dark:divide-gray-800">
          {tasks.map((task) => (
            <Link key={task._id} to={`/startups/${task.startup?._id}/tasks`} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{task.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{task.startup?.name} · {STATUS_LABELS[task.status]}</p>
              </div>
              <span className={`badge shrink-0 ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
              {task.dueDate && <span className="text-xs text-gray-400 shrink-0 w-20 text-right">{formatDate(task.dueDate)}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
