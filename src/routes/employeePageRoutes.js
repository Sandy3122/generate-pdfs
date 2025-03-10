// // employee page routes

// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const { authenticateTokenInCookies } = require('../utilities/authenticate')

// // Middleware to authenticate token
// // router.use(authenticateTokenInCookies);

// // Middleware to check if user is an employee
// const isEmployee = (req, res, next) => {
//   // Check if user is authenticated and the role is employee
//   if (req.cookies && req.cookies.token && req.user.role !== "admin") {
//     // User is authenticated as an employee, proceed to the next middleware
//     next();
//   } else {
//     // User is not authenticated as an employee, redirect to login page
//     res.redirect("/login");
//   }
// };

// // Employee Registration route
// router.get("/employee-registration", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeRegistration.html"));
// });

// // A Login route
// router.get("/employee-login", (req, res) => {
//   // Check if user is authenticated
//   if (req.cookies && req.cookies.token && req.user.role === 'admin') {
//     // If authenticated and not an admin, redirect to employee dashboard
//     return res.redirect("/employee/dashboard");
//   }

//   // Check if the user is an admin
//   if (req.cookies && req.cookies.token && req.user.role === 'admin') {
//     // If an admin, show an appropriate error message
//     return res.status(403).send("Access denied. Other login cookies is already active");
//   }

//   // If not authenticated or not an admin, serve the employee login page
//   res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeLogin.html"));
// });

// // Define route to serve employee profile page
// router.get('/dashboard', authenticateTokenInCookies, (req, res) => {
//   // Check if user is authenticated
//   if (!req.cookies.token && !req.user.role) {
//     // If not authenticated, redirect to login page
//     return res.redirect("/login");
//   }
//   // If authenticated and an employee, serve the main dashboard page
//   res.sendFile(path.join(__dirname, '..', '..', 'public', 'main.html'));
// });


// // Employee Registration route
// router.get("/reset-userPassword", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "..", "public", "customer", "resetUserPassword.html"));
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const path = require("path");

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

// Middleware to check if the user is not an admin
const isNotAdmin = (req, res, next) => {
  if (req.session && req.session.role && req.session.role !== 'admin') {
    return next();
  } else {
    res.status(403).send("Access denied. Other login session is already active");
  }
};

// Employee Registration route
router.get("/employee-registration", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "employeeRegistration.html"));
});

router.get('/dashboard', isAuthenticated, isNotAdmin, (req, res) => {
  // If authenticated with any valid role, serve the main dashboard page
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'main.html'));
});


// Employee Registration route
router.get("/reset-userPassword", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "customer", "resetUserPassword.html"));
});

// // A Login route
// router.get("/login", (req, res) => {
//   // Check if user is authenticated
//   if (req.session && req.session.role !== 'admin') {
//     // If authenticated and not an admin, redirect to employee dashboard
//     return res.redirect("/employee/dashboard");
//   }

//   // Check if the user is an admin
//   if (req.session && req.session.role === 'admin') {
//     // If an admin, show an appropriate error message
//     return res.status(403).send("Access denied. Other login session is already active");
//   }

//   // If not authenticated or not an admin, serve the employee login page
//   res.sendFile(path.join(__dirname, "..", "..", "public", "employees", "loginPage.html"));
// });

// // Define route to serve employee profile page
// router.get('/dashboard', isEmployee, (req, res) => {
//   // Check if user is authenticated
//   if (!req.session.role) {
//     // If not authenticated, redirect to login page
//     return res.redirect("/login");
//   }
//   // If authenticated and an employee, serve the main dashboard page
//   res.sendFile(path.join(__dirname, '..', '..', 'public', 'main.html'));
// });


// Define route to serve employee profile page


module.exports = router;
