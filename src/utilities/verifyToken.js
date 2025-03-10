const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
    let token;

    // Check if token exists in session
    if (req.session && req.session.token) {
        token = req.session.token;

        // Set role in session for employee login if it exists in the session
        if (req.session.role) {
            req.userRole = req.session.role;
        }
    } else {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    // Verify JWT token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Error verifying JWT token:', err);
            return res.status(403).json({ message: 'Failed to authenticate token.' });
        }
        req.user = decoded; // Set decoded user information on req.user
        next(); // Move to the next middleware or route handler
    });
}

module.exports = {
    authenticateToken
};
