const express = require('express');
const router = express.Router();
const { newStudyPlan, allStudyPlan, findStudyPlanById, updateStudyPlanById, deleteStudyPlanById } = require('../controllers/studyPlansController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.post('', authenticateJWT, newStudyPlan);
router.get('', authenticateJWT, allStudyPlan);
router.get('/:planId', authenticateJWT, findStudyPlanById);
router.put('/:planId/tasks/:taskId', authenticateJWT, updateStudyPlanById);
router.delete('/:planId', authenticateJWT, deleteStudyPlanById);

module.exports = router;