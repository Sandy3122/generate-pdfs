const admin = require('firebase-admin');
const db = admin.firestore();

const copyStateDataToIndia = async () => {
  try {
    // Reference to the 'state' collection
    const stateDocRef = db.collection('dropdown').doc('country').collection('state');

    // Reference to the new 'India' collection
    const indiaDocRef = db.collection('dropdown').doc('country').collection('India');

    // Get all documents in the 'state' collection
    const stateDocs = await stateDocRef.get();

    if (stateDocs.empty) {
      console.log('No state data found.');
      return;
    }

    // Loop through each state and copy the data to 'India' collection
    const batch = db.batch();
    stateDocs.forEach((doc) => {
      const data = doc.data();
      // Add the same document to 'India' collection
      const indiaDoc = indiaDocRef.doc(doc.id);
      batch.set(indiaDoc, data);
    });

    // Commit the batch operation
    await batch.commit();
    console.log('State data successfully copied to India collection.');

  } catch (error) {
    console.error('Error copying state data to India collection:', error);
  }
};

// Call the function to copy the data
copyStateDataToIndia();
