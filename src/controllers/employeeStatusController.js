// employeeUpdateController.js
const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = {
  updateEmployeeStatus: async function(req, res) {
    const employeeId = req.params.employeeId;
    const { status } = req.body;

    try {
      // Retrieve the employee document from Firestore
      const employeeRef = db.collection('employeeRegistrationData').doc(employeeId);
      const employeeDoc = await employeeRef.get();

      // If employee document doesn't exist
      if (!employeeDoc.exists) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      // Update the account status field
      await employeeRef.update({ accountStatus: status });

      return res.status(200).json({ message: `Employee status updated to ${status}` });
    } catch (error) {
      console.error('Error updating employee status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateRole: async function(req, res) {
    const employeeId = req.params.employeeId;
    const { role } = req.body;

    try {
      // Retrieve the employee document from Firestore
      const employeeRef = db.collection('employeeRegistrationData').doc(employeeId);
      const employeeDoc = await employeeRef.get();

      // If employee document doesn't exist
      if (!employeeDoc.exists) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      // Update the role field
      await employeeRef.update({ role });

      return res.status(200).json({ message: `Role updated to ${role}` });
    } catch (error) {
      console.error('Error updating role:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
