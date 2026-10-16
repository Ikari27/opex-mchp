function showSection(sectionId, menuItem) {

    // hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // show selected section
    document.getElementById(sectionId).style.display = 'block';

    // remove active from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // add active to clicked menu item
    menuItem.classList.add('active');
    
}

//user list

document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/users")
        .then(response => {
            if (!response.ok) {
                throw new Error("Unauthorized or failed to fetch users");
            }
            return response.json();
        })
        .then(users => {
            const tableBody = document.getElementById("userTableBody");
            tableBody.innerHTML = ""; // Clear any existing placeholders

            users.forEach(user => {
                const row = document.createElement("tr");
                row.style.cursor = "pointer"; // Indicates row is clickable
                
                row.innerHTML = `
                    <td>${user.badgeid}</td>
                    <td>${user.firstname} ${user.lastname}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                `;

                // Add click listener to open profile
                row.addEventListener("click", () => {
                    openUserProfile(user); // Just call the function directly
                });

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error loading users:", error);
        });
});

// Function to populate and show the profile in view-only mode
function openUserProfile(user) {
    // Populate view elements
    document.getElementById("viewFirstname").textContent = user.firstname;
    document.getElementById("viewLastname").textContent = user.lastname;
    document.getElementById("viewBadge").textContent = user.badgeid;
    document.getElementById("viewEmail").textContent = user.email;
    document.getElementById("viewRole").textContent = user.role;

    // Populate edit form fields (hidden by default)
    document.getElementById("editFirstname").value = user.firstname;
    document.getElementById("editLastname").value = user.lastname;
    document.getElementById("editBadge").value = user.badgeid;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editRole").value = user.role;

    // Ensure we start in View Mode
    document.getElementById("profileViewMode").style.display = "block";
    document.getElementById("profileEditMode").style.display = "none";
    document.getElementById("editProfileBtn").style.display = "inline-block";

    // Switch sections
    document.getElementById("users").style.display = "none";
    document.getElementById("user-profile").style.display = "block";
}

// Handle Edit Profile button click
document.getElementById("editProfileBtn").addEventListener("click", () => {
    document.getElementById("profileViewMode").style.display = "none";
    document.getElementById("profileEditMode").style.display = "block";
    document.getElementById("editProfileBtn").style.display = "none";
});

// Handle Save Changes button
document.getElementById("saveUserBtn").addEventListener("click", () => {
    const updatedUser = {
        badgeid: document.getElementById("editBadge").value,
        firstname: document.getElementById("editFirstname").value,
        lastname: document.getElementById("editLastname").value,
        email: document.getElementById("editEmail").value,
        role: document.getElementById("editRole").value
    };

    fetch(`/api/users/${updatedUser.badgeid}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedUser)
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to update user");
        return response.json();
    })
    .then(data => {
        alert("User updated successfully!");
        
        // Update the view mode text immediately to match changes
        document.getElementById("viewFirstname").textContent = updatedUser.firstname;
        document.getElementById("viewLastname").textContent = updatedUser.lastname;
        document.getElementById("viewEmail").textContent = updatedUser.email;
        document.getElementById("viewRole").textContent = updatedUser.role;

        // Switch back to View Mode
        document.getElementById("profileEditMode").style.display = "none";
        document.getElementById("profileViewMode").style.display = "block";
        document.getElementById("editProfileBtn").style.display = "inline-block";
    })
    .catch(error => {
        console.error("Error updating user:", error);
        alert("Error updating user.");
    });
});

// Back button handler
document.getElementById("backToUsersBtn").addEventListener("click", () => {
    document.getElementById("user-profile").style.display = "none";
    document.getElementById("users").style.display = "block";
});

// Handle Cancel button
document.getElementById("cancelEditBtn").addEventListener("click", () => {
    // Reset input fields back to the original view values
    document.getElementById("editFirstname").value = document.getElementById("viewFirstname").textContent;
    document.getElementById("editLastname").value = document.getElementById("viewLastname").textContent;
    document.getElementById("editEmail").value = document.getElementById("viewEmail").textContent;
    document.getElementById("editRole").value = document.getElementById("viewRole").textContent;

    // Switch back to View Mode
    document.getElementById("profileEditMode").style.display = "none";
    document.getElementById("profileViewMode").style.display = "block";
    document.getElementById("editProfileBtn").style.display = "inline-block";
});