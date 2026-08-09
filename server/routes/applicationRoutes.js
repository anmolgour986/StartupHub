const express = require('express');
const router = express.Router();
const {
  applyToStartup,
  getStartupApplications,
  getMyApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', applyToStartup);
router.get('/mine', getMyApplications);
router.get('/startup/:startupId', getStartupApplications);
router.put('/:id/status', updateApplicationStatus);

module.exports = router;
