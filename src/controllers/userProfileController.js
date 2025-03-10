// ProfileController.js

const admin = require("firebase-admin");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const { authenticateTokenInCookies } = require('../utilities/authenticate')

// Fetch profile data based on user role
async function getUserProfile(req, res) {
    try {
        // Ensure user object exists in request
        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: 'User ID not provided in request.' });
        }

        const userId = req.user.id; // Extract user ID from authenticated user
        let userRole;

        // Check if user role exists in the session
        if (req.user) {
            userRole = req.user.role;
        } else {
            return res.status(400).json({ error: 'User role not found in cookies.' });
        }

        if (userRole) {
            return getEmployeeProfile(req, res, userId);
        } else {
            return res.status(400).json({ error: 'Invalid user role.' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}




// Fetch employee profile data
async function getEmployeeProfile(req, res, employeeId) {
    try {
        const employeeRef = admin.firestore().collection('employeeRegistrationData').doc(employeeId);
        const employeeDoc = await employeeRef.get();

        if (!employeeDoc.exists) {
            return res.status(404).json({ message: 'Employee profile not found.' });
        }
        
        const employeeData = employeeDoc.data();
        return res.status(200).json({ user: employeeData });
    } catch (error) {
        console.error('Error fetching employee profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Fetch admin profile data
async function getAdminProfile(req, res, adminId) {
    try {
        const adminRef = admin.firestore().collection('admins').doc(adminId);
        const adminDoc = await adminRef.get();

        if (!adminDoc.exists) {
            return res.status(404).json({ message: 'Admin profile not found.' });
        }
        
        const adminData = adminDoc.data();
        return res.status(200).json({ user: adminData });
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


// // Employee Logout route
// async function userLogout(req, res) {
//     // Check if role exists in the cookies
//     if (req.cookies.role) {
//         console.log(req.cookies.role)
//         const role = req.cookies.role;
//         // Clear the token and role from the cookies
//         delete req.cookies.token;
//         delete req.cookies.role;

//         // Redirect based on role
//         if (role === "admin") {
//             res.redirect('/admin/admin-login');
//         } else if (role) {
//             res.redirect('/login');
//         } else {
//             // Handle other roles if needed
//             res.redirect('/');
//         }
//     } else {
//         // If role is not found, stay on the same page
//         res.redirect('back'); // Redirect back to the previous page
//     }
// }


// async function getUserSessionData(req, res) {
//     try {
//         // Retrieve the data object from the session
//         const { token, ...userData } = sessionData.data;
//         const { role } = sessionData;
//         // const sessionData = { ...userData, role }
//         // console.log(sessionData)
//         // Send the data object as JSON response
//         res.json({ ...userData, role });
//     } catch (error) {
//         console.error("Error retrieving user session data:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

// // Employee Logout route
// async function userLogout(req, res) {
//     // Check if role exists in the cookies
//     if (req.cookies.token) {
//       const role = req.user.role;
//       console.log(role)

//       // Clear the token and role from the cookies
//       res.clearCookie('token', {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict'
//       });
//       res.clearCookie('role', {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict'
//       });
  
//       // Redirect based on role
//       if (role === "admin") {
//         res.redirect('/admin/admin-login');
//       } else if (role) {
//         res.redirect('/login');
//       } else {
//         // Handle other roles if needed
//         res.redirect('/');
//       }
//     } else {
//       // If role is not found, stay on the same page
//       res.redirect('back'); // Redirect back to the previous page
//     }
//   }


// Employee Logout route
// async function userLogout(req, res) {
//     // Check if the token exists in the cookies
//     if (req.cookies && req.cookies.token) {
//         // Extract user data from req.user if it exists
//         const role = req.user ? req.user.role : null;
//         console.log(role);

//         // Clear the token and role from the cookies
//         res.clearCookie('token', {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict'
//         });
//         res.clearCookie('role', {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict'
//         });

//         // Redirect based on role
//         if (role === "admin") {
//             res.redirect('/admin/admin-login');
//         } else if (role) {
//             res.redirect('/login');
//         } else {
//             // Handle other roles if needed
//             res.redirect('/');
//         }
//     } else {
//         // If token is not found, stay on the same page
//         res.redirect('/');
//     }
// }



// async function getUserSessionData(req, res) {
//   try {
//     // Retrieve JWT token from cookie
//     const cookies = req.headers.cookie;
//     if (!cookies) {
//       return res.status(401).json({ message: "Token not found in cookies." });
//     }
  
//     // Extract the token from the cookies
//     const token = cookies.split(';').find(cookie => cookie.trim().startsWith('token='));
//     if (!token) {
//       return res.status(401).json({ message: "Token not found in cookies." });
//     }
  
//     const tokenValue = token.split('=')[1];
  
//     // Verify and decode JWT token
//     jwt.verify(tokenValue, secretKey, (err, decoded) => {
//       if (err) {
//         console.error('Error verifying token:', err);
//         return res.status(500).json({ message: 'Failed to authenticate token.' });
//       }

//       // Extract user data from decoded token
//       const { id:id, name:name, phoneNumber:phoneNumber, role:role } = decoded;

//       // Return user data as JSON response
//       res.json({ token, id, name, phoneNumber, role });
//     });

//   } catch (error) {
//     console.error("Error retrieving user session data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

async function userLogout(req, res) {
    // Extract user data from req.user if it exists
    const role = req.user ? req.user.role : null;
    console.log(role);

    // Respond to client to clear the local storage
    res.status(200).json({
        message: "Logout successful. Clear local storage.",
        role: role
    });
}

module.exports = { userLogout };


async function getUserSessionData(req, res) {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ message: "Token not found in header." });
      }
  
      // Verify and decode JWT token
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(500).json({ message: 'Failed to authenticate token.' });
        }
  
        // Extract user data from decoded token
        const { id, name, phoneNumber, role } = decoded;
  
        // Return user data as JSON response
        res.json({ token, id, name, phoneNumber, role });
      });
    } catch (error) {
      console.error("Error retrieving user session data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }


module.exports = {
    getUserProfile,
    userLogout,
    getUserSessionData,
};
