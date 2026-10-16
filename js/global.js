const dropdownLinks = document.querySelectorAll(".dp > a");
const navbar = document.querySelector(".navbar");

dropdownLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const currentMenu = this.nextElementSibling;

        document.querySelectorAll(".dp-list").forEach(menu => {
            if (menu !== currentMenu) {
                menu.classList.remove("show");
            }
        });

        currentMenu.classList.toggle("show");
    });
});

navbar.addEventListener("click", function (e) {
    if (!e.target.closest(".dp > a")) {
        document.querySelectorAll(".dp-list").forEach(menu => {
            menu.classList.remove("show");
        });
    }
});

// Check general login status to toggle Login/Logout buttons
fetch("/api/user")
    .then(res => res.json())
    .then(data => {
        const loginItem = document.getElementById("login");
        const logoutItem = document.getElementById("logout");
        const helloItem = document.getElementById("hello");
        const adminItem = document.getElementById("admin");

        if (data.loggedIn) {
            // If logged in, hide Login and Register, show Logout
            if (loginItem) loginItem.style.display = "none";
            if (helloItem) helloItem.style.display = "block";
            if (adminItem) helloItem.style.display = "block";
            if (logoutItem) logoutItem.style.display = "block"; // or ""

            if (data.user && data.user.role === 'admin') {
                if (adminItem) adminItem.style.display = "block"; // Show admin elements
            } else {
                if (adminItem) adminItem.style.display = "none";  // Hide admin elements for regular members
            }
        } else {
            // If NOT logged in, show Login and Register, hide Logout
            if (loginItem) loginItem.style.display = "block";
            if (helloItem) helloItem.style.display = "none";
            if (adminItem) adminItem.style.display = "none"; // or ""
            if (logoutItem) logoutItem.style.display = "none";
        }
    })
    .catch(error => console.error("Error fetching user session:", error));


// Fetch and display logged-in user's first name (Admin or Non-Admin)
document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/user')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn && data.user && data.user.firstname) {
                // Selects all elements with the class 'firstname' and updates them
                const nameElements = document.querySelectorAll('.firstname');
                nameElements.forEach(el => {
                    el.textContent = data.user.firstname;
                });
            }
        })
        .catch(error => console.error('Error fetching user data:', error));
});

