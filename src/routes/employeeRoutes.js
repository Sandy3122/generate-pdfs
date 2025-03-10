// employee routes

const express = require('express');
const router = express.Router();
const { handleEmployeeRegistration } = require('../controllers/employeeRegistrationController');
const { searchEmployees } = require('../controllers/employeeSearchController');
const { updateEmployeeStatus, updateRole } = require('../controllers/employeeStatusController');
const { handleEmployeeLogin } = require('../controllers/employeeLoginController');
const { authenticateToken } = require('../utilities/verifyToken'); // Import the authenticateToken middleware
const { handleTestUpload } = require("../controllers/testUploadController");


// Testing Upload Functionality
router.post('/uploadTestFile', handleTestUpload);

// Employee registration route
router.post('/employee-registration', handleEmployeeRegistration);

// Search employees route (requires authentication)
router.get('/employee-search', searchEmployees);

// Update employee status route (requires authentication)
router.patch('/employee-status/:employeeId', updateEmployeeStatus);

// Update employee role route (requires authentication)
router.patch('/updateRole/:employeeId', updateRole);

// Login route
router.post('/employee-login', handleEmployeeLogin);



module.exports = router;
