const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Startup = require('../models/Startup');

// Map<userId, socketId> — tracks who is currently online
const onlineUsers = new Map();

const initSocket = (io) => {
  io.onlineUsers = onlineUsers;

  // Authenticate socket connections using the same JWT used for REST
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('Authentication error: no token provided'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('Authentication error: user not found'));

      socket.userId = String(user._id);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    onlineUsers.set(userId, socket.id);
    io.emit('presence:online', { userId, online: true });

    // Join a room per startup team the user belongs to (for team chat + notifications)
    socket.on('team:join', async ({ startupId }) => {
      socket.join(`startup:${startupId}`);
    });

    socket.on('team:leave', ({ startupId }) => {
      socket.leave(`startup:${startupId}`);
    });

    // --- Direct (1:1) chat ---
    socket.on('message:direct', async ({ recipientId, content, attachment }) => {
      try {
        const message = await Message.create({
          sender: userId,
          recipient: recipientId,
          content: content || '',
          attachment: attachment || undefined,
        });
        const populated = await message.populate('sender', 'name username avatar');

        socket.emit('message:new', populated);
        const recipientSocket = onlineUsers.get(String(recipientId));
        if (recipientSocket) {
          io.to(recipientSocket).emit('message:new', populated);
        }
      } catch (err) {
        socket.emit('error:message', { message: 'Failed to send message' });
      }
    });

    // --- Team/group chat ---
    socket.on('message:team', async ({ startupId, content, attachment }) => {
      try {
        const startup = await Startup.findById(startupId);
        if (!startup) return;

        const isMember =
          String(startup.founder) === String(userId) ||
          startup.team.some((t) => String(t.user) === String(userId));
        if (!isMember) return;

        const message = await Message.create({
          sender: userId,
          startup: startupId,
          content: content || '',
          attachment: attachment || undefined,
        });
        const populated = await message.populate('sender', 'name username avatar');

        io.to(`startup:${startupId}`).emit('message:new', populated);
      } catch (err) {
        socket.emit('error:message', { message: 'Failed to send team message' });
      }
    });

    // --- Typing indicators ---
    socket.on('typing:start', ({ recipientId, startupId }) => {
      if (recipientId) {
        const s = onlineUsers.get(String(recipientId));
        if (s) io.to(s).emit('typing:update', { userId, isTyping: true });
      }
      if (startupId) {
        socket.to(`startup:${startupId}`).emit('typing:update', { userId, isTyping: true });
      }
    });

    socket.on('typing:stop', ({ recipientId, startupId }) => {
      if (recipientId) {
        const s = onlineUsers.get(String(recipientId));
        if (s) io.to(s).emit('typing:update', { userId, isTyping: false });
      }
      if (startupId) {
        socket.to(`startup:${startupId}`).emit('typing:update', { userId, isTyping: false });
      }
    });

    // --- Read receipts ---
    socket.on('message:read', async ({ senderId }) => {
      await Message.updateMany(
        { sender: senderId, recipient: userId, readBy: { $ne: userId } },
        { $push: { readBy: userId } }
      );
      const senderSocket = onlineUsers.get(String(senderId));
      if (senderSocket) io.to(senderSocket).emit('message:readReceipt', { by: userId });
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('presence:online', { userId, online: false });
    });
  });
};

module.exports = initSocket;
