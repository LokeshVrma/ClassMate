const Forum = require('../models/Forum');

const newForum = async (req, res) => {
    try {
        const userId = req.user.userId; // The current user's ID
        const { title, content, tags } = req.body;

        // Check if the user ID is available, otherwise return unauthorized response
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Ensure required fields are present
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        // Create a new forum thread
        const newForum = new Forum({
            title,
            content,
            authorId: userId,
            tags
        });

        await newForum.save();
        return res.status(201).json({ message: 'Forum Created Successfully', newForum });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const getAllForums = async (req, res) => {
    try {
        // Retrieve all forums and populate the authorId with user data
        const forums = await Forum.find().populate('authorId', 'name email'); // Populate desired fields from User

        // If no forums are found, return a 404 response
        if (forums.length === 0) {
            return res.status(404).json({ message: 'No forums found' });
        }

        // Return the forums array
        return res.status(200).json(forums);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const getForumById = async (req, res) => {
    try {
        const { forumId } = req.params;
        const forum = await Forum.findById(forumId).populate('authorId', 'name');

        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }

        return res.status(200).json(forum);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const updateForumById = async (req, res) => {
    try {
        const { forumId } = req.params;
        const { title, content, tags } = req.body;

        const updatedForum = await Forum.findByIdAndUpdate(
            forumId,
            { title, content, tags },
            { new: true }
        );

        if (!updatedForum) {
            return res.status(404).json({ message: 'Forum not found' });
        }

        return res.status(200).json({ message: 'Forum Updated Successfully', updatedForum });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const deleteForumById = async (req, res) => {
    try {
        const { forumId } = req.params;

        const deletedForum = await Forum.findByIdAndDelete(forumId);

        if (!deletedForum) {
            return res.status(404).json({ message: 'Forum not found' });
        }

        return res.status(200).json({ message: 'Forum Deleted Successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const addCommentToForum = async (req, res) => {
    try {
        const { forumId } = req.params;
        const { content } = req.body;
        const userId = req.user.userId;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const forum = await Forum.findById(forumId);

        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }

        // Add comment to the forum
        forum.comments.push({ userId, content });
        await forum.save();

        return res.status(200).json({ message: 'Comment added successfully', forum });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


module.exports = { newForum, getAllForums, getForumById, updateForumById, deleteForumById, addCommentToForum };
