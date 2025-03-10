// Handle registration form submission
// function checkInput(inputField) {
//     if (inputField.value !== '') {
//         inputField.previousElementSibling.classList.add('active');
//     } else {
//         inputField.previousElementSibling.classList.remove('active');
//     }
// }

document.getElementById("employeeRegistrationForm").addEventListener("submit", function (event) {
    event.preventDefault();

    Swal.fire({
        title: 'Please wait...',
        html: 'Sending data to server',
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        }
    });

    const formData = new FormData(this);

    fetch("/api/employee-registration", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Close the loading animation
        Swal.close();
        // Check if the response indicates success
        if (data.message === "Data sent successfully.") {
            // Display success message using SweetAlert
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Form submitted successfully.",
                confirmButtonColor: "#3dc944",
            }).then(() => {
                // Clear form fields or redirect to another page
                // document.getElementById("employeeRegistrationForm").reset();
                // Redirect or perform any other action after successful registration
                window.location.href = "/login";
            });
        } else {
            // Display error message using SweetAlert
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: data.message,
                confirmButtonColor: "#d33",
            });
        }
    })
    .catch(error => {
        // Close the loading animation
        Swal.close();
        // Display error message using SweetAlert
        console.error("Error submitting form:", error);
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: data.message,
            confirmButtonColor: "#d33",
        });
    });
});
