const admin = require('firebase-admin');

const db = admin.firestore();

module.exports = {
    updateData: async function(req, res, collectionName) {
        const { userId, updatedData } = req.body; // Assuming userId is sent along with the updated data
    
        try {
            // Fetch the original user data from the database
            // console.log("userId, updatedData: ", userId, updatedData, collectionName)
            const docRef = db.collection(collectionName).doc(userId);
            const doc = await docRef.get();
            const originalData = doc.data();
    
            // Initialize an object to hold the fields that need to be updated
            const fieldsToUpdate = {};
    
            // Update nested fields
            for (const key in updatedData) {
                // Check if the field exists in the original data and it's an object
                if (originalData.hasOwnProperty(key) && typeof originalData[key] === 'object') {
                    // Iterate through the nested fields
                    for (const nestedKey in updatedData[key]) {
                        // Update only if the nested field has changed and it's not empty
                        if (updatedData[key].hasOwnProperty(nestedKey) && updatedData[key][nestedKey] !== "" && updatedData[key][nestedKey] !== originalData[key][nestedKey]) {
                            if (!fieldsToUpdate[key]) {
                                fieldsToUpdate[key] = {};
                            }
                            fieldsToUpdate[key][nestedKey] = updatedData[key][nestedKey];
                        }
                    }
                } else {
                    // Update non-nested fields
                    if (updatedData.hasOwnProperty(key) && updatedData[key] !== "" && updatedData[key] !== originalData[key]) {
                        fieldsToUpdate[key] = updatedData[key];
                    }
                }
            }
    
            // Update only if there are fields to update
            if (Object.keys(fieldsToUpdate).length > 0) {
                await docRef.update(fieldsToUpdate);
                res.status(200).json({ message: "Profile updated successfully." });
            } else {
                res.status(200).json({ message: "No fields to update." });
            }
        } catch (error) {
            console.error("Error updating data:", error);
            res.status(500).json({ error: "Internal server error." });
        }
    },


        // updateData: async function(req, res, collectionName) {
        //     const { userId, updatedData } = req.body; // Assuming userId is sent along with the updated data
        
        //     try {
        //         // Fetch the original user data from the database
        //         const docRef = db.collection(collectionName).doc(userId);
        //         const doc = await docRef.get();
        //         const originalData = doc.data();
        
        //         // Initialize an object to hold the fields that need to be updated
        //         const fieldsToUpdate = {};
    
        //         // Update nested fields
        //         for (const key in updatedData) {
        //             // Check if the field exists in the original data and it's an object
        //             if (originalData.hasOwnProperty(key) && typeof originalData[key] === 'object') {
        //                 // Iterate through the nested fields
        //                 for (const nestedKey in updatedData[key]) {
        //                     // Update only if the nested field is provided and not empty
        //                     if (updatedData[key].hasOwnProperty(nestedKey) && updatedData[key][nestedKey] !== "") {
        //                         if (!fieldsToUpdate[key]) {
        //                             fieldsToUpdate[key] = {};
        //                         }
        //                         fieldsToUpdate[key][nestedKey] = updatedData[key][nestedKey];
        //                     }
        //                 }
        //             } else {
        //                 // Update non-nested fields only if the value is not empty
        //                 if (updatedData.hasOwnProperty(key) && updatedData[key] !== "") {
        //                     fieldsToUpdate[key] = updatedData[key];
        //                 }
        //             }
        //         }
        
        //         // Update only if there are fields to update
        //         if (Object.keys(fieldsToUpdate).length > 0) {
        //             await docRef.update(fieldsToUpdate);
        //             res.status(200).json({ message: "Profile updated successfully." });
        //         } else {
        //             res.status(200).json({ message: "No valid fields to update." });
        //         }
        //     } catch (error) {
        //         console.error("Error updating data:", error);
        //         res.status(500).json({ error: "Internal server error." });
        //     }
        // },
































    // updateData: async function(req, res, collectionName) {
    //     const { userId, updatedData } = req.body; // Assuming userId is sent along with the updated data
    
    //     try {
    //         // Fetch the original user data from the database
    //         const docRef = db.collection(collectionName).doc(userId);
    //         const doc = await docRef.get();
            
    //         if (!doc.exists) {
    //             return res.status(404).json({ message: "User not found." });
    //         }

    //         const originalData = doc.data();

    //         // Initialize an object to hold the fields that need to be updated
    //         const fieldsToUpdate = {};

    //         // Update nested fields
    //         for (const key in updatedData) {
    //             // Check if the field exists in the original data
    //             if (originalData.hasOwnProperty(key)) {
    //                 // Check if the field is an object (for nested fields)
    //                 if (typeof originalData[key] === 'object' && originalData[key] !== null) {
    //                     // Iterate through the nested fields
    //                     for (const nestedKey in updatedData[key]) {
    //                         // Update only if the nested field has changed and it's not empty
    //                         if (updatedData[key].hasOwnProperty(nestedKey) &&
    //                             updatedData[key][nestedKey] !== "" &&
    //                             updatedData[key][nestedKey] !== originalData[key][nestedKey]) {
                                
    //                             if (!fieldsToUpdate[key]) {
    //                                 fieldsToUpdate[key] = {};
    //                             }
    //                             fieldsToUpdate[key][nestedKey] = updatedData[key][nestedKey];
    //                         }
    //                     }
    //                 } else {
    //                     // Update non-nested fields
    //                     if (updatedData[key] !== "" && updatedData[key] !== originalData[key]) {
    //                         fieldsToUpdate[key] = updatedData[key];
    //                     }
    //                 }
    //             }
    //         }

    //         // Update only if there are fields to update
    //         if (Object.keys(fieldsToUpdate).length > 0) {
    //             await docRef.update(fieldsToUpdate);
    //             res.status(200).json({ message: "Profile updated successfully." });
    //         } else {
    //             res.status(200).json({ message: "No fields to update." });
    //         }
    //     } catch (error) {
    //         console.error("Error updating data:", error);
    //         res.status(500).json({ error: "Internal server error." });
    //     }
    // },


    
    updateImageStatus: async function(req, res, collectionName) {
        const { userId, imgIndex, updateFields } = req.body;
    
        try {
            const docRef = db.collection(collectionName).doc(userId);
            const doc = await docRef.get();
            const userData = doc.data();
    
            if (!userData || !userData.imgList) {
                res.status(404).json({ error: "User not found or missing image list." });
                return;
            }
    
            // Check if the provided imgIndex is within the bounds of the imgList array
            if (imgIndex < 0 || imgIndex >= userData.imgList.length) {
                res.status(404).json({ error: "Invalid image index." });
                return;
            }
    
            // Update the specified fields of the image
            for (const key in updateFields) {
                if (userData.imgList[imgIndex].hasOwnProperty(key)) {
                    userData.imgList[imgIndex][key] = updateFields[key];
                }
            }
            
            // const sessionData = await fetchSessionData();
            const timeStamp = new Date().toString();
            // console.log('cookies: ', sessionData)
            // Update imgVerificationBy field with cookies data     Ex: name/id/timestamp
            userData.imgList[imgIndex].imgVerificationBy = `${req.user.name}/${req.user.id}/${timeStamp}`;
    
            // Update the document in Firestore
            await docRef.update({ imgList: userData.imgList }); 
    
            res.status(200).json({ message: "Image status updated successfully." });
        } catch (error) {
            console.error("Error updating image status:", error);
            res.status(500).json({ error: "Internal server error." });
        }
    }    
};
