const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");

const db = admin.firestore();

// // Route to fetch filtered, paginated, and sorted data for DataTables
// router.post('/getUsers', async (req, res) => {
//     try {
//       const { start = 0, length = 10, order = [], columns = [], search = {} } = req.body;
  
//       // Validate the required structure
//       const orderColumnIndex = order[0]?.column ?? 0; // Default to first column
//       const orderDir = order[0]?.dir ?? 'asc'; // Default to ascending order
//       const orderColumn = columns[orderColumnIndex]?.data ?? 'defaultField'; // Provide a fallback field
//       const searchValue = search.value?.toLowerCase() || '';
  
//       // Fetch data from Firestore
//       let query = db.collection('appusers');
  
//       // Apply search filter
//       if (searchValue) {
//         query = query
//           .where('searchableField', '>=', searchValue)
//           .where('searchableField', '<=', searchValue + '\uf8ff');
//       }
  
//       // Get total records count without filters
//       const totalRecords = (await db.collection('appusers').get()).size;
  
//       // Apply ordering
//       if (orderColumn) {
//         query = query.orderBy(orderColumn, orderDir);
//       }
  
//       // Apply pagination
//       const dataSnapshot = await query.offset(Number(start)).limit(Number(length)).get();
  
//       // Map the data to the required format
//       const data = [];
//       dataSnapshot.forEach((doc) => {
//         data.push({ id: doc.id, ...doc.data() });
//       });
  
//       res.json({
//         draw: req.body.draw || 1, // Echo the draw parameter to maintain DataTables state
//         recordsTotal: totalRecords,
//         recordsFiltered: dataSnapshot.size,
//         data: data,
//       });
//     } catch (error) {
//       console.error('Error fetching data for DataTables:', error);
//       res.status(500).json({ error: 'Error fetching data' });
//     }
//   });

router.post('/getUsers', async (req, res) => {
    try {
      const { start = 0, length = 10, order = [], columns = [], search = {} } = req.body;
  
      // Extract search and order details
      const orderColumnIndex = order[0]?.column ?? 0; // Default to first column
      const orderDir = order[0]?.dir === 'desc' ? 'desc' : 'asc'; // Ensure valid direction
      const orderColumn = columns[orderColumnIndex]?.data ?? null;
      const searchValue = search.value?.toLowerCase() || '';
  
      // Prepare query
      let query = db.collection('appusers');
  
      console.log('Raw Query:', { searchValue, orderColumn, orderDir, start, length });

      // Apply search filter if provided (Example: Case-insensitive filtering on "firstName")
      if (searchValue) {
        query = query.where('firstName', '>=', searchValue).where('firstName', '<=', searchValue + '\uf8ff');
      }

      console.log('Final Query:', query);

  
      // Total count without filters
      const totalRecords = (await db.collection('appusers').get()).size;
    //   const totalRecordsData = (await db.collection('appusers').get());
    //   console.log('totalRecordsData: ',totalRecordsData);

      // Apply ordering (Firestore requires indexed fields for ordering)
      if (orderColumn) {
        query = query.orderBy(orderColumn, orderDir);
      }
  
      // Apply pagination
      const dataSnapshot = await query.offset(Number(start)).limit(Number(length)).get();
  
      // Fetch the filtered count (if needed for DataTables)
      const filteredRecords = searchValue ? dataSnapshot.size : totalRecords;
  
      // Format data
      const data = [];
      dataSnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
  
      // Response to DataTables
      res.json({
        draw: req.body.draw || 1,
        recordsTotal: totalRecords,
        recordsFiltered: filteredRecords,
        data,
      });
    } catch (error) {
      console.error('Error fetching data for DataTables:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  });
  

module.exports = router;
