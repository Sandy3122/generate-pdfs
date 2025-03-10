const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');

const db = admin.firestore();

module.exports = {
    resetPassword: async function(req, res, collectionName) {
        const { id, newPassword } = req.body; // Extract id and newPassword from req.body

        try {
            // Check if id and newPassword are provided
            if (!id || !newPassword) {
                return res.status(400).json({ error: "ID and new password are required." });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password in the specified Firestore collection
            await db.collection(collectionName).doc(id).update({ pin: hashedPassword });

            res.status(200).json({ message: "Password reset successfully." });
        } catch (error) {
            console.error("Error resetting password:", error);
            res.status(500).json({ error: "Internal server error." });
        }
    }
};
