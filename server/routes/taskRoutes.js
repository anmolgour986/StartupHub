const express = require('express');
const router = express.Router();
const {
  createTask,
  getStartupTasks,
  getMyTasks,
  updateTask,
  deleteTask,
  reorderTasks,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createTask);
router.get('/mine', getMyTasks);
router.put('/reorder', reorderTasks);
router.get('/startup/:startupId', getStartupTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
