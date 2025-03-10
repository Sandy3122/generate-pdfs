const admin = require("firebase-admin");


// Function to generate a numeric-only ID from a UUID
function generateNumericId() {
  let numericId = '';
  for (let i = 0; i < 7; i++) {
    numericId += Math.floor(Math.random() * 10); // Generate a random digit (0-9) and append it to the ID
  }
  return numericId;
}

async function saveSupportFormData(phone, name, email, message) {
  const customId = 'w' + generateNumericId();
  const status = "pending";
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  try {
    await admin.firestore().collection("supportFormData").doc(customId).set({
      phone,
      name,
      email,
      message,
      timestamp,
      status,
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving support form data:", error);
    return { success: false, error };
  }
}

module.exports = {
  saveSupportFormData
};
