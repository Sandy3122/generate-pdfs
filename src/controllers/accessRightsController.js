const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = {
    getAllAccessRights: async function(req, res) {
        try {
            const snapshot = await db.collection('accessRights').get();
            const accessRights = [];
            snapshot.forEach(doc => {
                accessRights.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            res.status(200).json(accessRights);
        } catch (error) {
            console.error("Error fetching access rights:", error);
            res.status(500).json({ error: "Internal server error." });
        }
    },

    updateAccessRightStatus: async function(req, res) {
        const accessRightId = req.params.accessRightId;
        const { status } = req.body;

        try {
            const accessRightRef = db.collection('accessRights').doc(accessRightId);
            await accessRightRef.update({ status });
            res.status(200).json({ message: `Access right status updated successfully` });
        } catch (error) {
            console.error('Error updating access right status:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // updateAccessRightRoutes: async function(req, res) {
    //     const accessRightId = req.params.accessRightId;
    //     let { routeName } = req.body;
    
    //     try {
    //         // Reference to the document in the database
    //         const accessRightRef = db.collection('accessRights').doc(accessRightId);
    
    //         // Fetch the existing routes from the database
    //         const accessRightDoc = await accessRightRef.get();
    
    //         if (!accessRightDoc.exists) {
    //             return res.status(404).json({ error: 'Access right not found' });
    //         }
    
    //         const existingRoutes = accessRightDoc.data().routeName || [];
    
    //         // Combine existing routes with the new ones
    //         const combinedRoutes = [...existingRoutes, ...routeName];
    
    //         // Remove duplicate routes
    //         const uniqueRoutes = [...new Set(combinedRoutes)];  // Use Set to remove duplicates
    
    //         // Update the document with unique routes
    //         await accessRightRef.update({ routeName: uniqueRoutes });
    
    //         // Send a success response with the updated routes
    //         res.status(200).json({ message: `Access right routes updated successfully`, updatedRoutes: uniqueRoutes });
    //     } catch (error) {
    //         console.error('Error updating access right routes:', error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // },
    

    updateAccessRightRoutes: async function(req, res) {
        const accessRightId = req.params.accessRightId;
        let { routeName } = req.body;
    
        try {
            // Remove duplicate routes
            const uniqueRoutes = [...new Set(routeName)];  // Use a Set to remove duplicates
    
            // Reference to the document in the database
            const accessRightRef = db.collection('accessRights').doc(accessRightId);
    
            // Update the document with unique routes
            await accessRightRef.update({ routeName: uniqueRoutes });
    
            // Send a success response
            res.status(200).json({ message: `Access right routes updated successfully`, updatedRoutes: uniqueRoutes });
        } catch (error) {
            console.error('Error updating access right routes:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },


    addRoleRights: async function(req, res) {
        const { role, status } = req.body;
        const routeName = []; // Empty array for routeName
    
        try {
            // Check if the role already exists in the collection
            const existingRoleQuerySnapshot = await db.collection('accessRights')
                .where('role', '==', role)
                .get();
    
            if (!existingRoleQuerySnapshot.empty) {
                // Role already exists, return a conflict response
                return res.status(409).json({ error: `Role '${role}' already exists.` });
            }
    
            // Add the role rights data to the Firestore collection
            const docRef = await db.collection('accessRights').add({
                role,
                routeName,
                status,
                timeStamp: new Date().toString(),
            });
    
            // Return success response with the new document ID
            res.status(201).json({ message: 'Role rights added successfully', id: docRef.id });
        } catch (error) {
            console.error('Error adding role rights:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    

    deleteAccessRight: async function(req, res) {
        const accessRightId = req.params.accessRightId;
    
        try {
            // Delete the access right from the Firestore collection
            await db.collection('accessRights').doc(accessRightId).delete();
    
            res.status(200).json({ message: 'Access right deleted successfully' });
        } catch (error) {
            console.error('Error deleting access right:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    
};
