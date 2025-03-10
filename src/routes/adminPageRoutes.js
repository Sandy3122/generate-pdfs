// admin page routes
const router = require('express').Router();
const path = require("path");

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.session && req.session.role === 'admin') {
      return next();
    } else {
      res.status(403).send("Access denied. Admins only.");
    }
  };  


// Middleware to check if user is authenticated with a valid role
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.role) {
      // User is authenticated with a valid role, proceed to the next middleware
      return next();
    } else {
      // User is not authenticated, redirect to access denied page
      return res.redirect("/login");
    }
  };

// // Admin Login route
// router.get("/login", (req, res, next) => {
//     console.log('req.session && req.session.role === "admin": ', req.session && req.session.role === "admin")
//   // Check if user is authenticated
//   if (req.session && req.session.role === 'admin') {
//     // If authenticated, redirect or any authenticated route
//     return res.redirect("/admin/dashboard");
//   }
//   if (req.session && req.session.role !== 'admin') {
//     // If an admin, show an appropriate error message
//     return res.status(403).send("Access denied. Other login session is already active");
//   }
//   // If not authenticated, serve the login page
//   res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "loginPage.html"));
// });

// Define route to serve employee profile page
router.get('/dashboard', isAuthenticated, isAdmin, (req, res) => {
    // If authenticated with any valid role, serve the main dashboard page
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'main.html'));
  });
  

// Define route to serve access rights page
router.get('/access-rights', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'accessRights.html'));
});

// Access denied route
router.get("/access-denied", (req, res) => {
  res.status(403).send("Access denied");
});

// route to Add users
router.get('/user-profiles',isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'userProfiles.html'));
});


module.exports = router;





// // adminPageRoutes.js
// const express = require('express');
// const path = require('path');
// const router = express.Router();

// // // Serve Admin Login Page
// // router.get('/login', (req, res) => {
// //     // res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin', 'adminLogin.html'));
// //     res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'loginPage.html'));
// // });

// // Serve Dashboard Page
// router.get('/dashboard', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', '..', 'public', 'main.html'));
// });

// // Serve Access Rights Page
// router.get('/access-rights', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', '..', 'public', 'employees', 'accessRights.html'));
// });

// // Serve User Profiles Page
// router.get('/user-profiles', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', '..', 'public', 'customer', 'userProfiles.html'));
// });

// // Access Denied Route
// router.get('/access-denied', (req, res) => {
//     res.status(403).send('Access denied');
// });

// module.exports = router;
