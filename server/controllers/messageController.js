const Message = require('../models/Message');
const Startup = require('../models/Startup');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get 1:1 conversation history with another user
// @route   GET /api/messages/direct/:userId
// @access  Private
const getDirectMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, recipient: userId },
      { sender: userId, recipient: req.user._id },
    ],
  })
    .populate('sender', 'name username avatar')
    .sort('createdAt');

  res.json({ success: true, messages });
});

// @desc    Get team chat history for a startup
// @route   GET /api/messages/team/:startupId
// @access  Private (team member)
const getTeamMessages = asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.startupId);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  const isMember =
    String(startup.founder) === String(req.user._id) ||
    startup.team.some((t) => String(t.user) === String(req.user._id));
  if (!isMember) return res.status(403).json({ success: false, message: 'Not authorized' });

  const messages = await Message.find({ startup: req.params.startupId })
    .populate('sender', 'name username avatar')
    .sort('createdAt');

  res.json({ success: true, messages });
});

// @desc    List conversation threads (recent direct messages, grouped by user)
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const messages = await Message.find({
    $or: [{ sender: userId }, { recipient: userId }],
    startup: null,
  })
    .populate('sender', 'name username avatar')
    .populate('recipient', 'name username avatar')
    .sort('-createdAt');

  const seen = new Set();
  const conversations = [];
  for (const m of messages) {
    const other = String(m.sender._id) === String(userId) ? m.recipient : m.sender;
    if (!other) continue;
    if (seen.has(String(other._id))) continue;
    seen.add(String(other._id));
    conversations.push({
      user: other,
      lastMessage: m.content,
      lastMessageAt: m.createdAt,
      unread: !m.readBy.some((id) => String(id) === String(userId)) && String(m.sender._id) !== String(userId),
    });
  }

  res.json({ success: true, conversations });
});

// @desc    Mark direct messages from a user as read
// @route   PUT /api/messages/direct/:userId/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  await Message.updateMany(
    { sender: req.params.userId, recipient: req.user._id, readBy: { $ne: req.user._id } },
    { $push: { readBy: req.user._id } }
  );
  res.json({ success: true });
});

module.exports = { getDirectMessages, getTeamMessages, getConversations, markAsRead };
