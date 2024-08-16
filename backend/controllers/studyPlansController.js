const StudyPlan = require('../models/StudyPlan');

// Controller to create a new study plan
const newStudyPlan = async (req, res) => {
    try {
        const userId = req.user.userId; // Retrieve userId from authenticated user

        // Destructure required fields from the request body
        const { title, description, startDate, endDate, tasks } = req.body;

        // Check if mandatory fields are provided
        if (!title || !startDate || !endDate) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        // Create a new StudyPlan instance with the provided data
        const newStudyPlan = new StudyPlan({
            userId,
            title,
            description,
            startDate,
            endDate,
            tasks
        });

        // Save the new study plan to the database
        await newStudyPlan.save();

        return res.status(200).json({ message: 'Study Plan created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Controller to retrieve all study plans of the authenticated user
const allStudyPlan = async (req, res) => {
    try {
        const userId = req.user.userId; // Retrieve userId from authenticated user

        // Ensure that the userId is present
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Fetch all study plans associated with the userId
        const studyPlan = await StudyPlan.find({ userId: userId });

        return res.status(200).json({ studyPlan });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Controller to find a specific study plan by its ID for the authenticated user
const findStudyPlanById = async (req, res) => {
    try {
        const userId = req.user.userId; // Retrieve userId from authenticated user
        const { planId } = req.params; // Extract planId from URL parameters

        // Ensure that the userId is present
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Find the specific study plan associated with the userId and planId
        const studyPlan = await StudyPlan.findOne({ userId, planId });

        // If no study plan is found, return a 404 error
        if (!studyPlan) {
            return res.status(404).json({ message: 'Study plan not found' });
        }

        return res.status(200).json({ studyPlan });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Controller to update a specific study plan by its ID
const updateStudyPlanById = async (req, res) => {
    try {
        const userId = req.user.userId; // Retrieve userId from authenticated user
        const { planId, taskId } = req.params; // Extract planId and taskId from URL parameters

        // Ensure that the userId is present
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Find the specific study plan associated with the userId and planId
        const studyPlan = await StudyPlan.findOne({ userId, planId });

        // If no study plan is found, return a 404 error
        if (!studyPlan) {
            return res.status(404).json({ message: 'Study plan not found' });
        }

        // Find the specific task within the tasks array
        const task = studyPlan.tasks.find(task => task.taskId.equals(taskId));
        
        // If the task is not found, return a 404 error
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update fields if they are provided in the request body
        if (req.body.title) {
            studyPlan.title = req.body.title;
        }
        if (req.body.description) {
            studyPlan.description = req.body.description;
        }
        if (req.body.startDate) {
            studyPlan.startDate = req.body.startDate;
        }
        if (req.body.endDate) {
            studyPlan.endDate = req.body.endDate;
        }
        
        if (req.body.taskName) {
            task.taskName = req.body.taskName;
        }
        if (typeof req.body.completed !== 'undefined') {
            task.completed = req.body.completed;
        }

        // Save the updated study plan to the database
        await studyPlan.save();

        return res.status(200).json({ message: 'Study plan updated successfully', studyPlan });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Controller to delete a specific study plan by its ID
const deleteStudyPlanById = async (req, res) => {
    try {
        const userId = req.user.userId;  // Retrieve userId from authenticated user
        const { planId } = req.params;   // Extract planId from URL parameters

        // Ensure that the userId is present
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Find and delete the study plan associated with the userId and planId
        const studyPlan = await StudyPlan.findOneAndDelete({ userId, planId });

        // If no study plan is found, return a 404 error
        if (!studyPlan) {
            return res.status(404).json({ message: 'Study plan not found' });
        }

        return res.status(200).json({ message: 'Study plan deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Export all controller functions for use in routes
module.exports = { newStudyPlan, allStudyPlan, findStudyPlanById, updateStudyPlanById, deleteStudyPlanById };
