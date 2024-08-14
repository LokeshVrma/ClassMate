const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Retrieve the profile information of the currently logged-in user
const userProfile = async (req, res) => {
    try {
        // Check if the user is authenticated and has a valid userId
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        const userId = req.user.userId;

        // Fetch the user from the database using the userId
        const user = await User.findById(userId);

        // Return the user's profile information
        return res.status(200).json({
            email: user.email,
            name: user.name,
            studentId: user.studentID,
            profileImage: user.profileImage,
            verified: user.verified
        });
    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update the profile information of the currently logged-in user
const updateUserProfile = async (req, res) => {
    try {
        // Check if the user is authenticated and has a valid userId
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        const userId = req.user.userId;

        // Find the user from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the profile photo if provided
        if (req.body.profileImage) {
            user.profileImage = req.body.profileImage;
        }

        // Check if password and confirmPassword are provided and match
        if (req.body.password && req.body.confirmPassword) {
            if (req.body.password !== req.body.confirmPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }

            // Hash the new password and update it
            const salt = await bcrypt.genSalt(12);
            user.password = await bcrypt.hash(req.body.password, salt);
        } else if (req.body.password || req.body.confirmPassword) {
            // If one password field is provided without the other
            return res.status(400).json({ message: 'Both password and confirm password fields are required' });
        }

        // Save the updated user information
        await user.save();

        // Return a success response with updated user information
        return res.status(200).json({ message: 'Profile updated successfully', user: user });
    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(500).json({ message: error.message });
    }
};

// Retrieve the profile information of a user by their user ID
const getUserProfileById = async (req, res) => {
    try {
        // Extract the userId from the request parameters
        const { userId } = req.params;

        // Find the user by the provided user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user's profile information
        return res.status(200).json({
            email: user.email,
            name: user.name,
            studentId: user.studentID,
            profileImage: user.profileImage,
            verified: user.verified
        });
    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { userProfile, updateUserProfile, getUserProfileById };
