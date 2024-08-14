const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: {
        type: String
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    verified: {
        type: Boolean,
        default: false
    }
},  {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);