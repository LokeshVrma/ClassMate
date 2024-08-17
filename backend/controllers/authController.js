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

        await newUser.save();

        // Generate a verification token for email verification
        const token = crypto.randomBytes(32).toString('hex');

        const verificationToken = new VerificationToken({
            userId: newUser._id,
            token: token
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

        // Email options for sending the verification link
        const mailOptions = {
            from: `"ClassMate" <${process.env.EMAIL_USER}>`,
            to: newUser.email,
            subject: 'Verify Your Email - ClassMate',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #5B99C2;">Welcome to ClassMate, ${newUser.name}!</h2>
                    <p>Thank you for signing up. To complete your registration, please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="http://localhost:5000/api/auth/verify?token=${token}&id=${newUser._id}"
                        style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Verify Your Email
                        </a>
                    </div>
                    <p>If the button above doesn't work, please copy and paste the following link into your web browser:</p>
                    <p><a href="http://localhost:5000/api/auth/verify?token=${token}&id=${newUser._id}"
                        style="color: #4CAF50;">http://localhost:5000/api/auth/verify?token=${token}&id=${newUser._id}</a></p>
                    <p>If you did not sign up for ClassMate, please ignore this email.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>The ClassMate Team</p>
                </div>
            `
        };
        // Send the verification email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Registration successful, please check your email to verify your account.' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred during registration.', error: error.message });
    }
};

// Verify the user's email using the verification token
const verifyUser = async (req, res) => {
    try {
        const { token, id } = req.query;

        // Find the verification token from the database
        const verificationToken = await VerificationToken.findOne({ userId: id, token: token });

        if (!verificationToken) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Find the user associated with the token
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the token has expired (1 hour validity)
        if (verificationToken.createdAt.getTime() + 3600000 < Date.now()) { 
            await VerificationToken.findByIdAndDelete(verificationToken._id);
            return res.status(400).json({ message: 'Token has expired.' });
        }

        // Mark the user as verified
        user.verified = true;
        await user.save();

        // Delete the verification token after successful verification
        await VerificationToken.findByIdAndDelete(verificationToken._id);

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred during email verification.' });
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
        return res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
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
        console.error(error);
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
};

// Log out a user by clearing cookies
const logoutUser = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, verifyUser, loginUser, refreshUserToken, logoutUser };
