const jwt = require('jsonwebtoken');
const config = require('../config/database'); // Import the JWT secret

function authMiddleware(req, res, next) {
    // Get the token from the request headers or query parameters
    const token = req.header('x-auth-token') || req.query.token;

    // Check if token is present
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, config.jwtSecret);

        // Set the user in the request object
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

module.exports = authMiddleware;
