const Notification = require('../models/Notification');

/**
 * Create a notification in the DB and emit it in real-time if the recipient is online.
 * @param {import('socket.io').Server} io
 * @param {Object} data - { recipient, sender, type, message, link, relatedStartup }
 */
const createNotification = async (io, data) => {
  const notification = await Notification.create(data);
  const populated = await notification.populate('sender', 'name username avatar');

  if (io) {
    const onlineUsers = io.onlineUsers; // Map<userId, socketId>
    const socketId = onlineUsers && onlineUsers.get(String(data.recipient));
    if (socketId) {
      io.to(socketId).emit('notification:new', populated);
    }
  }

  return populated;
};

module.exports = { createNotification };
