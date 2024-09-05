const mongoose = require('mongoose');

const verificationTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // The token will automatically delete after 10 minutes
    }
});

module.exports = mongoose.model('VerificationToken', verificationTokenSchema);
