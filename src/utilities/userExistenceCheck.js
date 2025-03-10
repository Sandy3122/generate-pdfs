const admin = require("firebase-admin");

// Function to check if a record exists with the provided email in the specified collection
async function checkExistingByEmail(email, collectionName) {
  const existingRecord = await admin
    .firestore()
    .collection(collectionName)
    .where("email", "==", email)
    .get();
  return !existingRecord.empty;
}

// Function to check if a record exists with the provided phone number in the specified collection
async function checkExistingByPhoneNumber(phoneNumber, collectionName) {
  const existingRecord = await admin
    .firestore()
    .collection(collectionName)
    .where("phoneNumber", "==", phoneNumber)
    .get();
  return !existingRecord.empty;
}

module.exports = {
  checkExistingByEmail: async function(email, userType) {
    let collectionName;
    switch (userType) {
      case "employee":
        collectionName = "employeeRegistrationData";
        break;
      case "admin":
        collectionName = "admins";
        break;
      case "user":
        collectionName = "appusers";
        break;
      default:
        throw new Error("Invalid userType specified");
    }
    return checkExistingByEmail(email, collectionName);
  },
  checkExistingByPhoneNumber: async function(phoneNumber, userType) {
    let collectionName;
    switch (userType) {
      case "employee":
        collectionName = "employeeRegistrationData";
        break;
      case "admin":
        collectionName = "admins";
        break;
      case "user":
        collectionName = "userRegistrationData";
        break;
      default:
        throw new Error("Invalid userType specified");
    }
    return checkExistingByPhoneNumber(phoneNumber, collectionName);
  }
};