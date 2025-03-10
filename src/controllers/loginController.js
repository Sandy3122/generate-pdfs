const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  getAdminByPhoneNumber,
  getUserByPhoneNumber,
} = require("../models/adminLoginModel");
const { getEmployeeByPhoneNumber } = require("../models/employeeLoginModel");
const secretKey = process.env.SECRET_KEY;

module.exports = {
  handleLogin: async function (req, res) {
    const { phoneNumber, pin } = req.body;
    // console.log(phoneNumber, pin);

    let user, userType;

    try {
      // Example function to fetch user details from the database based on phoneNumber
      const userFromDB = await getAdminByPhoneNumber(phoneNumber) || await getEmployeeByPhoneNumber(phoneNumber);


      if (!userFromDB) {
        // Handle case where user is not found in the database
        console.log(`User with phone number ${phoneNumber} not found`);
        // Return appropriate response or throw an error
        return res.status(404).json({ error: "User not found" });
      }

      // Check userType based on retrieved user data
      if (userFromDB.role === "admin") {
        user = await getUserByPhoneNumber(phoneNumber)
        userType = "admin";
      } else {
        user = await getUserByPhoneNumber(phoneNumber)
        userType = "employee";
      }

      // If no user is found, return an error message
      if (!user) {
        return res.status(401).json({ message: "Invalid phone number or user does not exist." });
      }

      // Check if account status is active
      if (user.accountStatus !== 'active') {
        return res.status(401).json({ message: 'Your account is inactive, please contact admin.' });
            }

      // Verify PIN
      const isPinValid = await bcrypt.compare(pin, user.pin);
      if (!isPinValid) {
        return res
          .status(401)
          .json({ message: "Invalid phone number or PIN." });
      }

      // Generate JWT token with user type as the role
      const token = jwt.sign(
        {
          id: user.id,
          name: user.firstName + " " + user.lastName,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
        secretKey,
        { expiresIn: "24h" }
      );

      // Store the role in the server-side session
      req.session.role = user.role;
      req.session.token = token;

      // Return the token or any other relevant data
      return res.status(200).json({
        token: token,
        message: "Login Successful",
        userId: user.id,
        role: user.role,
        userType: userType
      });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ message: "Internal server error. Please try again later." });
    }
  },
};
