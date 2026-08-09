const Task = require('../models/Task');
const Startup = require('../models/Startup');
const asyncHandler = require('../middleware/asyncHandler');
const { createNotification } = require('../services/notificationService');

const isTeamMemberOrFounder = (startup, userId) => {
  return (
    String(startup.founder) === String(userId) ||
    startup.team.some((t) => String(t.user) === String(userId))
  );
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (founder or team member)
const createTask = asyncHandler(async (req, res) => {
  const { startupId, title, description, priority, assignee, dueDate, status } = req.body;

  const startup = await Startup.findById(startupId);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  if (!isTeamMemberOrFounder(startup, req.user._id)) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const count = await Task.countDocuments({ startup: startupId, status: status || 'todo' });

  const task = await Task.create({
    startup: startupId,
    title,
    description,
    priority,
    assignee: assignee || null,
    dueDate: dueDate || null,
    status: status || 'todo',
    createdBy: req.user._id,
    order: count,
  });

  if (assignee && String(assignee) !== String(req.user._id)) {
    const io = req.app.get('io');
    await createNotification(io, {
      recipient: assignee,
      sender: req.user._id,
      type: 'task_assigned',
      message: `You were assigned a new task: "${title}" in ${startup.name}`,
      link: `/startups/${startup._id}/tasks`,
      relatedStartup: startup._id,
    });
  }

  const populated = await task.populate('assignee', 'name username avatar');
  res.status(201).json({ success: true, task: populated });
});

// @desc    Get tasks for a startup (kanban board)
// @route   GET /api/tasks/startup/:startupId
// @access  Private (team member)
const getStartupTasks = asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.startupId);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  if (!isTeamMemberOrFounder(startup, req.user._id)) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const tasks = await Task.find({ startup: req.params.startupId })
    .populate('assignee', 'name username avatar')
    .populate('createdBy', 'name username avatar')
    .sort('order');

  res.json({ success: true, tasks });
});

// @desc    Get tasks assigned to current user across all startups
// @route   GET /api/tasks/mine
// @access  Private
const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ assignee: req.user._id })
    .populate('startup', 'name logo')
    .sort('-createdAt');
  res.json({ success: true, tasks });
});

// @desc    Update a task (edit fields, status, drag & drop reorder)
// @route   PUT /api/tasks/:id
// @access  Private (team member)
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('startup');
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

  if (!isTeamMemberOrFounder(task.startup, req.user._id)) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const wasCompleted = task.status === 'completed';
  const { title, description, priority, assignee, dueDate, status, order } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (status !== undefined) task.status = status;
  if (order !== undefined) task.order = order;

  const io = req.app.get('io');

  if (assignee !== undefined && String(assignee) !== String(task.assignee)) {
    task.assignee = assignee || null;
    if (assignee) {
      await createNotification(io, {
        recipient: assignee,
        sender: req.user._id,
        type: 'task_assigned',
        message: `You were assigned to task: "${task.title}"`,
        link: `/startups/${task.startup._id}/tasks`,
        relatedStartup: task.startup._id,
      });
    }
  }

  await task.save();

  if (!wasCompleted && task.status === 'completed' && task.createdBy) {
    await createNotification(io, {
      recipient: task.createdBy,
      sender: req.user._id,
      type: 'task_completed',
      message: `Task "${task.title}" was marked completed`,
      link: `/startups/${task.startup._id}/tasks`,
      relatedStartup: task.startup._id,
    });
  }

  const populated = await task.populate('assignee', 'name username avatar');
  res.json({ success: true, task: populated });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (creator, founder, or admin)
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('startup');
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

  const startup = task.startup;
  const canDelete =
    String(startup.founder) === String(req.user._id) ||
    String(task.createdBy) === String(req.user._id) ||
    req.user.role === 'admin';

  if (!canDelete) return res.status(403).json({ success: false, message: 'Not authorized' });

  await task.deleteOne();
  res.json({ success: true, message: 'Task deleted' });
});

// @desc    Bulk reorder tasks (drag & drop across columns)
// @route   PUT /api/tasks/reorder
// @access  Private
const reorderTasks = asyncHandler(async (req, res) => {
  const { tasks } = req.body; // [{ id, status, order }]
  if (!Array.isArray(tasks)) {
    return res.status(400).json({ success: false, message: 'tasks must be an array' });
  }

  const bulkOps = tasks.map((t) => ({
    updateOne: {
      filter: { _id: t.id },
      update: { status: t.status, order: t.order },
    },
  }));

  if (bulkOps.length) await Task.bulkWrite(bulkOps);

  res.json({ success: true, message: 'Tasks reordered' });
});

module.exports = {
  createTask,
  getStartupTasks,
  getMyTasks,
  updateTask,
  deleteTask,
  reorderTasks,
};
