// admin registration model
const admin = require('firebase-admin');

async function saveAdminData(adminId, adminData) {
  try {
    const adminRef = await admin.firestore().collection('admins').doc(adminId).set(adminData);
    return adminRef.id;
  } catch (error) {
    console.error('Error saving admin data:', error);
    throw new Error('Error saving admin data');
  }
}

module.exports = {
  saveAdminData
};