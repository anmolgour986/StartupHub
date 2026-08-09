const Milestone = require('../models/Milestone');
const Startup = require('../models/Startup');
const asyncHandler = require('../middleware/asyncHandler');
const { createNotification } = require('../services/notificationService');

const isTeamMemberOrFounder = (startup, userId) =>
  String(startup.founder) === String(userId) ||
  startup.team.some((t) => String(t.user) === String(userId));

// @desc    Create a milestone
// @route   POST /api/milestones
// @access  Private (founder)
const createMilestone = asyncHandler(async (req, res) => {
  const { startupId, title, description, dueDate, status } = req.body;

  const startup = await Startup.findById(startupId);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  if (String(startup.founder) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const milestone = await Milestone.create({
    startup: startupId,
    title,
    description,
    dueDate,
    status,
    createdBy: req.user._id,
  });

  const io = req.app.get('io');
  const recipients = startup.team.map((t) => t.user);
  for (const recipient of recipients) {
    await createNotification(io, {
      recipient,
      sender: req.user._id,
      type: 'milestone_created',
      message: `New milestone "${title}" was added to ${startup.name}`,
      link: `/startups/${startup._id}/milestones`,
      relatedStartup: startup._id,
    });
  }

  res.status(201).json({ success: true, milestone });
});

// @desc    Get milestones for a startup
// @route   GET /api/milestones/startup/:startupId
// @access  Private (team member)
const getStartupMilestones = asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.startupId);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  if (!isTeamMemberOrFounder(startup, req.user._id)) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const milestones = await Milestone.find({ startup: req.params.startupId }).sort('dueDate');
  res.json({ success: true, milestones });
});

// @desc    Update a milestone
// @route   PUT /api/milestones/:id
// @access  Private (founder)
const updateMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.findById(req.params.id).populate('startup');
  if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

  if (String(milestone.startup.founder) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const { title, description, dueDate, status } = req.body;
  if (title !== undefined) milestone.title = title;
  if (description !== undefined) milestone.description = description;
  if (dueDate !== undefined) milestone.dueDate = dueDate;
  if (status !== undefined) milestone.status = status;

  await milestone.save();
  res.json({ success: true, milestone });
});

// @desc    Delete a milestone
// @route   DELETE /api/milestones/:id
// @access  Private (founder)
const deleteMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.findById(req.params.id).populate('startup');
  if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

  if (String(milestone.startup.founder) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await milestone.deleteOne();
  res.json({ success: true, message: 'Milestone deleted' });
});

module.exports = { createMilestone, getStartupMilestones, updateMilestone, deleteMilestone };
