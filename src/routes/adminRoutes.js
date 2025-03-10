
// admin routes
const express = require('express');
const router = express.Router();
const { handleAdminRegistration } = require('../controllers/adminRegistrationController');
const { handleAdminLogin } = require('../controllers/adminLoginController');
const accessRightsController  = require('../controllers/accessRightsController');
const { resetPassword } = require("../controllers/resetPasswordController");
const { updateData } = require('../controllers/updateDataController')
const { authenticateToken } = require('../utilities/authenticate.js')

// Admin registration route
router.post('/admin-registration', handleAdminRegistration);

// Admin login route
router.post('/admin-login', handleAdminLogin);

// add access rights
router.post('/access-rights', accessRightsController.addRoleRights);

// Get all access rights
router.get('/access-rights', accessRightsController.getAllAccessRights);

// Update access right status
router.patch('/access-rights/:accessRightId/status', accessRightsController.updateAccessRightStatus);

// Update access right routes
router.patch('/access-rights/:accessRightId/routes', accessRightsController.updateAccessRightRoutes);

// Delete access right routes
router.delete('/access-rights/:accessRightId', accessRightsController.deleteAccessRight);

// resetting employee password
router.patch("/reset-employeePassword", (req, res) => {
    resetPassword(req, res, 'employeeRegistrationData');
});

// resetting user password
router.patch("/reset-userPassword", (req, res) => {
    resetPassword(req, res, 'appusers');
});

// update user data
router.post("/updateUserData", (req, res) => {
    updateData(req, res, 'appusers');
});


module.exports = router;
