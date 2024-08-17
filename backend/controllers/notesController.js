const Note = require('../models/Note');
const User = require('../models/User');

const addNote = async (req, res) => {
    try{
        const userId = req.user.userId;

        // Ensure that the userId is present
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Destructure required fields from the request body
        const { title, content, tags, shared } = req.body;

        if(!title || !content) {
            return res.status(400).json({ message: 'Required fields missing' });
        }
        const newNote = new Note({
            userId,
            title,
            content,
            tags,
            shared
        });

        await newNote.save();

        return res.status(200).json({ message: 'Note created successfully', newNote });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

const allNotes = async (req, res) => {
    try {
        const userId = req.user.userId;

        if(!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        const notes = await Note.find({ userId: userId });
        if(!notes) {
            return res.status(404).json({ message: 'Notes not found' });
        }

        return res.status(200).json({ notes })
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

const viewNoteById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { noteId } = req.params;

        if(!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        const note = await Note.find({ userId, noteId });
        if(!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        return res.status(200).json({ note });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

const updateNoteById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { noteId } = req.params;

        if(!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        const note = await Note.findOne({ userId, noteId });
        if(!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if(req.body.title) {
            note.title = req.body.title;
        }

        if(req.body.content) {
            note.content = req.body.content;
        }

        if(Array.isArray(req.body.tags)) {
            note.tags = req.body.tags;
        }

        if(typeof req.body.shared === 'boolean') {
            note.shared = req.body.shared;
        }

        await note.save();

        return res.status(200).json({ message: 'Note Updated Successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

const deleteNoteById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { noteId } = req.params;

        if(!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        const note = await Note.findOneAndDelete({ userId, noteId });
        if(!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        return res.status(200).json({ message: 'Note Deleted Successfully'});
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

// Controller to share a note with another user
const shareNote = async (req, res) => {
    try {
        const userId = req.user.userId; // Current user ID
        const { noteId } = req.params; // The ID of the note to be shared
        const { recipientId } = req.body; // The ID of the user with whom the note will be shared

        // Find the note belonging to the current user
        const note = await Note.findOne({ userId, noteId });

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if the recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        // Add the recipient to the sharedWith array
        if (!note.sharedWith.includes(recipientId)) {
            note.sharedWith.push(recipientId);
            note.shared = true;
        }

        // Save the updated note
        await note.save();

        return res.status(200).json({ message: 'Note shared successfully', note });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Controller to fetch notes shared with the user
const getSharedNotes = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find notes where the current user is in the sharedWith array
        const sharedNotes = await Note.find({ sharedWith: userId });

        return res.status(200).json({ sharedNotes });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = { addNote, allNotes, viewNoteById, updateNoteById, deleteNoteById, shareNote, getSharedNotes };