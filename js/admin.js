// ==========================================
// 1. NAVIGATION & SECTION CONTROLLERS
// ==========================================

function showSection(sectionId, menuItem) {
    // Hide all regular content sections, user-profile, AND project-profile
    document.querySelectorAll('.content-section, #user-profile, #project-profile').forEach(section => {
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


// ==========================================
// 2. USER PROFILE & USER MANAGEMENT
// ==========================================

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

        // Hide other sections, show user-profile section
        document.querySelectorAll('.content-section, .profile-view').forEach(sec => sec.style.display = 'none');
        document.getElementById('user-profile').style.display = 'block';

        switchToViewMode();

        // Populate View Mode text elements
        document.getElementById('headerFirstname').innerText = user.firstname || '';
        document.getElementById('viewFirstname').innerText = user.firstname || '';
        document.getElementById('viewLastname').innerText = user.lastname || '';
        document.getElementById('viewNickname').innerText = user.nickname || '';
        document.getElementById('viewBadgeId').innerText = user.badgeid || '';
        document.getElementById('viewEmail').innerText = user.email || '';
        document.getElementById('viewPosition').innerText = user.position || '-';
        document.getElementById('viewDepartment').innerText = user.department || '-';
        document.getElementById('viewCertification').innerText = user.certification || 'None';
        document.getElementById('viewSite').innerText = user.site || '-';
        document.getElementById('viewRole').innerText = user.role || 'User';
        document.getElementById('viewTrainerCoach').innerText = user.trainer_coach || 'None';

        // Explicitly set or clear profile picture per user record
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

// Mode Toggle Helpers (User Profile)
function switchToEditMode() {
    document.getElementById('profileViewMode').style.display = 'none';
    document.getElementById('editProfileToggleBtn').style.display = 'none';
    document.getElementById('profileEditMode').style.display = 'flex';

    // Populate the edit form inputs with the currently viewed text fields
    document.getElementById('editFirstname').value = document.getElementById('viewFirstname').innerText;
    document.getElementById('editLastname').value = document.getElementById('viewLastname').innerText;
    document.getElementById('editNickname').value = document.getElementById('viewNickname').innerText;
    document.getElementById('editBadgeId').value = document.getElementById('viewBadgeId').innerText;
    document.getElementById('editEmail').value = document.getElementById('viewEmail').innerText;
    document.getElementById('editPosition').value = document.getElementById('viewPosition').innerText === '-' ? '' : document.getElementById('viewPosition').innerText;
    document.getElementById('editDepartment').value = document.getElementById('viewDepartment').innerText === '-' ? '' : document.getElementById('viewDepartment').innerText;
    document.getElementById('editCertification').value = document.getElementById('viewCertification').innerText;
    document.getElementById('editSite').value = document.getElementById('viewSite').innerText;
    document.getElementById('editRole').value = document.getElementById('viewRole').innerText.toLowerCase();
    document.getElementById('editTrainerCoach').value = document.getElementById('viewTrainerCoach').innerText;
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


// ==========================================
// 3. PROJECT MANAGEMENT & TABLES
// ==========================================

let selectedProjectId = null;

// Fetch and render projects list into the table
async function loadProjectTable() {
    try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error("Failed to fetch projects");
        
        const projects = await response.json();
        const tbody = document.getElementById("projectsTableBody");
        if (!tbody) return;
        
        tbody.innerHTML = "";

        projects.forEach(project => {
            const tr = document.createElement("tr");
            tr.style.cursor = "pointer";
            
            // Format monetary values for project_savings
            const formattedSavings = project.project_savings 
                ? `$${Number(project.project_savings).toLocaleString()}K` 
                : '\$0';

            tr.innerHTML = `
                <td>${project.project_owner || ''}</td>
                <td>${project.project_title || ''}</td>
                <td>${project.project_impact || ''}</td>
                <td>${formattedSavings}</td>
            `;

            // When a project row is clicked, open its project profile view
            tr.addEventListener("click", () => {
                openProjectProfile(project.id);
            });

            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading project table:", err);
    }
}

// Mode Toggle Helpers (Project Profile)
function switchProjectToViewMode() {
    const viewMode = document.getElementById('projectViewMode');
    const editMode = document.getElementById('projectEditMode');
    const editToggleBtn = document.getElementById('editProjectToggleBtn');

    if (viewMode) viewMode.style.display = 'flex'; // or 'block' based on your layout
    if (editMode) editMode.style.display = 'none';
    if (editToggleBtn) editToggleBtn.style.display = 'inline-block'; // or 'flex'
}

function ProjectEditMode() {
    const viewMode = document.getElementById('projectViewMode');
    const editMode = document.getElementById('projectEditMode');
    const editToggleBtn = document.getElementById('editProjectToggleBtn');

    if (viewMode) viewMode.style.display = 'none';
    if (editMode) editMode.style.display = 'flex';
    if (editToggleBtn) editToggleBtn.style.display = 'none';

    // Populate the edit form inputs with the currently viewed text fields
    document.getElementById('editProjectOwner').value = document.getElementById('viewProjectOwner').innerText;
    document.getElementById('editProjectTitle').value = document.getElementById('viewProjectTitle').innerText;
    document.getElementById('editProjectImpact').value = document.getElementById('viewImpact').innerText;
    
    // Clean the savings text by removing '\$', ',', 'K', etc. so it's just a raw number
    const savingsText = document.getElementById('viewSavings').innerText;
    document.getElementById('editSavings').value = savingsText.replace(/[^0-9.-]+/g, ""); 

    document.getElementById('editQIcount').value = document.getElementById('viewQIcount').innerText;
}

// Fetch specific project data (including joined user info like department & certification)
async function openProjectProfile(projectId) {
    try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) throw new Error("Failed to fetch project details");
        
        const project = await response.json();
        selectedProjectId = project.id;

        // Hide other sections and show project details view
        document.querySelectorAll('.content-section, .project-view').forEach(sec => sec.style.display = 'none');
        document.getElementById('project-profile').style.display = 'block';

        // Force it to open in View Mode every time a project is clicked
        switchProjectToViewMode();

        // Populate View Mode Fields (matching your updated HTML structure)
        document.getElementById('ProjectheaderFirstname').innerText = project.firstname || '';
        document.getElementById('viewProjectOwner').innerText = project.project_owner || '';
        document.getElementById('viewProjectTitle').innerText = project.project_title || '';
        document.getElementById('viewImpact').innerText = project.project_impact || '';
        document.getElementById('viewSavings').innerText = project.project_savings ? `$${Number(project.project_savings).toLocaleString()}K` : '\$0';
        
        // Dynamically pulled via owner match or direct fields
        document.getElementById('viewProjectCertification').innerText = project.certification || 'None';
        document.getElementById('viewProjectDepartment').innerText = project.department || 'N/A';
        document.getElementById('viewQIcount').innerText = project.quality_improved || '0';

        // Handle User Profile Picture from lookup
        const defaultImage = "./assets/images/default.jpg";
        const ownerImage = project.profile_picture ? project.profile_picture : defaultImage;
        
        const ownerImgElement = document.getElementById('viewProjectOwnerImg');
        if (ownerImgElement) ownerImgElement.src = ownerImage;

    } catch (err) {
        console.error("Error opening project profile:", err);
    }
}

function addUser() {
    document.getElementById('user-form').style.display = 'flex';
    document.getElementById('user-list').style.display = 'none';
}

// Show Add Project Form View
function addProject() {
    document.getElementById('project-form').style.display = 'flex';
    document.getElementById('project-list').style.display = 'none';
}


// ==========================================
// 4. EVENT LISTENERS SETUP (DOM CONTENT LOADED)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initial Data Loads
    loadUserTable();
    loadProjectTable();

    // ------------------------------------------
    // User Profile Picture Handling
    // ------------------------------------------
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

    // ------------------------------------------
    // Navigation / Form Toggle Buttons
    // ------------------------------------------
    const editToggleBtn = document.getElementById('editProfileToggleBtn');
    if (editToggleBtn) {
        editToggleBtn.addEventListener('click', switchToEditMode);
    }

    const addUserToggleBtn = document.getElementById('addUserToggleBtn');
    if (addUserToggleBtn) {
        addUserToggleBtn.addEventListener('click', addUser);
    }

    const ProjecteditToggleBtn = document.getElementById('editProjectToggleBtn');
    if (ProjecteditToggleBtn) {
        ProjecteditToggleBtn.addEventListener('click', ProjectEditMode);
    }

    const addProjectToggleBtn = document.getElementById('addProjectToggleBtn');
    if (addProjectToggleBtn) {
        addProjectToggleBtn.addEventListener('click', addProject);
    }

    // Back Buttons
    const backBtn = document.getElementById('backToUsersBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showSection('users', document.querySelectorAll('.left-panel .menu-item')[2]);
        });
    }

    const ProjectbackBtn = document.getElementById('backToProjectsBtn');
    if (ProjectbackBtn) {
        ProjectbackBtn.addEventListener('click', () => {
            showSection('project', document.querySelectorAll('.left-panel .menu-item')[1]);
        });
    }

    const backFromAddUserBtn = document.getElementById('backFromAddUserBtn');
    if (backFromAddUserBtn) {
        backFromAddUserBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('user-form').style.display = 'none';
            document.getElementById('user-list').style.display = 'flex';
        });
    }

    const backFromAddProjectBtn = document.getElementById('backFromAddProjectBtn');
    if (backFromAddProjectBtn) {
        backFromAddProjectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('project-form').style.display = 'none';
            document.getElementById('project-list').style.display = 'flex';
        });
    }

    // ------------------------------------------
    // Project Cancel Button Handling
    // ------------------------------------------
    const cancelProjectBtn = document.getElementById('cancelprojectBtn');
    if (cancelProjectBtn) {
        cancelProjectBtn.addEventListener('click', () => {
            // Switch back to project view mode
            switchProjectToViewMode();
        });
    }

    // ------------------------------------------
    // Project Cancel Button Handling
    // ------------------------------------------
    const cancelUserBtn = document.getElementById('cancelProfileBtn');
    if (cancelUserBtn) {
        cancelUserBtn.addEventListener('click', () => {
            // Switch back to project view mode
            switchToViewMode();
        });
    }

    // ------------------------------------------
    // Profile Save Action
    // ------------------------------------------
    const saveBtn = document.getElementById('saveProfileBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('firstname', document.getElementById('editFirstname').value);
            formData.append('lastname', document.getElementById('editLastname').value);
            formData.append('nickname', document.getElementById('editNickname').value);
            formData.append('badgeid', document.getElementById('editBadgeId').value);
            formData.append('email', document.getElementById('editEmail').value);
            formData.append('position', document.getElementById('editPosition').value);
            formData.append('department', document.getElementById('editDepartment').value);
            formData.append('certification', document.getElementById('editCertification').value);
            formData.append('site', document.getElementById('editSite').value);
            formData.append('role', document.getElementById('editRole').value);
            formData.append('trainer_coach', document.getElementById('editTrainerCoach').value);

            if (fileInput && fileInput.files.length > 0) {
                formData.append('imageFile', fileInput.files[0]);
            }

            try {
                const response = await fetch(`/api/users/${selectedUserId}`, {
                    method: 'PUT',
                    body: formData
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Failed to update user");

                alert("Profile updated successfully!");
                loadUserTable();
                openUserProfile(selectedUserId);
            } catch (err) {
                console.error("Save error:", err);
                alert("Error saving profile changes.");
            }
        });
    }

    // ------------------------------------------
    // Add New Project Form Submission Handling
    // ------------------------------------------
    const projectFormElement = document.querySelector('#project-form .project-form');
    if (projectFormElement) {
        projectFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(projectFormElement);
            const projectData = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(projectData)
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Failed to add project');

                alert('Project added successfully!');
                projectFormElement.reset();
                document.getElementById('project-form').style.display = 'none';
                document.getElementById('project-list').style.display = 'flex';

                // Refresh the project table list
                loadProjectTable();

            } catch (err) {
                console.error('Error submitting project:', err);
                alert(`Error: ${err.message}`);
            }
        });
    }

    // ------------------------------------------
    // Project Save Action
    // ------------------------------------------
    const ProjectsaveBtn = document.getElementById('saveprojecteBtn');
    if (ProjectsaveBtn) {
        ProjectsaveBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const updatedData = {
                project_owner: document.getElementById('editProjectOwner').value,
                project_title: document.getElementById('editProjectTitle').value,
                project_impact: document.getElementById('editProjectImpact').value,
                project_savings: document.getElementById('editSavings').value,
                quality_improved: document.getElementById('editQIcount').value
            };

            try {
                const response = await fetch(`/api/projects/${selectedProjectId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Failed to update project");

                alert("Project updated successfully!");
                loadProjectTable();                  // Refresh project table
                openProjectProfile(selectedProjectId); // Refresh project profile view
            } catch (err) {
                console.error("Save error:", err);
                alert("Error saving project: " + err.message);
            }
        });
    }
});

