const express = require('express');
const router = express.Router();
const { userProfile, updateUserProfile, getUserProfileById } = require('../controllers/usersController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.get('/profile', authenticateJWT, userProfile);
router.put('/profile', authenticateJWT, updateUserProfile);
router.get('/profile:userId', authenticateJWT, getUserProfileById);

module.exports = router;