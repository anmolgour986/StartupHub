const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    type: {
      type: String,
      enum: [
        'application_received',
        'application_accepted',
        'application_rejected',
        'task_assigned',
        'task_completed',
        'new_message',
        'file_uploaded',
        'team_member_joined',
        'milestone_created',
      ],
      required: true,
    },
    message: { type: String, required: true },
    link: { type: String, default: '' },
    relatedStartup: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', default: null },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
