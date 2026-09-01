const express = require('express');
const router = express.Router();
const { getMembers, getMember, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// All member routes require authentication
router.use(requireAuth);

router.route('/')
  .get(getMembers)
  .post(requireRole('admin'), createMember);

router.route('/:id')
  .get(getMember)
  .put(requireRole('admin'), updateMember)
  .delete(requireRole('admin'), deleteMember);

module.exports = router;
