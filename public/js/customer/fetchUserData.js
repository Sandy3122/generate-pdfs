// userProfile.js

// Function to change input value by element ID
function changeInputValue(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element) {
        element.value = newValue;
    }
}

// Function to set inner HTML content of an element by ID
function setInnerHTMLById(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = newValue;
    }
}

function setHrefById(id, url) {
    const element = document.getElementById(id);
    if (url) {
        element.href = url;
        element.removeAttribute('disabled');
        element.style.pointerEvents = 'auto';
    } else {
        element.href = '#';
        element.setAttribute('disabled', 'disabled');
        element.style.pointerEvents = 'none';
        element.style.color = 'gray';
    }
}


function setInnerHTMLByIdWithColor(elementId, value) {
    const element = document.getElementById(elementId);
    let color;
        
    // Set the color based on the status value
    switch (value.toLowerCase()) {
        case 'verified':
            color = 'green';
            break;
        case 'rejected':
            color = 'red';
            break;
        case 'pending':
            color = 'orange';
            break;
        default:
            color = 'black';
            break;
    }
    // Set the inner HTML and color
    element.innerHTML = value || 'pending';
    element.style.color = color;
}


// Function to set the href attribute of an element by ID
function setSrcById(elementId, newSrc) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('src', newSrc);
    }
}

// Function to set selected option for select element by ID
function setSelectedOption(selectId, selectedValue) {
    const selectElement = document.getElementById(selectId);
    if (selectElement) {
        const options = selectElement.options;

        // Check if the option for "null" already exists
        let nullOptionExists = false;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === 'null') {
                nullOptionExists = true;
                break;
            }
        }

        // If the option for "null" doesn't exist, add it
        if (!nullOptionExists) {
            const nullOption = document.createElement('option');
            nullOption.value = 'null';
            nullOption.textContent = 'Select';
            nullOption.hidden = true; // Hide the option
            selectElement.appendChild(nullOption);
        }

        // Set selected option
        let found = false;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value.toLowerCase() === selectedValue.toLowerCase()) {
                options[i].selected = true;
                found = true;
                break;
            }
        }

        // If the selected value is not found, select the "null" option
        if (!found) {
            selectElement.value = 'null';
        }
    }
}


// Function to set readonly attribute based on user role for specified input IDs and disable everything on the page
async function setReadOnlyBasedOnRole(role) {

    // Fetch access roles
    const allowedRoles = await fetchAccessRoles();
    
    const disabled = !allowedRoles.includes(role);

    let hasSelectpicker = false;

    // Handle all select elements
    document.querySelectorAll('select').forEach(function(select) {
        if (select.classList.contains('selectpicker')) {
            // If there is a selectpicker, keep everything enabled
            $(select).prop('disabled', false).selectpicker('refresh');
            select.style.cursor = 'auto';
            hasSelectpicker = true;
        } else {
            // Disable other select elements if no selectpicker is found
            select.disabled = disabled;
            select.style.cursor = disabled ? 'not-allowed' : 'auto';
        }
    });

    if (!hasSelectpicker) {
        // If there is no selectpicker, disable inputs, textareas, and buttons

        // Disable all input elements (text, password, etc.)
        const inputElements = document.querySelectorAll('input');
        inputElements.forEach(function(input) {
            input.disabled = disabled;
            input.style.cursor = disabled ? 'not-allowed' : 'auto';
        });

        // Disable all textarea elements
        const textareaElements = document.querySelectorAll('textarea');
        textareaElements.forEach(function(textarea) {
            textarea.disabled = disabled;
            textarea.style.cursor = disabled ? 'not-allowed' : 'auto';
        });

        // Hide the "Save Changes" button if disabled
        const saveButton = document.getElementById('saveChanges');
        if (saveButton) {
            saveButton.style.display = disabled ? 'none' : 'inline-block';
        }
    } else {
        // If selectpicker is found, enable all inputs and buttons

        // Enable all input elements (text, password, etc.)
        const inputElements = document.querySelectorAll('input');
        inputElements.forEach(function(input) {
            input.disabled = false;
            input.style.cursor = 'auto';
        });

        // Enable all textarea elements
        const textareaElements = document.querySelectorAll('textarea');
        textareaElements.forEach(function(textarea) {
            textarea.disabled = false;
            textarea.style.cursor = 'auto';
        });

    }

    // Show the "Save Changes" button
    const saveButton = document.getElementById('saveChanges');
    if (saveButton) {
        saveButton.style.display = disabled ? 'none' : 'inline-block';  // Show the button
    }

    // Disable all anchor (a) elements if no selectpicker
    const anchorElements = document.querySelectorAll('a[href]');
    anchorElements.forEach(function(anchor) {
        if (disabled && !hasSelectpicker) {
            anchor.setAttribute('tabindex', '-1');
            anchor.style.pointerEvents = 'none';
            anchor.style.cursor = 'not-allowed';
        } else {
            anchor.removeAttribute('tabindex');
            anchor.style.pointerEvents = 'auto';
            anchor.style.cursor = 'pointer';
        }
    });
}



