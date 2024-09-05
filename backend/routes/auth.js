const express = require('express');
const { registerUser, verifyUser, loginUser, refreshUserToken, forgotPassword, verifyOtp, resetPassword, logoutUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify', verifyUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshUserToken);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/logout', logoutUser);

module.exports = router;