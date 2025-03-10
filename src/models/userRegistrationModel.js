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
  saveUserRegistrationData: async function (userId, userData) {
    try {
      // Replace undefined values with empty strings
      const sanitizedUserData = {};
      Object.keys(userData).forEach(key => {
        sanitizedUserData[key] = userData[key] !== undefined ? userData[key] : '';
      });

      // Save user registration data to Firestore
      await db.collection('appusers').doc(userId).set(sanitizedUserData);

      return true;
    } catch (error) {
      console.error('Error saving user registration data:', error);
      throw error;
    }
  },

  updateUserRouteAccess: async function (userId, routes) {
    try {
      await db.collection('appusers').doc(userId).update({ routes: routes });
      return true;
    } catch (error) {
      console.error('Error updating user route access:', error);
      throw error;
    }
  },

  getAllUsers: async function () {
    try {
      const snapshot = await db.collection('appusers').get();
      const users = [];
      snapshot.forEach(doc => {
        users.push(doc.data());
      });
      return users;
    } catch (error) {
      console.error('Error retrieving all users:', error);
      throw error;
    }
  }
};
