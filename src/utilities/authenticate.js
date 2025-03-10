const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY; // Your JWT secret key
const admin = require('firebase-admin');
const db = admin.firestore();

// Middleware to verify JWT token
// const authenticateToken = (req, res, next) => {
//   console.log(req.headers);
//   const token = req.headers["authorization"];

//   console.log(token);
//   if (!token) {
//     return res.status(403).json({ message: "Token is required." });
//   }

//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//       return res.status(500).json({ message: "Failed to authenticate token." });
//     }

//     // If verification is successful, save decoded data to request for use in other routes
//     req.user = decoded;
//     next();
//   });
// };


function authenticateToken(req, res, next) {
  // console.log("token: ", req.session.token, req.session.role)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] || req.session.token;

  // console.log('token from authenticate file: ', token)
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

    // Assign user data to req.user
    req.user = { token, id, name, phoneNumber, role };
    // console.log('req.user: ', req.user)
    next();
  });
}

// // Function to get all access rights from the database
// async function getAllAccessRights() {
//   const snapshot = await db.collection('accessRights').get();
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// }





function authenticateTokenInSession(req, res, next) {
  const token = req.session && req.session.token;

  if (!token) {
    return res.status(401).json({ message: "Token not found in session." });
  }

  // Verify and decode JWT token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(500).json({ message: 'Failed to authenticate token.' });
    }

    // Extract user data from decoded token
    const { id, name, phoneNumber, role } = decoded;

    // Assign user data to req.user
    req.user = { token, id, name, phoneNumber, role };
    // console.log(req.user)
    next();
  });
}



module.exports = {
  authenticateToken,
  authenticateTokenInSession
};
