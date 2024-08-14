const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const { accessToken } = req.cookies;

    if (!accessToken) {
        return res.status(401).json({ message: 'Access token not found' });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Invalid or expired access token' });
    }
};

module.exports = { authenticateJWT };
