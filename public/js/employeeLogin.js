// Handle login form submission
document.getElementById("employeeLoginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const phoneNumber = document.getElementById("phoneNumber").value;
    const pin = document.getElementById("pin").value;
    const rememberMe = document.getElementById("rememberMe").checked; // Get the state of the checkbox

    try {
        const response = await fetch("/api/employee-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ phoneNumber: phoneNumber, pin: pin, rememberMe: rememberMe }) // Include rememberMe in the request body
        });

        const data = await response.json();
        // console.log("Employee Data: ", data)
        // console.log(`/employee/${data.employeeId}/employee-profile`);

        if (response.ok) {
            // Success
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: data.message,
                confirmButtonColor: "#3dc944",
            }).then(() => {
                // Redirect to employee profile with employeeId included in the URL
                // window.location.href = `/employee/${data.employeeId}/employee-profile`;
                window.location.href = `/employee/dashboard`;
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
        } else {
            // Error
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: data.message,
                confirmButtonColor: "#d33",
            });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while processing your request. Please try again later.',
            confirmButtonColor: "#d33",
        });
    }
});