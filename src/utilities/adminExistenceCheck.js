const admin = require("firebase-admin");

async function checkExistingAdminByEmail(email) {
  const existingAdmin = await admin
    .firestore()
    .collection("admins")
    .where("email", "==", email)
    .get();

  return !existingAdmin.empty;
}

async function checkExistingAdminByPhoneNumber(phoneNumber) {
  const existingAdmin = await admin
    .firestore()
    .collection("admins")
    .where("phoneNumber", "==", phoneNumber)
    .get();

  return !existingAdmin.empty;
}

module.exports = {
  checkExistingAdminByEmail,
  checkExistingAdminByPhoneNumber
};
