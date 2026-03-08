const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;