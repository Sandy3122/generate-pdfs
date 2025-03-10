const admin = require('firebase-admin');
const db = admin.firestore();

const getAllNestedData = async (docRef) => {
  try {
    // Fetch the main document data
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
      throw new Error('Document does not exist.');
    }
    // const mainDocData = docSnapshot.data();

    // Fetch all subcollections of the provided document reference
    const subcollections = await docRef.listCollections();
    const subcollectionsData = {};

    for (const subcollection of subcollections) {
      const subcollectionSnapshot = await subcollection.get();
      const subcollectionDocs = {};

      subcollectionSnapshot.forEach(subDoc => {
        subcollectionDocs[subDoc.id] = subDoc.data();
      });

      subcollectionsData[subcollection.id] = subcollectionDocs;
    }

    // Include the main document data with its subcollections
    return { ...subcollectionsData };
  } catch (error) {
    console.error('Error retrieving nested data:', error);
    throw new Error('Internal server error.');
  }
};


module.exports = {
  getAllNestedData: async (req, res, collectionName) => {
    try {
      const countryDocRef = db.collection('dropdown').doc('country');
      const nestedData = await getAllNestedData(countryDocRef);
  
      if (nestedData.length === 0) {
        return res.status(404).json({ error: `No nested records found in ${collectionName}.` });
      }

      return res.status(200).json(nestedData);
    } catch (error) {
      console.error(`Error retrieving nested data from ${collectionName}:`, error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  },


  // Get all the from collection
  getAllData: async function(req, res, collectionName) {
    try {
      // Retrieve all records from the specified collection
      const snapshot = await db.collection(collectionName).get();

      if (snapshot.empty) {
        return res.status(404).json({ error: `No records found in ${collectionName}.` });
      }

      const records = [];
      snapshot.forEach(doc => {
        records.push({ id: doc.id, data: doc.data() });
      });

      return res.status(200).json(records);
    } catch (error) {
      console.error(`Error retrieving data from ${collectionName}:`, error);
      res.status(500).json({ error: "Internal server error." });
    }
  },

  // // Get data from collection by documentId
  // getDocumentData: async function(req, res) {
  //   try {
  //       const collectionName = req.params.collectionName
  //       const documentId = req.params.documentId; // Retrieve documentId from the request parameters

  //       // Retrieve the document by its ID from the specified collection
  //       const docRef = db.collection(collectionName).doc(documentId);
  //       const doc = await docRef.get();

  //       if (!doc.exists) {
  //           return res.status(404).json({ error: `No record found with ID ${documentId} in ${collectionName}.` });
  //       }

  //       // Return the document data along with its ID
  //       return res.status(200).json({ id: doc.id, data: doc.data() });
  //   } catch (error) {
  //       console.error(`Error retrieving document from ${collectionName}:`, error);
  //       res.status(500).json({ error: "Internal server error." });
  //   }
  // },

  // Get data from collection by documentId
  getDocumentData: async function(req, res, fieldNames=null) {
    try {
        const originalUrl = req.originalUrl;

        const collectionName = req.params.collectionName || originalUrl.split('/')[2];
        const documentId = req.params.documentId || originalUrl.split('/')[3];

        if (!fieldNames) {
          fieldNames = req.query.fields ? req.query.fields.split(',') : null;
        }

        // Retrieve the document by its ID from the specified collection
        const docRef = db.collection(collectionName).doc(documentId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: `No records found with ID ${documentId} in ${collectionName}.` });
        }

        let docData = doc.data();

        // If field names are provided, filter the document data
        if (fieldNames) {
            docData = fieldNames.reduce((filteredData, field) => {
                if (docData[field] !== undefined) {
                    filteredData[field] = docData[field];
                }
                return filteredData;
            }, {});
        }

        // Return the document data along with its ID
        return res.status(200).json({ id: doc.id, data: docData });
    } catch (error) {
        console.error(`Error retrieving document from ${collectionName}:`, error);
        res.status(500).json({ error: "Internal server error." });
    }
  },

  getDataById: async function(req, res, collectionName) {
    try {
      documentId = req.params.documentId
      const docRef = db.collection(collectionName).doc(documentId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: `Document ${documentId} not found in ${collectionName}.` });
      }

      return res.status(200).json({ id: doc.id, data: doc.data() });
    } catch (error) {
      console.error(`Error retrieving document ${documentId} from ${collectionName}:`, error);
      res.status(500).json({ error: "Internal server error." });
    }
  },


  fetchAllDataByFieldNames: async function(req, res, collectionName, fieldNames) {
    try {
        // Retrieve all records from the specified collection
        const snapshot = await db.collection(collectionName).get();

        if (snapshot.empty) {
            return res.status(404).json({ error: `No records found in ${collectionName}.` });
        }

        const imageData = [];
        snapshot.forEach(doc => {
            const id = doc.id;
            const data = doc.data();
            const entry = { id }; // Include ID in the data
            fieldNames.forEach(fieldName => {
                if (data[fieldName]) {
                    entry[fieldName] = data[fieldName];
                }
            });
            imageData.push(entry);
        });

        return res.status(200).json(imageData);
    } catch (error) {
        console.error(`Error retrieving data from ${collectionName}:`, error);
        res.status(500).json({ error: "Internal server error." });
    }
},


