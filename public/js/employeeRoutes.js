// employeeRoutes.js

let employeeRoutes = [];

async function fetchDropdownData() {
  try {
        showLoader();
        const response = await fetch('/api/dropdowns');
        const data = await response.json();
        hideLoader();
        return data;
    } catch (error) {
        console.error('Error fetching dropdown data:', error);
        return null;
    }
}

async function populateDropdowns() {
    const dropdownData = await fetchDropdownData();
    if (dropdownData) {
        const routes = dropdownData.find(item => item.id === 'routes')?.data?.allRoutes || [];
        employeeRoutes.push(...routes);
        // console.log('Routes: ', employeeRoutes);
    }
}

populateDropdowns();

// module.exports = employeeRoutes;
