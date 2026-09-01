const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} = require('../controllers/memberController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.use(requireAuth);

router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.post('/', requireRole('admin', 'manager'), createMember);
router.put('/:id', requireRole('admin', 'manager'), updateMember);
router.delete('/:id', requireRole('admin'), deleteMember);

module.exports = router;
