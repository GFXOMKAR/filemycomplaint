const express = require('express');
const { getMe, directLogin, directRegister, adminLogin } = require('../controllers/authController');
// OTP routes commented out — will re-enable when Gmail OTP is ready
// const { sendOtp, verifyOtp } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Direct login/signup (no OTP) — temporary
router.post('/login', directLogin);
router.post('/register', directRegister);

// Admin login — email + password based
router.post('/admin-login', adminLogin);

// OTP routes — commented out for now
// router.post('/send-otp', sendOtp);
// router.post('/verify-otp', verifyOtp);

router.get('/me', protect, getMe);

module.exports = router;
