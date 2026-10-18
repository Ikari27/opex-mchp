// ===================
// SELECTION SELECTOR
// ===================

function showSection(sectionId, menuItem) {
    // Hide all regular content sections AND the profile view section
    document.querySelectorAll('.content-section, #user-profile').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to clicked menu item
    if (menuItem) {
        menuItem.classList.add('active');
    }
}

// ===============
// USER PROFILE
// ===============
let selectedUserId = null;

// Fetch and render all registered users from MySQL into the table
async function loadUserTable() {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error("Failed to fetch users");
        
        const users = await response.json();
        const tbody = document.getElementById("userTableBody");
        if (!tbody) return;
        
        tbody.innerHTML = "";

        users.forEach(user => {
            const tr = document.createElement("tr");
            tr.style.cursor = "pointer";
            tr.innerHTML = `
                <td>${user.badgeid || ''}</td>
                <td>${user.firstname || ''} ${user.lastname || ''}</td>
                <td>${user.department || ''}</td>
                <td>${user.certification || ''}</td>
                <td>${user.site || ''}</td>
                <td>${user.role || ''}</td>
            `;

            // When a user row is clicked, fetch their detailed record using their database ID
            tr.addEventListener("click", () => {
                openUserProfile(user.id);
            });

            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading user table:", err);
    }
}

// Fetch specific user data from MySQL and display in Profile View Mode
async function openUserProfile(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");
        
        const user = await response.json();
        selectedUserId = user.id;

        // Hide other sections, show profile section
        document.querySelectorAll('.content-section, .profile-view').forEach(sec => sec.style.display = 'none');
        document.getElementById('user-profile').style.display = 'block';

        switchToViewMode();

        // Populate View Mode text elements
        document.getElementById('headerFirstname').innerText = user.firstname || '';
        document.getElementById('viewFirstname').innerText = user.firstname || '';
        document.getElementById('viewLastname').innerText = user.lastname || '';
        document.getElementById('viewBadgeId').innerText = user.badgeid || '';
        document.getElementById('viewEmail').innerText = user.email || '';
        document.getElementById('viewPosition').innerText = user.position || '-';
        document.getElementById('viewDepartment').innerText = user.department || '-';
        document.getElementById('viewCertification').innerText = user.certification || 'None';
        document.getElementById('viewSite').innerText = user.site || '-';
        document.getElementById('viewRole').innerText = user.role || 'User';

        // CRITICAL FIX: Explicitly set or clear profile picture per user record
        const defaultImage = "./assets/images/default.jpg";
        const userImage = user.profile_picture ? user.profile_picture : defaultImage;

        const viewImgElement = document.getElementById('viewProfileImg');
        const editImgElement = document.getElementById('editProfileImg');

        if (viewImgElement) viewImgElement.src = userImage;
        if (editImgElement) editImgElement.src = userImage;

        // Clear out any leftover file input selection buffers
        const fileInput = document.getElementById('profile-file-input');
        if (fileInput) fileInput.value = "";

    } catch (err) {
        console.error("Error opening profile:", err);
    }
}

// Mode Toggle Helpers
function switchToEditMode() {
    document.getElementById('profileViewMode').style.display = 'none';
    document.getElementById('editProfileToggleBtn').style.display = 'none';
    document.getElementById('profileEditMode').style.display = 'flex';

    // Populate the edit form inputs with the currently viewed text fields
    document.getElementById('editFirstname').value = document.getElementById('viewFirstname').innerText;
    document.getElementById('editLastname').value = document.getElementById('viewLastname').innerText;
    document.getElementById('editBadgeId').value = document.getElementById('viewBadgeId').innerText;
    document.getElementById('editEmail').value = document.getElementById('viewEmail').innerText;
    document.getElementById('editPosition').value = document.getElementById('viewPosition').innerText === '-' ? '' : document.getElementById('viewPosition').innerText;
    document.getElementById('editDepartment').value = document.getElementById('viewDepartment').innerText === '-' ? '' : document.getElementById('viewDepartment').innerText;
    document.getElementById('editCertification').value = document.getElementById('viewCertification').innerText;
    document.getElementById('editSite').value = document.getElementById('viewSite').innerText;
    document.getElementById('editRole').value = document.getElementById('viewRole').innerText.toLowerCase();
}

