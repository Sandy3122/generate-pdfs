// employeeSearchController.js

const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = {
  searchEmployees: async function(req, res) {
    try {
      let { query: searchTerm } = req.query;

      if (!searchTerm) {
        return res.status(400).json({ message: "Search query is required." });
      }

      // Convert search query parameter to lowercase
      searchTerm = searchTerm.toLowerCase();

      // Construct a regex pattern to search across all relevant fields
      const regexPattern = new RegExp(searchTerm, 'i');

      // Construct a query to search across all relevant fields using regex
      let queryRef = db.collection('employeeRegistrationData')
                        .where('firstName', '>=', searchTerm)
                        .where('firstName', '<=', searchTerm + '\uf8ff')
                        .orderBy('firstName')
                        .limit(10);

      // Execute the query
      const snapshot = await queryRef.get();

      if (snapshot.empty) {
        let employees = [];

        // If no matches found for first name, try searching by last name or employee ID
        queryRef = db.collection('employeeRegistrationData')
                        .where('lastName', '>=', searchTerm)
                        .where('lastName', '<=', searchTerm + '\uf8ff')
                        .orderBy('lastName')
                        .limit(10);
        
        const snapshotLastName = await queryRef.get();
        if (!snapshotLastName.empty) {
          snapshotLastName.forEach(doc => {
            employees.push(doc.data());
          });
          return res.status(200).json(employees);
        }

        // If no matches found for last name, try searching by employee ID
        queryRef = db.collection('employeeRegistrationData')
                        .where('employeeId', '==', searchTerm);

        const snapshotEmployeeId = await queryRef.get();
        if (!snapshotEmployeeId.empty) {
          snapshotEmployeeId.forEach(doc => {
            employees.push(doc.data());
          });
          return res.status(200).json(employees);
        }

        return res.status(404).json({ message: "No matching employees found." });
      }

      const employees = [];
      snapshot.forEach(doc => {
        employees.push(doc.data());
      });

      return res.status(200).json(employees);
    } catch (error) {
      console.error("Error searching employees:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
};
