const Startup = require('../models/Startup');
const Task = require('../models/Task');
const Application = require('../models/Application');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a startup
// @route   POST /api/startups
// @access  Private (founder)
const createStartup = asyncHandler(async (req, res) => {
  const startup = await Startup.create({ ...req.body, founder: req.user._id });
  res.status(201).json({ success: true, startup });
});

// @desc    Get all startups (discover) with search/filter/sort
// @route   GET /api/startups
// @access  Public/Private
const getStartups = asyncHandler(async (req, res) => {
  const { search, category, skill, status, remote, sort = '-createdAt', page = 1, limit = 12 } = req.query;

  const query = { isActive: true };
  if (category) query.category = category;
  if (status) query.status = status;
  if (remote !== undefined) query.isRemote = remote === 'true';
  if (skill) query.requiredSkills = { $regex: skill, $options: 'i' };
  if (search) {
    query.$text = { $search: search };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [startups, total] = await Promise.all([
    Startup.find(query)
      .populate('founder', 'name username avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Startup.countDocuments(query),
  ]);

  res.json({
    success: true,
    startups,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

// @desc    Get single startup
// @route   GET /api/startups/:id
// @access  Public/Private
const getStartupById = asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.id)
    .populate('founder', 'name username avatar bio')
    .populate('team.user', 'name username avatar skills github linkedin portfolio');

  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  startup.views += 1;
  await startup.save();

  res.json({ success: true, startup });
});

// @desc    Update startup
// @route   PUT /api/startups/:id
// @access  Private (founder owner or admin)
const updateStartup = asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.id);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  if (String(startup.founder) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to update this startup' });
  }

  Object.assign(startup, req.body);
  await startup.save();

  res.json({ success: true, startup });
});

// @desc    Delete startup
// @route   DELETE /api/startups/:id
// @access  Private (founder owner or admin)
const deleteStartup = asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.id);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  if (String(startup.founder) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this startup' });
  }

  await startup.deleteOne();
  await Task.deleteMany({ startup: startup._id });
  await Application.deleteMany({ startup: startup._id });

  res.json({ success: true, message: 'Startup deleted' });
});

// @desc    Get startups owned/joined by current user
// @route   GET /api/startups/mine
// @access  Private
const getMyStartups = asyncHandler(async (req, res) => {
  const owned = await Startup.find({ founder: req.user._id }).sort('-createdAt');
  const joined = await Startup.find({ 'team.user': req.user._id, founder: { $ne: req.user._id } }).sort('-createdAt');
  res.json({ success: true, owned, joined });
});

// @desc    Remove a team member from a startup
// @route   DELETE /api/startups/:id/team/:userId
// @access  Private (founder owner)
const removeTeamMember = asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.id);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  if (String(startup.founder) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  startup.team = startup.team.filter((t) => String(t.user) !== req.params.userId);
  await startup.save();

  res.json({ success: true, startup });
});

// @desc    Basic analytics for a startup (for founder dashboard)
// @route   GET /api/startups/:id/analytics
// @access  Private (founder owner)
const getStartupAnalytics = asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.id);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  const [tasksByStatus, applicationsByStatus, totalTasks, totalApplications] = await Promise.all([
    Task.aggregate([
      { $match: { startup: startup._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Application.aggregate([
      { $match: { startup: startup._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Task.countDocuments({ startup: startup._id }),
    Application.countDocuments({ startup: startup._id }),
  ]);

  res.json({
    success: true,
    analytics: {
      views: startup.views,
      teamSize: startup.team.length,
      totalTasks,
      totalApplications,
      tasksByStatus,
      applicationsByStatus,
    },
  });
});

module.exports = {
  createStartup,
  getStartups,
  getStartupById,
  updateStartup,
  deleteStartup,
  getMyStartups,
  removeTeamMember,
  getStartupAnalytics,
};
