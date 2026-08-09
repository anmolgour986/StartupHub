const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const fields = ['name', 'bio', 'skills', 'github', 'linkedin', 'portfolio', 'location', 'experience', 'avatar'];
  const updates = {};
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, user: user.toSafeObject() });
});

// @desc    Get public profile by id
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user: user.toSafeObject() });
});

// @desc    List / search users (e.g. to invite, or for admin)
// @route   GET /api/users
// @access  Private
const listUsers = asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 20 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
      { skills: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    users: users.map((u) => u.toSafeObject()),
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

module.exports = { updateProfile, getUserById, listUsers };
