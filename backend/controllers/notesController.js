const Note = require('../models/Note');
const User = require('../models/User');

// Controller to add a new note
const addNote = async (req, res) => {
    try {
        const userId = req.user.userId; // Get the current user's ID

        // Check if the user ID is available, otherwise return unauthorized response
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Extract required fields from the request body
        const { title, content, tags, shared } = req.body;

        // Ensure that both title and content are provided
        if (!title || !content) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        // Create a new Note document
        const newNote = new Note({
            userId,
            title,
            content,
            tags,
            shared
        });

        // Save the note to the database
        await newNote.save();

        // Return success response with the newly created note
        return res.status(201).json({ message: 'Note created successfully', newNote });
    }
    catch (error) {
        // Handle any server-side errors
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

// Controller to retrieve all notes belonging to the current user
const allNotes = async (req, res) => {
    try {
        const userId = req.user.userId; // Get the current user's ID

        // Check if the user ID is available, otherwise return unauthorized response
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Retrieve all notes created by the current user
        const notes = await Note.find({ userId: userId });

        // If no notes are found, return a 404 response
        if (!notes) {
            return res.status(404).json({ message: 'Notes not found' });
        }

        // Return success response with the list of notes
        return res.status(200).json({ notes });
    }
    catch (error) {
        // Handle any server-side errors
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

// Controller to view a single note by its ID
const viewNoteById = async (req, res) => {
    try {
        const userId = req.user.userId; // Get the current user's ID
        const { noteId } = req.params; // Get the note ID from the route parameters

        // Check if the user ID is available, otherwise return unauthorized response
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Find the note by its ID and ensure it belongs to the current user
        const note = await Note.find({ userId, noteId });

        // If the note is not found, return a 404 response
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Return success response with the note data
        return res.status(200).json({ note });
    }
    catch (error) {
        // Handle any server-side errors
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

// Controller to update a note by its ID
const updateNoteById = async (req, res) => {
    try {
        const userId = req.user.userId; // Get the current user's ID
        const { noteId } = req.params; // Get the note ID from the route parameters

        // Check if the user ID is available, otherwise return unauthorized response
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Find the note by its ID and ensure it belongs to the current user
        const note = await Note.findOne({ userId, noteId });

        // If the note is not found, return a 404 response
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Update the note fields if provided in the request body
        if (req.body.title) {
            note.title = req.body.title;
        }

        if (req.body.content) {
            note.content = req.body.content;
        }

        if (Array.isArray(req.body.tags)) {
            note.tags = req.body.tags;
        }

        if (typeof req.body.shared === 'boolean') {
            note.shared = req.body.shared;
        }

        // Save the updated note to the database
        await note.save();

        // Return success response
        return res.status(200).json({ message: 'Note Updated Successfully' });
    }
    catch (error) {
        // Handle any server-side errors
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

// Controller to delete a note by its ID
const deleteNoteById = async (req, res) => {
    try {
        const userId = req.user.userId; // Get the current user's ID
        const { noteId } = req.params; // Get the note ID from the route parameters

        // Check if the user ID is available, otherwise return unauthorized response
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Find and delete the note by its ID and ensure it belongs to the current user
        const note = await Note.findOneAndDelete({ userId, noteId });

        // If the note is not found, return a 404 response
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Return success response after deletion
        return res.status(200).json({ message: 'Note Deleted Successfully' });
    }
    catch (error) {
        // Handle any server-side errors
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

// Controller to share a note with another user
const shareNote = async (req, res) => {
    try {
        const userId = req.user.userId; // Get the current user's ID
        const { noteId } = req.params; // Get the note ID from the route parameters
        const { recipientId } = req.body; // Get the recipient's user ID from the request body

        // Find the note belonging to the current user
        const note = await Note.findOne({ userId, noteId });

        // If the note is not found, return a 404 response
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if the recipient exists in the system
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        // Add the recipient to the sharedWith array, ensuring no duplicates
        if (!note.sharedWith.includes(recipientId)) {
            note.sharedWith.push(recipientId);
            note.shared = true; // Mark the note as shared
        }

        // Save the updated note to the database
        await note.save();

        // Return success response with the updated note details
        return res.status(200).json({ message: 'Note shared successfully', note });
    } catch (error) {
        // Handle any server-side errors
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Controller to fetch all notes shared with the current user
const getSharedNotes = async (req, res) => {
    try {
        const userId = req.user.userId; // Get the current user's ID

        // Find notes where the current user's ID is in the sharedWith array
        const sharedNotes = await Note.find({ sharedWith: userId });

        // Return success response with the shared notes
        return res.status(200).json({ sharedNotes });
    } catch (error) {
        // Handle any server-side errors
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = { addNote, allNotes, viewNoteById, updateNoteById, deleteNoteById, shareNote, getSharedNotes };