getDataByIdWithFieldNames: async function(req, res, collectionName, fieldNames) {
  try {
      // Retrieve the document with the specified ID from the collection
      const documentId = req.params.documentId;
      const docRef = db.collection(collectionName).doc(documentId);
      const doc = await docRef.get();

      if (!doc.exists) {
          return res.status(404).json({ error: `No records found with ID ${documentId} in ${collectionName}.` });
      }

      const data = doc.data();
      const retrievedData = {id: doc.id};

      fieldNames.forEach(fieldName => {
        if (data[fieldName] !== undefined) {
          retrievedData[fieldName] = data[fieldName];
        }
      });
      

      return res.status(200).json(retrievedData);
  } catch (error) {
      console.error(`Error retrieving data with ID ${documentId} from ${collectionName}:`, error);
      res.status(500).json({ error: "Internal server error." });
  }
},

  getDataWithOptionalFields: async function(req, res, collectionName, fieldNames = null) {
    try {
      const documentId = req.params.documentId;
      // Use provided fieldNames if available, otherwise check query parameters
      fieldNames = fieldNames || (req.query.fields ? req.query.fields.split(',') : null);

      // If documentId is provided, fetch single document
      if (documentId) {
        const docRef = db.collection(collectionName).doc(documentId);
        const doc = await docRef.get();

        if (!doc.exists) {
          return res.status(404).json({ 
            error: `No record found with ID ${documentId} in ${collectionName}.` 
          });
        }

        const data = doc.data();
        let filteredData = data;

        // Filter fields if fieldNames are provided
        if (fieldNames) {
          filteredData = fieldNames.reduce((filtered, field) => {
            if (data[field] !== undefined) {
              filtered[field] = data[field];
            }
            return filtered;
          }, {});
        }

        return res.status(200).json({ id: doc.id, ...filteredData });
      }

      // If no documentId, fetch all documents
      const snapshot = await db.collection(collectionName).get();

      if (snapshot.empty) {
        return res.status(404).json({ 
          error: `No records found in ${collectionName}.` 
        });
      }

      const records = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        let filteredData = data;

        // Filter fields if fieldNames are provided
        if (fieldNames) {
          filteredData = fieldNames.reduce((filtered, field) => {
            if (data[field] !== undefined) {
              filtered[field] = data[field];
            }
            return filtered;
          }, {});
        }

        records.push({ id: doc.id, ...filteredData });
      });

      return res.status(200).json(records);
    } catch (error) {
      console.error(`Error retrieving data from ${collectionName}:`, error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
};
