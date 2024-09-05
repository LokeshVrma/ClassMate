const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
require('dotenv').config();

// Register a new user
const registerUser = async (req, res) => {
    try {
        // Create a new user with hashed password
        const newUser = new User({
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 12), // Hash the password
            name: req.body.name,
            studentID: req.body.studentID,
            profileImage: req.body.profileImage,
        });
        
        const user = await User.findOne({ email:req.body.email });
        if(!user) {
            const savedUser = await newUser.save();
            res.status(200).json({ message: 'Registration successful, please check your email to verify your account.', userId: savedUser._id });
        }
        else {
            return res.status(409).json({ message: "User already exists" });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save the OTP and expiration time in the VerificationToken model
        const verificationToken = new VerificationToken({
            userId: newUser._id,
            token: otp,
            expiresAt: Date.now() + 10 * 60 * 1000  //OTP valid for 10 minutes
        });

        await verificationToken.save();

        // Set up the email transporter using nodemailer
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options for sending OTP
        const mailOptions = {
            from: `"ClassMate" <${process.env.EMAIL_USER}>`,
            to: newUser.email,
            subject: 'Your OTP for ClassMate Verification',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1 style="color: #5B99C2;">Welcome to ClassMate, ${newUser.name}!</h1>
                    <p>Your OTP for email verification is:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <h2 style="color: #4CAF50;">${otp}</h2>
                    </div>
                    <p>Please enter this OTP within 10 minutes to verify your email address.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>The ClassMate Team</p>
                </div>
            `
        };

        // Send the verification email
        await transporter.sendMail(mailOptions);
        
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Verify the user's email using the OTP
const verifyUser = async (req, res) => {
    try {
        const { otp, userId } = req.body; // Expecting OTP and user ID in the request body

        // Find the verification token from the database
        const verificationToken = await VerificationToken.findOne({ userId: userId, token: otp });

        if (!verificationToken) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if the OTP has expired
        if (verificationToken.expiresAt < Date.now()) {
            await VerificationToken.findByIdAndDelete(verificationToken._id);
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Mark the user as verified
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.verified = true;
        await user.save();

        // Delete the OTP after successful verification
        await VerificationToken.findByIdAndDelete(verificationToken._id);

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


// Log in a user and generate access and refresh tokens
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter email and password' });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare provided password with stored hashed password
        const isPasswordSame = await bcrypt.compare(password, user.password);

        if (!isPasswordSame) {
            return res.status(400).json({ message: 'Wrong password' });
        }

        // Generate access token (short-lived)
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Generate refresh token (long-lived)
        const refreshToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '30d' }
        );

        // Send the new access token and refresh token as HTTP-only cookies
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

        // Return a success response
        return res.status(200).json({ message: 'Logged in successfully',
            user: { id: user._id, name: user.name, role: user.role } 
         });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Refresh access token using the refresh token
const refreshUserToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found, please log in again' });
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { userId: decoded.userId, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Send the new access token as an HTTP-only cookie
        res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });

        return res.status(200).json({ message: 'Access token refreshed successfully' });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
};

// Route to send OTP
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save the OTP and expiration time in the VerificationToken model
        const verificationToken = new VerificationToken({
            userId: user._id,
            token: otp,
            expiresAt: Date.now() + 10 * 60 * 1000 // OTP valid for 10 minutes
        });

        await verificationToken.save();

        // Set up the email transporter using nodemailer
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options for sending OTP
        const mailOptions = {
            from: `"ClassMate" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Your OTP for Password Reset',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1 style="color: #5B99C2;">Password Reset Request</h1>
                    <p>Your OTP for password reset is:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <h2 style="color: #4CAF50;">${otp}</h2>
                    </div>
                    <p>Please enter this OTP within 10 minutes to reset your password.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>The ClassMate Team</p>
                </div>
            `
        };

        // Send the verification email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'OTP sent to your email', userId: user._id, otp: otp });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Route to verify OTP and reset password
const verifyOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const verificationToken = await VerificationToken.findOne({ userId, token: otp });
        console.log(verificationToken)

        if (!verificationToken) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // If OTP is valid, allow password reset
        return res.status(200).json({ message: 'OTP verified', userId });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Route to reset password
const resetPassword = async (req, res) => {
    try {
        const { userId, password } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password and save it
        user.password = await bcrypt.hash(password, 12);
        await user.save();

        // Delete the verification token after password reset
        await VerificationToken.deleteOne({ userId });

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Log out a user by clearing cookies
const logoutUser = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, verifyUser, loginUser, refreshUserToken, forgotPassword, verifyOtp, resetPassword, logoutUser };
