// admin registration controller
const { saveAdminData } = require('../models/adminRegistrationModel');
const { checkExistingByEmail, checkExistingByPhoneNumber } = require('../utilities/userExistenceCheck');
const { generateNumericId } = require("../utilities/generateIds");
const bcrypt = require('bcryptjs');

module.exports = {
  handleAdminRegistration: async function (req, res) {
    try {
      // Access request body properties and trim leading/trailing spaces
      const firstName = req.body.firstName.trim().toLowerCase();
      const lastName = req.body.lastName.trim().toLowerCase();
      const email = req.body.email.trim().toLowerCase();
      const dateOfBirth = req.body.dateOfBirth.trim().toLowerCase();
      const phoneNumber = req.body.phoneNumber.trim().toLowerCase();
      const pin = req.body.pin.trim().toLowerCase();
      const role = req.body.role.trim().toLowerCase();
      const maritalStatus = req.body.maritalStatus.trim().toLowerCase();
      const gender = req.body.gender.trim().toLowerCase();
      const emergencyPhoneNumber = req.body.emergencyPhoneNumber.trim().toLowerCase();

      // Check if required fields are provided
      if (!(firstName && lastName && email && dateOfBirth && phoneNumber && pin && role && maritalStatus && gender && emergencyPhoneNumber)) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if the user already exists with the provided email
      const emailExists = await checkExistingByEmail(email, 'admin');
      if (emailExists) {
        return res.status(401).json({ message: "Admin already exists with this email." });
      }
      
      // Check if the user already exists with the provided mobile number
      const mobileNumberExists = await checkExistingByPhoneNumber(phoneNumber, 'admin');
      if (mobileNumberExists) {
        return res.status(401).json({ message: "Admin already exists with this mobile number." });
      }

      // Hash the admin's password
      const hashedPin = await bcrypt.hash(pin, 10);
        
      // Generate a unique admin ID
      const adminId = "admin" + generateNumericId();

      // Create an object with lowercase values
      const adminData = {
        adminId,
        firstName,
        lastName,
        email,
        phoneNumber,
        pin: hashedPin, // Saving the hashed password
        role,
        dateOfBirth,
        maritalStatus,
        gender,
        emergencyPhoneNumber
      };

      await saveAdminData(adminId, adminData);

      return res.status(201).json({ message: 'Admin data saved successfully'});
    } catch (error) {
      console.error('Error handling admin registration:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
