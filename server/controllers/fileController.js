const FileModel = require('../models/File');
const Startup = require('../models/Startup');
const asyncHandler = require('../middleware/asyncHandler');
const { createNotification } = require('../services/notificationService');

const isTeamMemberOrFounder = (startup, userId) =>
  String(startup.founder) === String(userId) ||
  startup.team.some((t) => String(t.user) === String(userId));

// @desc    Upload a file to a startup's shared files
// @route   POST /api/files/:startupId
// @access  Private (team member)
const uploadFile = asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.startupId);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  if (!isTeamMemberOrFounder(startup, req.user._id)) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const file = await FileModel.create({
    startup: startup._id,
    uploadedBy: req.user._id,
    filename: req.file.filename,
    originalName: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    mimeType: req.file.mimetype,
    size: req.file.size,
  });

  const io = req.app.get('io');
  const recipients = [startup.founder, ...startup.team.map((t) => t.user)].filter(
    (id) => String(id) !== String(req.user._id)
  );
  for (const recipient of recipients) {
    await createNotification(io, {
      recipient,
      sender: req.user._id,
      type: 'file_uploaded',
      message: `${req.user.name} uploaded "${req.file.originalname}" to ${startup.name}`,
      link: `/startups/${startup._id}/files`,
      relatedStartup: startup._id,
    });
  }

  const populated = await file.populate('uploadedBy', 'name username avatar');
  res.status(201).json({ success: true, file: populated });
});

// @desc    List files for a startup
// @route   GET /api/files/:startupId
// @access  Private (team member)
const getStartupFiles = asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.startupId);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  if (!isTeamMemberOrFounder(startup, req.user._id)) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const files = await FileModel.find({ startup: req.params.startupId })
    .populate('uploadedBy', 'name username avatar')
    .sort('-createdAt');

  res.json({ success: true, files });
});

// @desc    Delete a file
// @route   DELETE /api/files/:id
// @access  Private (uploader, founder, or admin)
const deleteFile = asyncHandler(async (req, res) => {
  const file = await FileModel.findById(req.params.id).populate('startup');
  if (!file) return res.status(404).json({ success: false, message: 'File not found' });

  const canDelete =
    String(file.uploadedBy) === String(req.user._id) ||
    String(file.startup.founder) === String(req.user._id) ||
    req.user.role === 'admin';

  if (!canDelete) return res.status(403).json({ success: false, message: 'Not authorized' });

  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, '..', 'uploads', file.filename);
  fs.unlink(filePath, () => {});

  await file.deleteOne();
  res.json({ success: true, message: 'File deleted' });
});

module.exports = { uploadFile, getStartupFiles, deleteFile };
