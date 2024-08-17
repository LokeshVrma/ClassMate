const express = require('express');
const router = express.Router();
const { addNote, allNotes, viewNoteById, updateNoteById, deleteNoteById, shareNote, getSharedNotes } = require('../controllers/notesController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.post('', authenticateJWT, addNote);
router.get('', authenticateJWT, allNotes);
router.get('/shared', authenticateJWT, getSharedNotes);
router.get('/:noteId', authenticateJWT, viewNoteById);
router.put('/:noteId', authenticateJWT, updateNoteById);
router.delete('/:noteId', authenticateJWT, deleteNoteById);
router.post('/:noteId/share', authenticateJWT, shareNote);

module.exports = router;