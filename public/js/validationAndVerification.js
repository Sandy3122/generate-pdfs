// Handling all the tags and values
const phoneField = document.getElementById("phone");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const messageField = document.getElementById("message");
const verifyLink = document.getElementById("verify-link");
const submitButton = document.getElementById("submitButton");

let otpSent = false; // Keep track if OTP is already sent

// Function to handle OTP verification success
const handleSuccess = (data) => {
  console.log("success response", data);
  verifyLink.innerText = "Verified";
  verifyLink.style.color = "#3dc944";
  enableFormFields();
  otpSent = false; // Reset OTP status
};

// Handle failure response
const handleFailure = (error) => {
  console.log("failure reason", error);
  alert("Verification failed. Please try again.");
  otpSent = false; // Reset OTP status

  // Enable the verify link again in case of failure
  verifyLink.disabled = false;
  verifyLink.style.pointerEvents = "auto"; // Allow clicks again
};

// Msg91 Configuration
let configuration;

// Fetching environment variables from the server
fetch("/support/env")
  .then((response) => response.json())
  .then((env) => {
    // console.log(env.WIDGET_ID);
    // console.log(env.TOKEN_AUTH);
    // Update the configuration with fetched environment variables
    configuration = {
      widgetId: env.WIDGET_ID,
      tokenAuth: env.TOKEN_AUTH,
      identifier: "phone",
      exposeMethods: "<true | false> (optional)",
      success: handleSuccess,
      failure: handleFailure,
      OTP: "<OTP>",
    };
  })
  .catch((error) =>
    console.error("Error fetching environment variables:", error)
  );

  function showMsg91Window() {  
    var phone = phoneField.value.trim();
  
    if (phone !== "" && !otpSent) {
      // Disable the verify link to prevent multiple clicks
      phoneField.disabled = true;
      verifyLink.disabled = true;
      verifyLink.style.pointerEvents = "none"; // Prevent multiple clicks

      // Updating the identifier in the configuration with the entered phone number
      phone = "+91" + phone;
      configuration.identifier = phone;
      initSendOTP(configuration);
      otpSent = true; // Mark OTP as sent
    }
  }

function enableFormFields() {
  // Enables all the input fields
  nameField.disabled = false;
  emailField.disabled = false;
  messageField.disabled = false;

  // Enables the cursor
  nameField.style.cursor = "pointer";
  emailField.style.cursor = "pointer";
  messageField.style.cursor = "pointer";

  // Enable the submit button
  submitButton.disabled = false;
  submitButton.style.cursor = "pointer"; // Enables the cursor

  // Re-enable the verify button and reset phone field
  phoneField.disabled = true;
}

// Event listener for form submission
document
  .getElementById("supportForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Fetch the form data
    const formData = new FormData(this);

    // Log the form data for debugging
    console.log("Form Data:", Object.fromEntries(formData));

    // Send the form data to the server using fetch
    fetch("/support/sendSupportFormData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        phone: phoneField.value.trim(),
        message: messageField.value.trim(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the success response here, if needed
        console.log(data);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Form submitted successfully. We will get back to you as early as possible.",
          confirmButtonColor: "#3dc944",
        }).then(() => {
          // Clear the form fields
          document.getElementById("supportForm").reset();

          // Reload the page
          location.reload();
        });
      })

      .catch((error) => {
        // Handle the error here, if needed
        console.error("Error submitting form:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong. Please try again later.",
          confirmButtonColor: "#d33",
        });
      });
  });