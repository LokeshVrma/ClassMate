const Assignment = require('../models/Assignment');

// Controller to create a new assignment
const newAssignment = async (req, res) => {
    try {
        // Extract userId from the authenticated user (req.user)
        const userId = req.user.userId;

        // Ensure that the userId is present
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }
        
        // Destructure assignment details from the request body
        const { title, description, subject, dueDate, status, files } = req.body;

        // Create a new assignment object with the provided data
        const newAssignment = new Assignment({
            userId,
            title,
            description,       
            subject,       
            dueDate,        
            status,            
            files              
        });

        // Save the new assignment to the database
        await newAssignment.save();

        // Respond with success message upon successful creation
        return res.status(200).json({ message: 'New Assignment Created Successfully' });
    } 
    catch (error) {
        // Handle any errors and send a 500 Internal Server Error response
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

// Controller to retrieve all assignments for a specific user
const allAssignment = async (req, res) => {
    try {
        // Extract userId from the authenticated user
        const userId = req.user.userId;
        
        // Check if the userId is available (authentication check)
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Query the database for all assignments that belong to this user
        const allAssignments = await Assignment.find({ userId: userId });

        // Respond with the list of assignments
        return res.status(200).json({ allAssignments });
    }
    catch (error) {
        // Handle errors and respond with a 500 status code
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

// Controller to view a specific assignment by its ID
const viewAssignmentById = async (req, res) => {
    try {
        // Extract userId from the authenticated user and assignmentId from request parameters
        const userId = req.user.userId;
        const { assignmentId } = req.params;

        // Check if the userId is available (authentication check)
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Query the database for the specific assignment belonging to this user
        const assignment = await Assignment.findOne({ userId, assignmentId: assignmentId });

        // If the assignment is not found, send a 404 Not Found response
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Respond with the assignment details if found
        return res.status(200).json({ assignment });
    }
    catch (error) {
        // Handle errors and respond with a 500 status code
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

// Controller to update an existing assignment by its ID
const updateAssignmentById = async (req, res) => {
    try {
        // Extract userId from the authenticated user and assignmentId from request parameters
        const userId = req.user.userId;
        const { assignmentId, fileId } = req.params;

        // Check if the userId is available (authentication check)
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Query the database for the specific assignment belonging to this user
        const assignment = await Assignment.findOne({ userId, assignmentId: assignmentId });

        // If the assignment is not found, send a 404 Not Found response
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Find the specific file within the files array
        const file = assignment.files.find(file => file.fileId.equals(fileId));

        if (!file) {
            return res.status(404).json({ message: 'File not found' })
        }
        
        // Update the assignment fields with the new data from the request body (if provided)
        if (req.body.title) {
            assignment.title = req.body.title;
        }

        if (req.body.description) {
            assignment.description = req.body.description;
        }

        if (req.body.subject) {
            assignment.subject = req.body.subject;
        }

        if (req.body.dueDate) {
            assignment.dueDate = req.body.dueDate;
        }

        if (req.body.status) {
            assignment.status = req.body.status;
        }

        if (req.body.fileName) {
            file.fileName = req.body.fileName;
        }
        if (typeof req.body.completed !== 'undefined') {
            file.completed = req.body.completed;
        }

        // Save the updated assignment to the database
        await assignment.save();

        // Respond with a success message upon successful update
        return res.status(200).json({ message: 'Assignment Updated Successfully' });
    }
    catch (error) {
        // Handle errors and respond with a 500 status code
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

// Controller to delete an assignment by its ID
const deleteAssignmentById = async (req, res) => {
    try {
        // Extract userId from the authenticated user and assignmentId from request parameters
        const userId = req.user.userId;
        const { assignmentId } = req.params;

        // Check if the userId is available (authentication check)
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Query the database to delete the specific assignment belonging to this user
        const assignment = await Assignment.findOneAndDelete({ userId, assignmentId: assignmentId });
        
        // If the assignment is not found, send a 404 Not Found response
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Respond with a success message upon successful deletion
        return res.status(200).json({ message: 'Assignment deleted successfully' });
    }
    catch (error) {
        // Handle errors and respond with a 500 status code
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
};

// Export the controller functions for use in routes
module.exports = { newAssignment, allAssignment, viewAssignmentById, updateAssignmentById, deleteAssignmentById };
