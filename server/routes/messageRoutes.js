const express = require('express');
const router = express.Router();
const {
  getDirectMessages,
  getTeamMessages,
  getConversations,
  markAsRead,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/conversations', getConversations);
router.get('/direct/:userId', getDirectMessages);
router.put('/direct/:userId/read', markAsRead);
router.get('/team/:startupId', getTeamMessages);

module.exports = router;
