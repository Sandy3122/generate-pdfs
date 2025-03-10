// Fetch dropdown data and populate dropdowns
async function fetchDropdownData() {
    try {
        const response = await fetch("/api/dropdowns", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching dropdown data:', error);
        return null;
    }
}



// // Populate dropdowns with the fetched data, with an optional gender parameter
// async function populateDropdowns(gender = null) {
//     console.log('gendergender: ', gender)
//     const dropdownData = await fetchDropdownData();
//     if (!dropdownData) return;

//     dropdownData.forEach(dropdown => {
//         const selectElements = document.querySelectorAll(`[data-dropdown="${dropdown.id}"]`);
//         if (selectElements.length > 0) {
//             selectElements.forEach(selectElement => {
//                 // Preserve the "Select" option and store its reference
//                 let firstOption = selectElement.querySelector('option[value=""]');
                
//                 // If no "Select" option is found, create one
//                 if (!firstOption) {
//                     firstOption = document.createElement('option');
//                     firstOption.value = "";
//                     firstOption.textContent = "Select"; // You can customize the text as needed
//                 }

//                 selectElement.innerHTML = ""; // Clear previous options
//                 selectElement.appendChild(firstOption); // Add the "Select" option first

//                 // Handle age dropdown differently based on the gender
//                 if (dropdown.id === 'age' && gender) {
//                     const minAge = gender === 'male' ? 18 : 21;
//                     // Filter and add age options based on gender-specific minimum age
//                     for (const [key, value] of Object.entries(dropdown.data)) {
//                         if (parseInt(key) >= minAge) {
//                             const option = document.createElement('option');
//                             option.value = key;
//                             option.textContent = value;
//                             selectElement.appendChild(option);
//                         }
//                     }
//                 } else {
//                     // Add new options from the dropdown data (non-age dropdowns)
//                     for (const [key, value] of Object.entries(dropdown.data)) {
//                         const option = document.createElement('option');
//                         option.value = key;
//                         option.textContent = value;
//                         selectElement.appendChild(option);
//                     }
//                 }

//                 // Initialize or refresh selectpicker if it's used on this dropdown
//                 if (selectElement.classList.contains('selectpicker')) {
//                      // Re-initialize the selectpicker and refresh for city dropdown
//                     if ($.fn.selectpicker) {
//                         $(selectElement).selectpicker(); // Re-initialize selectpicker
//                         $(selectElement).selectpicker('refresh'); // Refresh after populating
//                     } else {
//                         console.error("Selectpicker is not initialized");
//                     }
//                 }
//             });
//         }
//     });
// }

// Populate dropdowns with the fetched data, with an optional gender parameter
async function populateDropdowns(gender = null) {
    const dropdownData = await fetchDropdownData();
    if (!dropdownData) return;

    dropdownData.forEach(dropdown => {
        const selectElements = document.querySelectorAll(`[data-dropdown="${dropdown.id}"]`);
        if (selectElements.length > 0) {
            selectElements.forEach(selectElement => {
                // Preserve the "Select" option and store its reference
                let firstOption = selectElement.querySelector('option[value=""]');

                // If no "Select" option is found and the select element is not a selectpicker
                if (!firstOption && !selectElement.classList.contains('selectpicker')) {
                    firstOption = document.createElement('option');
                    firstOption.value = "";
                    firstOption.textContent = "Select"; // Customize the text as needed
                }

                selectElement.innerHTML = ""; // Clear previous options

                // Only append the "Select" option if it's not a selectpicker
                if (firstOption) {
                    selectElement.appendChild(firstOption); // Add the "Select" option first
                }

                // Handle age dropdown differently based on the gender
                if (dropdown.id === 'age' && gender) {
                    const minAge = gender === 'male' ? 18 : 21;
                    // Filter and add age options based on gender-specific minimum age
                    const sortedAges = Object.entries(dropdown.data)
                        .filter(([key]) => parseInt(key) >= minAge)
                        .sort((a, b) => parseInt(a[0]) - parseInt(b[0])); // Sort by key (age)

                    sortedAges.forEach(([key, value]) => {
                        const option = document.createElement('option');
                        option.value = key;
                        option.textContent = value;
                        selectElement.appendChild(option);
                    });
                } else {
                    // Sort and add new options from the dropdown data (non-age dropdowns)
                    const sortedOptions = Object.entries(dropdown.data)
                        .sort((a, b) => a[1].localeCompare(b[1])); // Sort by value (text)

                    sortedOptions.forEach(([key, value]) => {
                        const option = document.createElement('option');
                        option.value = key;
                        option.textContent = value;
                        selectElement.appendChild(option);
                    });
                }

                // Initialize or refresh selectpicker if it's used on this dropdown
                if (selectElement.classList.contains('selectpicker')) {
                    // Re-initialize the selectpicker and refresh for city dropdown
                    if ($.fn.selectpicker) {
                        $(selectElement).selectpicker(); // Re-initialize selectpicker
                        $(selectElement).selectpicker('refresh'); // Refresh after populating
                    } else {
                        console.error("Selectpicker is not initialized");
                    }
                }
            });
        }
    });
}
    