const express = require('express');
const { getAllUsers, updateUser, toggleBlockUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.patch('/:id/block', toggleBlockUser);
router.delete('/:id', deleteUser);

module.exports = router;
