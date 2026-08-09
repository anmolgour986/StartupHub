const Application = require('../models/Application');
const Startup = require('../models/Startup');
const asyncHandler = require('../middleware/asyncHandler');
const { createNotification } = require('../services/notificationService');

// @desc    Apply to a startup
// @route   POST /api/applications
// @access  Private (developer/designer)
const applyToStartup = asyncHandler(async (req, res) => {
  const { startupId, message, skills, experience } = req.body;

  const startup = await Startup.findById(startupId);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  if (String(startup.founder) === String(req.user._id)) {
    return res.status(400).json({ success: false, message: 'You cannot apply to your own startup' });
  }

  const alreadyMember = startup.team.some((t) => String(t.user) === String(req.user._id));
  if (alreadyMember) {
    return res.status(400).json({ success: false, message: 'You are already a team member of this startup' });
  }

  const existing = await Application.findOne({ startup: startupId, applicant: req.user._id });
  if (existing) {
    return res.status(400).json({ success: false, message: 'You have already applied to this startup' });
  }

  const application = await Application.create({
    startup: startupId,
    applicant: req.user._id,
    message,
    skills: skills || [],
    experience: experience || '',
  });

  const io = req.app.get('io');
  await createNotification(io, {
    recipient: startup.founder,
    sender: req.user._id,
    type: 'application_received',
    message: `${req.user.name} applied to join ${startup.name}`,
    link: `/startups/${startup._id}/applications`,
    relatedStartup: startup._id,
  });

  res.status(201).json({ success: true, application });
});

// @desc    Get applications for a startup (founder view)
// @route   GET /api/applications/startup/:startupId
// @access  Private (founder owner)
const getStartupApplications = asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.startupId);
  if (!startup) return res.status(404).json({ success: false, message: 'Startup not found' });

  if (String(startup.founder) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const { status } = req.query;
  const query = { startup: req.params.startupId };
  if (status) query.status = status;

  const applications = await Application.find(query)
    .populate('applicant', 'name username avatar skills bio github linkedin portfolio')
    .sort('-createdAt');

  res.json({ success: true, applications });
});

// @desc    Get current user's applications
// @route   GET /api/applications/mine
// @access  Private
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate('startup', 'name tagline logo category status')
    .sort('-createdAt');
  res.json({ success: true, applications });
});

// @desc    Accept or reject an application
// @route   PUT /api/applications/:id/status
// @access  Private (founder owner)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'accepted' | 'rejected'
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be accepted or rejected' });
  }

  const application = await Application.findById(req.params.id).populate('startup');
  if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

  const startup = application.startup;
  if (String(startup.founder) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  application.status = status;
  await application.save();

  const io = req.app.get('io');

  if (status === 'accepted') {
    const alreadyMember = startup.team.some((t) => String(t.user) === String(application.applicant));
    if (!alreadyMember) {
      startup.team.push({ user: application.applicant, roleTitle: 'Contributor' });
      await Startup.findByIdAndUpdate(startup._id, { team: startup.team });
    }

    await createNotification(io, {
      recipient: application.applicant,
      sender: req.user._id,
      type: 'application_accepted',
      message: `Your application to ${startup.name} was accepted! Welcome to the team.`,
      link: `/startups/${startup._id}`,
      relatedStartup: startup._id,
    });

    await createNotification(io, {
      recipient: application.applicant,
      sender: req.user._id,
      type: 'team_member_joined',
      message: `You joined ${startup.name} as a team member`,
      link: `/startups/${startup._id}/team`,
      relatedStartup: startup._id,
    });
  } else {
    await createNotification(io, {
      recipient: application.applicant,
      sender: req.user._id,
      type: 'application_rejected',
      message: `Your application to ${startup.name} was not accepted this time`,
      link: `/startups/${startup._id}`,
      relatedStartup: startup._id,
    });
  }

  res.json({ success: true, application });
});

module.exports = {
  applyToStartup,
  getStartupApplications,
  getMyApplications,
  updateApplicationStatus,
};
