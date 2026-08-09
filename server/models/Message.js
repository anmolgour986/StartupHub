const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // For 1:1 chat
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // For team/group chat, tied to a startup
    startup: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', default: null },
    content: { type: String, default: '' },
    attachment: {
      url: { type: String, default: '' },
      filename: { type: String, default: '' },
      mimeType: { type: String, default: '' },
      size: { type: Number, default: 0 },
    },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

messageSchema.index({ sender: 1, recipient: 1, createdAt: 1 });
messageSchema.index({ startup: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
