// general routes
const express = require('express');
const router = express.Router();
const path = require("path");
const { getUserProfile, userLogout, getUserSessionData } = require('../controllers/userProfileController'); // Import the getEmployeeProfile controller
const {getAllData, getDocumentData, getDataById, fetchAllDataByFieldNames, getDataByIdWithFieldNames, getAllNestedData, getDataWithOptionalFields} = require('../controllers/fetchData')
const { handleUserRegistration } = require('../controllers/userRegistrationController');
const { updateImageStatus } = require('../controllers/updateDataController');
const { deleteProfileById } = require('../controllers/deleteDataController');
const uploadController = require('../controllers/uploadDocsController')
const {authenticateTokenInSession,  authenticateToken } = require('../utilities/authenticate')
const { handleLogin } = require('../controllers/loginController')


// Employee profile route (requires authentication)
router.get('/profile', authenticateToken, getUserProfile);

router.post('/login', handleLogin);

// User Logout
// router.get('/logout', userLogout);

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});


// Access Denied Page.
router.get('/access-denied', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'accessDenied.html'));
});

// Get all employees route
router.get('/getall-employees', async (req, res) => {
  await getAllData(req, res, 'employeeRegistrationData');
});

// Get all app users route
router.get('/getall-appUsers', async (req, res) => {
  await getAllData(req, res, 'appusers');
});

// Get all app users by id
router.get('/getUserById/:documentId', async (req, res) => {
  await getDataById(req, res, 'appusers');
});

// get image list
router.get("/getImageList", authenticateToken, async (req, res) => {
  let fieldNames = ['id', 'customerId', 'firstName', 'lastName', 'registeredMobileNumber', 'imgList']
  await fetchAllDataByFieldNames(req, res, 'appusers', fieldNames);
});

// update image status
router.patch("/updateImageStatus", authenticateToken, async (req, res) => {
  await updateImageStatus(req, res, 'appusers');
});

// Get all routes
router.get('/getAllRoutes', async (req, res) => {
  await getAllData(req, res, 'routes');
});

// User Registration
router.post('/user-registration',authenticateTokenInSession, handleUserRegistration);

// Get user data from the sessions
router.get('/getUserDataFromSessions',authenticateToken, getUserSessionData);

// Get User Data By Id With Specific FieldNames
router.get("/getImageList/:documentId", authenticateToken, async (req, res) => {
  let fieldNames = ['imgList']
  await getDataByIdWithFieldNames(req, res, 'appusers', fieldNames);
});

// Get User files by id
router.get("/getUserFiles/:documentId", async (req, res) => {
  let fieldNames = ['id', 'customerId', 'firstName', 'lastName', 'registeredMobileNumber', 'imgList', 'kyc']
  await getDataByIdWithFieldNames(req, res, 'appusers', fieldNames);
});

// Delete User Data By Id
router.delete("/deleteUserProfile/:documentId",authenticateTokenInSession, async (req, res) => {
  await deleteProfileById(req, res);
});

// Get all dropdowns data 
router.get('/dropdowns', async (req, res) => {
  await getAllData(req, res, 'dropdown');
});

// Get country dropdown data 
router.get('/country-dropdown', async (req, res) => {
  await getAllNestedData(req, res, 'dropdown');
});

// accessRoles route 
router.get('/dropdown/accessRoles', async (req, res) => {
  await getDocumentData(req, res);
});

// accessRoles route 
router.get('/appusers/:documentId', async (req, res) => {
  await getDocumentData(req, res);
});

// To upload user docs and update appusers collection with respective links
// router.post('/uploadDocs', authenticateToken, uploadController.uploadMiddleware, uploadController.uploadFiles);
router.post('/uploadDocs',authenticateToken, uploadController.uploadFiles);

// Route to delete user docs and update appusers collection
router.post('/deleteFile', uploadController.deleteFile);


// Pdf Route
router.get('/getProfileData', async (req, res) => {
  let fieldNames = ['id', 'customerId', 'firstName', 'lastName', 'dateOfBirth', 'birthPlace', 'timeOfBirth', 'height', 'religion', 'caste', 'diet', 'drink', 'smoke', 'primaryGuardian', 'secondaryGuardian', 'noOfBrothers', 'noOfSisters', 'noOfBrothersMarried', 'noOfSistersMarried', 'educationLevel', 'educationField', 'workingWith', 'designation', 'annualIncome', 'partnerDetails']
  await fetchAllDataByFieldNames(req, res, 'appusers', fieldNames);
});


// Pdf Route
router.get("/getProfileData/:documentId", async (req, res) => {
  let fieldNames = ['id', 'customerId', 'firstName', 'lastName', 'dateOfBirth', 'birthPlace', 'timeOfBirth', 'height', 'religion', 'caste', 'diet', 'drink', 'smoke', 'primaryGuardian', 'secondaryGuardian', 'noOfBrothers', 'noOfSisters', 'noOfBrothersMarried', 'noOfSistersMarried', 'educationLevel', 'educationField', 'workingWith', 'designation', 'annualIncome', 'partnerDetails']
  await getDataByIdWithFieldNames(req, res, 'appusers', fieldNames);
});

// Generate PDF for each profile
router.get('/generateProfilesPdfs/:documentId?', async (req, res) => {
  const fieldNames = ['id', 'aboutMeDescription', 'customerId', 'firstName', 'lastName', 'permanentAddress', 'dateOfBirth', 'birthPlace', 'manglikStatus', 'maritalStatus', 'timeOfBirth', 'height', 'religion', 'caste', 'diet', 'drink', 'smoke', 'primaryGuardian', 'primaryGuardianRelation', 'secondaryGuardian', 'secondaryGuardianRelation', 'noOfBrothers', 'noOfSisters', 'noOfBrothersMarried', 'noOfSistersMarried', 'educationLevel', 'educationField', 'workingWith', 'designation', 'annualIncome', 'partnerDetails', 'imgList'];
  await getDataWithOptionalFields(req, res, 'appusers', fieldNames);
});

module.exports = router;
