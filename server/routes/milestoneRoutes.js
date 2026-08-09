const express = require('express');
const router = express.Router();
const {
  createMilestone,
  getStartupMilestones,
  updateMilestone,
  deleteMilestone,
} = require('../controllers/milestoneController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createMilestone);
router.get('/startup/:startupId', getStartupMilestones);
router.put('/:id', updateMilestone);
router.delete('/:id', deleteMilestone);

module.exports = router;
