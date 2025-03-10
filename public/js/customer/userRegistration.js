document
  .getElementById("userRegistrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Display loading animation using SweetAlert
    Swal.fire({
        title: 'Please wait...',
        html: 'Sending data to server',
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        }
    });

    const formData = new FormData(this);

    // Send a POST request to the server
    fetch("/api/user-registration", {
      method: "POST",
      body: formData, // Send form data as the request body
    })
      .then((response) => response.json())
      .then((data) => {
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
            window.location.href = "/";
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
      .catch((error) => {
        // Close the loading animation
        Swal.close();
        // Display error message using SweetAlert
        console.error("Error submitting form:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong. Please try again later.",
          confirmButtonColor: "#d33",
        });
      });
  });
