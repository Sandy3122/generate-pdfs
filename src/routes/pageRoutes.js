const express = require('express');
const router = express.Router();
const path = require("path");

const admin = require('firebase-admin');
const db = admin.firestore();

// Middleware to check access rights
// Middleware to check access rights
router.use(async (req, res, next) => {
    try {
        const role = req.session.role; // Assuming role is stored in session

        // Define routes that every user has access to
        const publicRoutes = ['/profile'];

        // Admin-only routes
        // const adminRoutes = ['/access-rights'];

        // If the user is trying to access a public route, allow access
        if (publicRoutes.includes(req.path)) {
            return next();
        }

        // If the role is admin, allow access to all routes
        if (role === 'admin') {
            return next(); // Continue to the requested route
        }

        // // If the user is trying to access an admin-only route, deny access
        // if (adminRoutes.includes(req.path)) {
        //     return res.redirect('/api/access-denied'); // Redirect to access denied route
        // }

        // For other routes, apply access rights based on role
        const accessRights = await getAllAccessRights();
        const routeName = req.path;

        // Check if access is allowed for the user's role
        const hasAccess = accessRights.some(access => {
            return access.role === role && access.status === 'active' && access.routeName.includes(routeName);
        });

        if (hasAccess) {
            next(); // Continue to the requested route
        } else {
            res.redirect('/api/access-denied'); // Redirect to access denied route
        }
    } catch (error) {
        console.error("Error fetching access rights:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Function to get all access rights from the database
async function getAllAccessRights() {
    const snapshot = await db.collection('accessRights').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


// Serve employee profile page
router.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'profile.html'));
});

// Serve employee search page
router.get("/employee-search", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'employeeSearch.html'));
});

// Serve all employees page
router.get('/getall-employees', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'getAllEmployees.html'));
});

// Route to serve access rights page
router.get('/access-rights', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'accessRights.html'));
});

// route to reset employee passwords
router.get('/reset-employeePassword', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'resetEmployeePassword.html'));
});

// route to reset employee passwords
router.get('/reset-userPassword', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'resetUserPassword.html'));
});

// route to Add users
router.get('/user-registration', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'userRegistration.html'));
});

// route to get all user profiles
router.get('/getall-userProfiles', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'getAllUserProfiles.html'));
});

// route to get user by id
router.get('/user-profile', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'userProfile.html'));
});

// route to profile admin
router.get('/profileAdmin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'profileAdmin.html'));
});

// route to reset Password
router.get('/resetPassword', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'resetPassword.html'));
});

// route to profile info
router.get('/profileInfo', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'profileInfo.html'));
});

// route to mandatory details
router.get('/mandatoryDetails', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'mandatoryDetails.html'));
});

// route to personal deatils
router.get('/personalDetails', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'personalDetails.html'));
});

// route to kyc
router.get('/userKyc', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'userKyc.html'));
});

// route to kyc
router.get('/userAddress', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'userAddress.html'));
});

// route to userFamilyDetails
router.get('/userFamilyDetails', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'userFamilyDetails.html'));
});

// route to educationAndWorkDetails
router.get('/educationAndWorkDetails', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'educationAndWorkDetails.html'));
});

// route to religionAndAstro
router.get('/religionAndAstro', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'religionAndAstro.html'));
});

// route to allUsersImageVerification
router.get('/allUsersImageVerification', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'allUsersImageVerification.html'));
});

// route to allUsersImageVerification
router.get('/generatePdfs', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'generatePdfs.html'));
});

// route to photoGallery
router.get('/partnerPreference', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'partnerPreference.html'));
});

// route to photoGallery
router.get('/profileGallery', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'profileGallery.html'));
});


// route to delete user profile
router.get('/deleteUserProfile', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'deleteUserProfile.html'));
});

// route to upload user documents
router.get('/uploadUserDocs', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'uploadUserDocs.html'));
});



module.exports = router;