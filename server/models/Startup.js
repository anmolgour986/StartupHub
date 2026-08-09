const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, maxlength: 150 },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['SaaS', 'Fintech', 'Healthtech', 'Edtech', 'E-commerce', 'AI/ML', 'Gaming', 'Social', 'Other'],
    },
    requiredSkills: [{ type: String, trim: true }],
    teamSize: { type: Number, default: 1 },
    tags: [{ type: String, trim: true }],
    location: { type: String, default: '' },
    isRemote: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['idea', 'building', 'launched', 'scaling', 'closed'],
      default: 'idea',
    },
    banner: { type: String, default: '' },
    logo: { type: String, default: '' },
    founder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    team: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        roleTitle: { type: String, default: 'Contributor' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

startupSchema.index({ name: 'text', tagline: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Startup', startupSchema);
