const express = require('express');
const router = express.Router();
const { newAssignment, allAssignment, viewAssignmentById, updateAssignmentById, deleteAssignmentById }  = require('../controllers/assignmentController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.post('', authenticateJWT, newAssignment);
router.get('', authenticateJWT, allAssignment);
router.get('/:assignmentId', authenticateJWT, viewAssignmentById);
router.put('/:assignmentId', authenticateJWT, updateAssignmentById);
router.delete('/:assignmentId', authenticateJWT, deleteAssignmentById);

module.exports = router;