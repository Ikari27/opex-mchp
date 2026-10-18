document.getElementById('loginform').addEventListener('submit', function(e) {
    e.preventDefault(); // Stop standard form submission from refreshing the page

    const formData = {
        badgeid: this.badgeid.value,
        password: this.password.value
    };

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // If login is successful, redirect to admin or index page
            window.location.href = data.redirectUrl;
        } else {
            // If login fails, display the error text right below the button!
            document.getElementById('login-error-msg').textContent = data.error;
        }
    })
    .catch(err => {
        console.error("Login error:", err);
        document.getElementById('login-error-msg').textContent = "A network error occurred.";
    });
});