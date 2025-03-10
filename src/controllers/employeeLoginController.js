// employeeLoginController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getEmployeeByPhoneNumber } = require("../models/employeeLoginModel");
const secretKey = process.env.SECRET_KEY;

module.exports = {
  handleEmployeeLogin: async function (req, res) {
    const { phoneNumber, pin } = req.body;
  
    try {
      // Fetch employee by phone number
      const employee = await getEmployeeByPhoneNumber(phoneNumber);
      
      if (!employee) {
        return res.status(401).json({ message: 'Invalid phone number or PIN.' });
      }
  
      // Check if account status is active
      if (employee.accountStatus !== 'active') {
        return res.status(401).json({ message: 'Your account is inactive, please contact admin.' });
      }
  
      // Verify PIN
      const isPinValid = await bcrypt.compare(pin, employee.pin);
      if (!isPinValid) {
        return res.status(401).json({ message: 'Invalid phone number or PIN.' });
      }

      // Generate JWT token
      const token = jwt.sign({id:employee.id || employee.employeeId, name:employee.firstName + " " + employee.lastName, phoneNumber:employee.phoneNumber, role: employee.role}, secretKey, { expiresIn: '30m' });
  
      // Return the token or any other relevant data
      return res.status(200).json({
        message: "Employee Login Successful",
        token: token,
        employeeId: employee.employeeId,
        role: employee.role,
        data: employee.data
      });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
