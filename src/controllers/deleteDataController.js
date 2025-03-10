const admin = require('firebase-admin');

const db = admin.firestore();

module.exports = {
    deleteProfileById: async function(req, res){
        try {
            // Extract documentId from request parameters
            const documentId = req.params.documentId;

            // Reference to Firestore collections
            const appUsersCollection = db.collection('appusers');
            const deletedProfilesCollection = db.collection('deletedprofiles');

            // Retrieve profile data before deleting
            const profileDoc = await appUsersCollection.doc(documentId).get();
            if (!profileDoc.exists) {
                return res.status(404).json({ success: false, message: 'Profile not found' });
            }
            
            // Move profile data to deletedProfiles collection
            const profileData = profileDoc.data();
            const deletionTimestamp = new Date().toString(); // Convert to string for your desired format
            const deletedProfileBy = `${req.user?.role}/${req.user?.id}/${deletionTimestamp}`;
            await deletedProfilesCollection.doc(documentId).set({
                ...profileData,
                deletedProfileBy: deletedProfileBy,
            });
            
            // Delete profile from appUsers collection
            await appUsersCollection.doc(documentId).delete();
            
            return res.status(200).json({ success: true, message: 'Profile deleted successfully' });
        } catch (error) {
            console.error("Error deleting profile:", error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
};
