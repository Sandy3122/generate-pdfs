// Function to handle updating user data
function updateUserData(userId, updatedData) {
    // showLoader()
    fetch('/api/updateUserData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userId,
            updatedData: updatedData
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Update successful:', data);
        // Use SweetAlert to show success message
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Data updated successfully.'
        });
    })
    .catch((error) => {
        console.error('Error updating data:', error);
        // Use SweetAlert to show error message
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error updating data. Please try again.'
        });
    })
    .finally(() => {
        // hideLoader()
    });
}

// Function to update image status
async function updateImageStatus(userId, imgIndex, updateFields) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/updateImageStatus', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: userId,
                imgIndex: imgIndex,
                updateFields: updateFields
            })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update image status. Please try again later.');
        }
        return data.message;
    } catch (error) {
        console.error('Error updating image status:', error);
        throw new Error('Failed to update image status. Please try again later.');
    }
}

