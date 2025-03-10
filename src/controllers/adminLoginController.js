// adminLoginController.js
const { getAdminByPhoneNumber } = require("../models/adminLoginModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

module.exports = {
  handleAdminLogin: async function(req, res) {
    const { phoneNumber, pin } = req.body;

    console.log("req: ", req.url)
  
    try {
      // Fetch admin by phone number
      const admin = await getAdminByPhoneNumber(phoneNumber);
  
      if (!admin) {
        return res.status(401).json({ message: 'Invalid phone number or PIN.' });
      }
  
      // Verify PIN
      const isPinValid = await bcrypt.compare(pin, admin.pin);
      if (!isPinValid) {
        return res.status(401).json({ message: 'Invalid phone number or PIN.' });
      }

      // Generate JWT token with user type as the role
      const token = jwt.sign({id:admin.id, name:admin.firstName + " " + admin.lastName, phoneNumber:admin.phoneNumber, role: admin.role}, secretKey, { expiresIn: '30m' });
      
      // Store the role in the server-side session
      
      req.session.role = admin.role;
      res.cookie('role', admin.role, { httpOnly: true, secure: true, sameSite: 'Strict' });

      // Return the token or any other relevant data
      return res.status(200).json({
        token: token,
        message: "Admin Login Successful",
        adminId: admin.id, // Include the adminId in the response
        role:admin.role, // Include the role in the response
      });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};