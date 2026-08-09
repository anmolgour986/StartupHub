const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  toggleUserStatus,
  getAllStartups,
  toggleStartupStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/startups', getAllStartups);
router.put('/startups/:id/status', toggleStartupStatus);

module.exports = router;