function switchToViewMode() {
    document.getElementById('profileViewMode').style.display = 'flex';
    document.getElementById('editProfileToggleBtn').style.display = 'flex';
    document.getElementById('profileEditMode').style.display = 'none';
}

function addUser() {
    document.getElementById('user-form').style.display = 'flex';
    document.getElementById('user-list').style.display = 'none';
}

function addProject() {
    document.getElementById('project-form').style.display = 'flex';
    document.getElementById('project-list').style.display = 'none';
}

// Consolidated Event Handlers Setup on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    loadUserTable();

    // Setup Click-to-Change Profile Picture in Edit Mode
    const editImg = document.getElementById('editProfileImg');
    const fileInput = document.getElementById('profile-file-input');

    if (editImg && fileInput) {
        editImg.style.cursor = 'pointer';
        editImg.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    editImg.src = event.target.result; // Live preview
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Toggle Edit Mode when clicking "Edit User Profile" button
    const editToggleBtn = document.getElementById('editProfileToggleBtn');
    if (editToggleBtn) {
        editToggleBtn.addEventListener('click', switchToEditMode);
    }

    // Toggle add user Mode when clicking "add User Profile" button
    const addUserToggleBtn = document.getElementById('addUserToggleBtn');
    if (addUserToggleBtn) {
        addUserToggleBtn.addEventListener('click', addUser);
    }

    // Toggle add project Mode when clicking "add User Profile" button
    const addProjectToggleBtn = document.getElementById('addProjectToggleBtn');
    if (addProjectToggleBtn) {
        addProjectToggleBtn.addEventListener('click', addProject);
    }

    // Cancel Edit Mode and return to View Mode
    const cancelBtn = document.getElementById('cancelProfileBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchToViewMode();
        });
    }

    // Save Profile Changes to MySQL Database via single FormData PUT request
    const saveBtn = document.getElementById('saveProfileBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('firstname', document.getElementById('editFirstname').value);
            formData.append('lastname', document.getElementById('editLastname').value);
            formData.append('badgeid', document.getElementById('editBadgeId').value);
            formData.append('email', document.getElementById('editEmail').value);
            formData.append('position', document.getElementById('editPosition').value);
            formData.append('department', document.getElementById('editDepartment').value);
            formData.append('certification', document.getElementById('editCertification').value);
            formData.append('site', document.getElementById('editSite').value);
            formData.append('role', document.getElementById('editRole').value);

            // Attach image file if selected
            if (fileInput && fileInput.files.length > 0) {
                formData.append('imageFile', fileInput.files[0]);
            }

            try {
                const response = await fetch(`/api/users/${selectedUserId}`, {
                    method: 'PUT',
                    body: formData // Browser handles Content-Type boundary automatically for FormData
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Failed to update user");

                alert("Profile updated successfully!");
                loadUserTable();                 // Refresh the table list
                openUserProfile(selectedUserId); // Refresh profile view mode with updated data
            } catch (err) {
                console.error("Save error:", err);
                alert("Error saving profile changes.");
            }
        });
    }

    // Back to Users button handler
    const backBtn = document.getElementById('backToUsersBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showSection('users', document.querySelectorAll('.left-panel .menu-item')[2]);
        });
    }

    // Back from Add User form handler (returns to user list view)
    const backFromAddUserBtn = document.getElementById('backFromAddUserBtn');
    if (backFromAddUserBtn) {
        backFromAddUserBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('user-form').style.display = 'none';
            document.getElementById('user-list').style.display = 'flex';
        });
    }

    // Back from Add Project form handler (returns to user list view)
    const backFromAddProjectBtn = document.getElementById('backFromAddProjectBtn');
    if (backFromAddProjectBtn) {
        backFromAddProjectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('project-form').style.display = 'none';
            document.getElementById('project-list').style.display = 'flex';
        });
    }
});