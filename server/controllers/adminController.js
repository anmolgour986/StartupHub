const User = require('../models/User');
const Startup = require('../models/Startup');
const Application = require('../models/Application');
const Task = require('../models/Task');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Platform-wide statistics
// @route   GET /api/admin/stats
// @access  Private (admin)
const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalStartups, totalApplications, totalTasks, usersByRole, startupsByStatus] = await Promise.all([
    User.countDocuments(),
    Startup.countDocuments(),
    Application.countDocuments(),
    Task.countDocuments(),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Startup.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  res.json({
    success: true,
    stats: { totalUsers, totalStartups, totalApplications, totalTasks, usersByRole, startupsByStatus },
  });
});

// @desc    List all users (admin)
// @route   GET /api/admin/users
// @access  Private (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json({ success: true, users: users.map((u) => u.toSafeObject()) });
});

// @desc    Activate/deactivate a user
// @route   PUT /api/admin/users/:id/status
// @access  Private (admin)
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  user.isActive = !user.isActive;
  await user.save();

  res.json({ success: true, user: user.toSafeObject() });
});

// @desc    List all startups (admin)
// @route   GET /api/admin/startups
// @access  Private (admin)
const getAllStartups = asyncHandler(async (req, res) => {
  const startups = await Startup.find().populate('founder', 'name username').sort('-createdAt');
  res.json({ success: true, startups });
});

// @desc    Remove inappropriate startup content
// @route   PUT /api/admin/startups/:id/status
// @access  Private (admin)
const toggleStartupStatus = asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.id);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  startup.isActive = !startup.isActive;
  await startup.save();

  res.json({ success: true, startup });
});

module.exports = { getStats, getAllUsers, toggleUserStatus, getAllStartups, toggleStartupStatus };
