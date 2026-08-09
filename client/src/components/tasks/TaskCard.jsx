import { Calendar, Pencil, Trash2 } from 'lucide-react';
import { PRIORITY_COLORS, formatDate } from '../../utils/helpers';
import Avatar from '../ui/Avatar';

const TaskCard = ({ task, onDragStart, onEdit, onDelete, draggable = true }) => (
  <div
    draggable={draggable}
    onDragStart={(e) => onDragStart?.(e, task)}
    className="card p-4 cursor-grab active:cursor-grabbing hover:shadow-card transition-shadow group"
  >
    <div className="flex items-start justify-between gap-2">
      <p className="text-sm font-medium leading-snug">{task.title}</p>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shrink-0">
        <button onClick={() => onEdit(task)} className="btn-ghost !p-1 rounded-md"><Pencil size={13} /></button>
        <button onClick={() => onDelete(task)} className="btn-ghost !p-1 rounded-md text-red-500"><Trash2 size={13} /></button>
      </div>
    </div>

    {task.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">{task.description}</p>}

    <div className="flex items-center justify-between mt-3">
      <span className={`badge !text-[10px] !px-2 !py-0.5 ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
      {task.assignee && <Avatar user={task.assignee} size="xs" />}
    </div>

    {task.dueDate && (
      <div className="flex items-center gap-1 mt-2 text-[11px] text-gray-400">
        <Calendar size={11} /> {formatDate(task.dueDate)}
      </div>
    )}
  </div>
);

export default TaskCard;
