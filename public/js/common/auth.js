// public/js/auth.js

window.onload = function() {
    const token = localStorage.getItem('token');
    // console.log(token)
    if (!token) {
        // Redirect to login page if token is not found
        window.location.href = '/admin-login';
        return;
    }
    // Optionally, verify the token by making an API request
    fetch('/api/verify-token', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.valid) {
            // Redirect to login page if token is invalid
            window.location.href = '/admin-login';
        }
    })
    .catch(error => {
        console.error('Error verifying token:', error);
        window.location.href = '/admin-login';
    });
}
