const express = require('express');
const router = express.Router();
const { updateProfile, getUserById, listUsers } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', listUsers);
router.put('/profile', updateProfile);
router.get('/:id', getUserById);

module.exports = router;