// // Make an HTTP GET request to fetch user data
// function fetchUserData(userId) {
//     showLoader();
    
//     const token = localStorage.getItem('token');
    
//     // Check if token is available
//     if (!token) {
//         console.error('No token found in localStorage');
//         hideLoader();
//         return;
//     }

//     // Fetch user data
//     fetch(`/api/getUserById/${userId}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
        
//         // Check if data contains user data
//         if (data && data.data) {
//             const userData = data.data;
//             const userRole = localStorage.getItem('role');
            
//             // console.log("User Data:", userData);
            
//             populateUserData(userData);
//             setReadOnlyBasedOnRole(userRole);
//             return userData
//         } else {
//             console.error('No user data found in response:', data);
//         }
//     })
//     .catch(error => {
//         console.error('There was a problem with the fetch operation:', error);
//     })
//     .finally(() => {
//         hideLoader();
//     });
// }

// Make an HTTP GET request to fetch user data
async function fetchUserData(userId) {
    showLoader();
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage');
            hideLoader();
            throw new Error('No token found');
        }

        const response = await fetch(`/api/getUserById/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data && data.data) {
            const userData = data.data;
            const userRole = localStorage.getItem('role');

            // Minimize operations on the fetched data
            populateUserData(userData);
            setReadOnlyBasedOnRole(userRole);
            return userData;
        } else {
            console.error('No user data found in response:', data);
            throw new Error('No user data found');
        }

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
        
    } finally {
        hideLoader();
    }
}


// // Make an HTTP GET request to fetch user data
// function fetchUserData(userId) {
//     showLoader()
//     return new Promise((resolve, reject) => {
//         const token = localStorage.getItem('token');
        
//         // Check if token is available
//         if (!token) {
//             console.error('No token found in localStorage');
//             hideLoader();
//             reject('No token found');
//             return;
//         }

//         // Fetch user data
//         fetch(`/api/getUserById/${userId}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data && data.data) {
//                 const userData = data.data;
//                 const userRole = localStorage.getItem('role');
                
//                 populateUserData(userData);
//                 setReadOnlyBasedOnRole(userRole);
//                 resolve(userData);
//             } else {
//                 console.error('No user data found in response:', data);
//                 reject('No user data found');
//             }
//         })
//         .catch(error => {
//             console.error('There was a problem with the fetch operation:', error);
//             reject(error);
//         })
//         .finally(() => {
//             hideLoader();
//         });
//     });
// }


async function fetchAllUserData() {
    showLoader();
    try {
        const token = localStorage.getItem('token');
        const response = await fetch("/api/getall-appUsers", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching user data:", error);
        // Display error message using SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error fetching user data. Please try again later.',
        });
        throw new Error("Error fetching user data. Please try again later.");
    } finally {
        hideLoader();
    }
}

// Function to fetch image list data
async function fetchImageList() {
    showLoader();
    try {
        const token = localStorage.getItem('token');
        const response = await fetch("/api/getImageList", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error("Error fetching data:", error);
        // Display error message using SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error fetching imageList data. Please try again later.',
        });
        throw new Error("Error fetching imageList data. Please try again later.");
    } finally {
        hideLoader();
    }
}


// Function to fetch specific user data
async function fetchImageListById(userId) {
    showLoader();
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/getImageList/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error("Error fetching data:", error);
        // Display error message using SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error fetching imageList data. Please try again later.',
        });
        throw new Error("Error fetching imageList data. Please try again later.");
    } finally {
        hideLoader();
    }
}

// Function to fetch sessionData data
async function fetchSessionData() {
    showLoader();
    try {
        const token = localStorage.getItem('token');
        // console.log('token: ', token)
        const response = await fetch("/api/getUserDataFromSessions", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        
        return userData;
    } catch (error) {
        console.error("Error fetching data:", error);
        // Display error message using SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Your session has timed out. Please login again.',
        });
        throw new Error("Your session has timed out. Please login again.");
    } finally {
        hideLoader();
    }
}



async function fetchAccessRights() {
    try {
        const response = await fetch('/api/access-rights');
        if (!response.ok) {
            throw new Error('Failed to fetch access rights');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching access rights:', error);
        throw error;
    }
}


async function fetchAccessRoles() {
    showLoader();
    try {
        const response = await fetch('/api/dropdown/accessRoles');
        if (!response.ok) {
            throw new Error('Failed to fetch access roles');
        }

        const data = await response.json();

        // Extract and return only the keys as an array, excluding 'selectRole' if needed
        const rolesArray = Object.keys(data.data).filter(key => key !== 'selectRole');

        return rolesArray;
    } catch (error) {
        console.error('Error fetching access roles:', error);
        throw error;
    }finally {
        hideLoader();
    }
}



// Function to run both async operations in order
async function populateDropDownsAndFetchUserData(userId) {
    try {
        showLoader();
        // First populate dropdowns
        await populateDropdowns();
        // Once dropdowns are populated, fetch the user data
        await fetchUserData(userId);
        hideLoader();
    } catch (error) {
        console.error('Error while fetching the data:', error);
    }
}