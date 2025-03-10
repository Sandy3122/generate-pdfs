document.addEventListener('DOMContentLoaded', function () {
    // Function to validate phone number on blur
    function validatePhoneNumber(event) {
      const input = event.target;
      const value = input.value;
      const pattern = /^\d{10}$/;
  
      // Check if value matches the pattern
      if (!pattern.test(value)) {
        input.setCustomValidity('Phone number must be exactly 10 digits.');
        input.reportValidity();
      } else {
        input.setCustomValidity('');
      }
    }
  
    // Attach the event listener to all phone number inputs
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(function (input) {
      input.addEventListener('blur', validatePhoneNumber);
    });
  });
  