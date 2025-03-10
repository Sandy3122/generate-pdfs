// employeeRegistrationModel.js
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

// Initialize Firebase app if it's not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "matchingjodiweb.appspot.com",
  });
}

const db = admin.firestore();

module.exports = {
  saveEmployeeRegistrationData: async function (employeeId, employeeData) {
    try {
      await db.collection('employeeRegistrationData').doc(employeeId).set(employeeData);
      return true;
    } catch (error) {
      console.error('Error saving employee registration data:', error);
      throw error;
    }
  },

  updateEmployeeRouteAccess: async function (employeeId, routes) {
    try {
      await db.collection('employeeRegistrationData').doc(employeeId).update({ routes: routes });
      return true;
    } catch (error) {
      console.error('Error updating employee route access:', error);
      throw error;
    }
  }
};
