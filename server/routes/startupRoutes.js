const express = require('express');
const router = express.Router();
const {
  createStartup,
  getStartups,
  getStartupById,
  updateStartup,
  deleteStartup,
  getMyStartups,
  removeTeamMember,
  getStartupAnalytics,
} = require('../controllers/startupController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getStartups);
router.get('/mine', protect, getMyStartups);
router.get('/:id', getStartupById);
router.get('/:id/analytics', protect, getStartupAnalytics);
router.post('/', protect, authorize('founder', 'admin'), createStartup);
router.put('/:id', protect, updateStartup);
router.delete('/:id', protect, deleteStartup);
router.delete('/:id/team/:userId', protect, removeTeamMember);

module.exports = router;
