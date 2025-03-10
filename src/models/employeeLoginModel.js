const admin = require("firebase-admin");
const bcrypt = require('bcryptjs');

const employeesCollection = admin.firestore().collection('employeeRegistrationData');

async function getEmployeeByPhoneNumber(phoneNumber) {
    try {
        const querySnapshot = await employeesCollection.where('phoneNumber', '==', phoneNumber).limit(1).get();
        if (!querySnapshot.empty) {
            const employeeDoc = querySnapshot.docs[0];
            const employeeData = employeeDoc.data();
            return { id: employeeDoc.id, ...employeeData };
        }
        return null;
    } catch (error) {
        console.error('Error fetching employee by phone number:', error);
        throw new Error(  'An error occurred while fetching admin data. Please try again later.'); // Informative error message
    }
}

module.exports = {
    getEmployeeByPhoneNumber
};
