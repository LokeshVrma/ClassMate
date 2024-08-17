const express = require('express');
const router = express.Router();
const { newForum, getAllForums, getForumById, updateForumById, deleteForumById, addCommentToForum } = require('../controllers/forumsController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.post('/', authenticateJWT, newForum);
router.get('/', getAllForums);
router.get('/:forumId', getForumById);
router.put('/:forumId', authenticateJWT, updateForumById);
router.delete('/:forumId', authenticateJWT, deleteForumById);
router.post('/:forumId/comments', authenticateJWT, addCommentToForum);

module.exports = router;
