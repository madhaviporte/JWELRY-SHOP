const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  getTasksByMember,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus
} = require('../controllers/taskController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.use(requireAuth);

router.get('/', getAllTasks);
router.get('/member/:memberId', getTasksByMember);
router.get('/:id', getTaskById);
router.post('/', requireRole('admin', 'manager'), createTask);
router.put('/:id', requireRole('admin', 'manager'), updateTask);
router.delete('/:id', requireRole('admin'), deleteTask);
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
