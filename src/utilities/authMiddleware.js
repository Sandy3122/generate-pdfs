// Modified authentication middleware with RBAC
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    // Retrieve the tokens from the session
    let adminToken = req.session.adminToken;
    let employeeToken = req.session.employeeToken;
    console.log('admin:', adminToken);
    console.log('employee:', employeeToken);

    // Check if either token is missing
    if (!adminToken && !employeeToken) {
        return res.status(403).json({ auth: false, message: "Token not provided." });
    }

    // Verify the admin token
    if (adminToken) {
        jwt.verify(adminToken, SECRET_KEY, (err, admin) => {
            if (!err && admin.role === "admin") {
                // If admin token is valid and user is admin, allow access to all routes
                req.user = admin;
                return next();
            }
        });
    }

    // Verify the employee token
    if (employeeToken) {
        jwt.verify(employeeToken, SECRET_KEY, (err, employee) => {
            if (!err && employee.role === "employee") {
                // If employee token is valid and user is employee, allow access only to specific routes
                req.user = employee;
                const allowedRoutes = ["/employee-search"]; // Add other employee routes as needed
                if (allowedRoutes.includes(req.path)) {
                    return next();
                } else {
                    return res.status(403).json({ message: "Unauthorized access" });
                }
            }
        });
    }

    // If neither token is valid or user's role is not recognized, deny access
    return res.status(403).json({ message: "Unauthorized access" });
};

module.exports = { authenticateToken };
