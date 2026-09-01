const express = require('express');
const router = express.Router();
const { getTasks, getTask, getTasksByMember, createTask, updateTask, deleteTask, updateTaskStatus } = require('../controllers/taskController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// All task routes require authentication
router.use(requireAuth);

router.route('/')
  .get(getTasks)
  .post(createTask); // Both admin and manager can create tasks

router.get('/member/:memberId', getTasksByMember);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(requireRole('admin'), deleteTask);

router.patch('/:id/status', updateTaskStatus);

module.exports = router;
