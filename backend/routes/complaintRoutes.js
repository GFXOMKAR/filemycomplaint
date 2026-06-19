const express = require('express');
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintByCaseId,
  updateComplaintStatus,
  deleteComplaint,
  createAdminComplaint,
  getStats,
  getPublicStats,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/public/stats', getPublicStats);

router.use(protect);

router.post('/', createComplaint);
router.get('/mine', getMyComplaints);
router.get('/stats', authorize('admin'), getStats);
router.get('/', authorize('admin'), getAllComplaints);
router.post('/admin', authorize('admin'), createAdminComplaint);
router.get('/:caseId', getComplaintByCaseId);
router.patch('/:caseId', authorize('admin'), updateComplaintStatus);
router.delete('/:caseId', authorize('admin'), deleteComplaint);

module.exports = router;
