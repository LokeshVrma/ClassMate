const express = require('express');
const { registerUser, verifyUser, loginUser, refreshUserToken, logoutUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.get('/verify', verifyUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshUserToken);
router.post('/logout', logoutUser);

module.exports = router;