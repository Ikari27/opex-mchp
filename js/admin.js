// ==========================================
// 1. NAVIGATION & SECTION CONTROLLERS
// ==========================================

function showSection(sectionId, menuItem) {
    // Hide all regular content sections, user-profile, project-profile, and training-profile
    document.querySelectorAll('.content-section, #user-profile, #project-profile, #training-profile').forEach(section => {
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

            tr.addEventListener("click", () => {
                openUserProfile(user.id);
            });

            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading user table:", err);
    }
}

async function openUserProfile(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");
        
        const user = await response.json();
        selectedUserId = user.id;

        document.querySelectorAll('.content-section, .profile-view').forEach(sec => sec.style.display = 'none');
        document.getElementById('user-profile').style.display = 'block';

        switchToViewMode();

        document.getElementById('headerFirstname').innerText = user.firstname || '';
        document.getElementById('viewFirstname').innerText = user.firstname || '';
        document.getElementById('viewLastname').innerText = user.lastname || '';
        document.getElementById('viewNickname').innerText = user.nickname || '';
        document.getElementById('viewBadgeId').innerText = user.badgeid || '';
        document.getElementById('viewEmail').innerText = user.email || '';
        document.getElementById('viewPosition').innerText = user.position || '-';
        document.getElementById('viewDepartment').innerText = user.department || '-';
        document.getElementById('viewCertification').innerText = user.certification || 'None';
        document.getElementById('viewCertState').innerText = user.cert_candidate || 'None';
        document.getElementById('viewSite').innerText = user.site || '-';
        document.getElementById('viewRole').innerText = user.role || 'User';
        document.getElementById('viewTrainerCoach').innerText = user.trainer_coach || 'None';
        document.getElementById('viewLssPdca').innerText = user.lss_pdca || 'None';

        const defaultImage = "./assets/images/default.jpg";

        // Appending ?t=timestamp forces the browser to bypass cache and load the fresh image
        const cacheBuster = `?t=${new Date().getTime()}`;
        const userImage = user.profile_picture ? `${user.profile_picture}${cacheBuster}` : defaultImage;
        // -------------------------

        const viewImgElement = document.getElementById('viewProfileImg');
        const editImgElement = document.getElementById('editProfileImg');

        if (viewImgElement) viewImgElement.src = userImage;
        if (editImgElement) editImgElement.src = userImage;

        const fileInput = document.getElementById('profile-file-input');
        if (fileInput) fileInput.value = "";

    } catch (err) {
        console.error("Error opening profile:", err);
    }
}

function switchToEditMode() {
    document.getElementById('profileViewMode').style.display = 'none';
    document.getElementById('editProfileToggleBtn').style.display = 'none';
    document.getElementById('profileEditMode').style.display = 'flex';

    document.getElementById('editFirstname').value = document.getElementById('viewFirstname').innerText;
    document.getElementById('editLastname').value = document.getElementById('viewLastname').innerText;
    document.getElementById('editNickname').value = document.getElementById('viewNickname').innerText;
    document.getElementById('editBadgeId').value = document.getElementById('viewBadgeId').innerText;
    document.getElementById('editEmail').value = document.getElementById('viewEmail').innerText;
    document.getElementById('editPosition').value = document.getElementById('viewPosition').innerText === '-' ? '' : document.getElementById('viewPosition').innerText;
    document.getElementById('editDepartment').value = document.getElementById('viewDepartment').innerText === '-' ? '' : document.getElementById('viewDepartment').innerText;
    document.getElementById('editCertification').value = document.getElementById('viewCertification').innerText;
    document.getElementById('editCertState').value = document.getElementById('viewCertState').innerText;
    document.getElementById('editSite').value = document.getElementById('viewSite').innerText;
    document.getElementById('editRole').value = document.getElementById('viewRole').innerText.toLowerCase();
    document.getElementById('editTrainerCoach').value = document.getElementById('viewTrainerCoach').innerText.toLowerCase();
    document.getElementById('editLssPdca').value = document.getElementById('viewLssPdca').innerText.toLowerCase();
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
            
            const formattedSavings = project.project_savings 
                ? `$${Number(project.project_savings).toLocaleString()}K` 
                : '$0';

            tr.innerHTML = `
                <td>${project.project_owner || ''}</td>
                <td>${project.project_title || ''}</td>
                <td>${project.project_impact || ''}</td>
                <td>${formattedSavings}</td>
            `;

            tr.addEventListener("click", () => {
                openProjectProfile(project.id);
            });

            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading project table:", err);
    }
}

function switchProjectToViewMode() {
    const viewMode = document.getElementById('projectViewMode');
    const editMode = document.getElementById('projectEditMode');
    const editToggleBtn = document.getElementById('editProjectToggleBtn');

    if (viewMode) viewMode.style.display = 'flex';
    if (editMode) editMode.style.display = 'none';
    if (editToggleBtn) editToggleBtn.style.display = 'inline-block';
}

function ProjectEditMode() {
    const viewMode = document.getElementById('projectViewMode');
    const editMode = document.getElementById('projectEditMode');
    const editToggleBtn = document.getElementById('editProjectToggleBtn');

    if (viewMode) viewMode.style.display = 'none';
    if (editMode) editMode.style.display = 'flex';
    if (editToggleBtn) editToggleBtn.style.display = 'none';

    document.getElementById('editProjectOwner').value = document.getElementById('viewProjectOwner').innerText;
    document.getElementById('editProjectTitle').value = document.getElementById('viewProjectTitle').innerText;
    document.getElementById('editProjectImpact').value = document.getElementById('viewImpact').innerText;
    
    const savingsText = document.getElementById('viewSavings').innerText;
    document.getElementById('editSavings').value = savingsText.replace(/[^0-9.-]+/g, ""); 

    document.getElementById('editQIcount').value = document.getElementById('viewQIcount').innerText;
}

async function openProjectProfile(projectId) {
    try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) throw new Error("Failed to fetch project details");
        
        const project = await response.json();
        selectedProjectId = project.id;

        document.querySelectorAll('.content-section, .project-view').forEach(sec => sec.style.display = 'none');
        document.getElementById('project-profile').style.display = 'block';

        switchProjectToViewMode();

        document.getElementById('ProjectheaderFirstname').innerText = project.firstname || '';
        document.getElementById('viewProjectOwner').innerText = project.project_owner || '';
        document.getElementById('viewProjectTitle').innerText = project.project_title || '';
        document.getElementById('viewImpact').innerText = project.project_impact || '';
        document.getElementById('viewSavings').innerText = project.project_savings ? `$${Number(project.project_savings).toLocaleString()}K` : '$0';
        
        document.getElementById('viewProjectCertification').innerText = project.certification || 'None';
        document.getElementById('viewProjectDepartment').innerText = project.department || 'N/A';
        document.getElementById('viewQIcount').innerText = project.quality_improved || '0';

        const defaultImage = "./assets/images/default.jpg";
        const ownerImage = project.profile_picture ? project.profile_picture : defaultImage;
        
        const ownerImgElement = document.getElementById('viewProjectOwnerImg');
        if (ownerImgElement) ownerImgElement.src = ownerImage;

    } catch (err) {
        console.error("Error opening project profile:", err);
    }
}

function addProject() {
    document.getElementById('project-form').style.display = 'flex';
    document.getElementById('project-list').style.display = 'none';
}


// ==========================================
// 4. TRAINING MANAGEMENT & TABLES
// ==========================================

let selectedTrainingId = null;

async function loadTrainingTable() {
    try {
        const response = await fetch('/api/trainings');
        if (!response.ok) throw new Error("Failed to fetch trainings");
        
        const trainings = await response.json();
        const tbody = document.getElementById("trainingTableBody");
        if (!tbody) return;
        
        tbody.innerHTML = "";

        trainings.forEach(training => {
            const tr = document.createElement("tr");
            tr.style.cursor = "pointer";

            const formattedHrs = training.hrs
                ? `${Number(training.hrs).toLocaleString()} Hrs` 
                : '';

            tr.innerHTML = `
                <td>${training.trainer || ''}</td>
                <td>${training.training || ''}</td>
                <td>${formattedHrs}</td>
            `;

            tr.addEventListener("click", () => {
                openTrainingProfile(training.id);
            });

            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading training table:", err);
    }
}

async function openTrainingProfile(trainingId) {
    try {
        const response = await fetch(`/api/trainings/${trainingId}`);
        if (!response.ok) throw new Error("Failed to fetch training profile");
        
        const training = await response.json();
        selectedTrainingId = training.id;

        document.querySelectorAll('.content-section, .training-view').forEach(sec => sec.style.display = 'none');
        document.getElementById('training-profile').style.display = 'block';

        switchToTrainingViewMode();

        document.getElementById('TrainingheaderFirstname').innerText = training.firstname || training.trainer || '';
        document.getElementById('viewTraining').innerText = training.training || '';
        document.getElementById('viewTrainer').innerText = training.trainer || '';
        document.getElementById('viewHrs').innerText = training.hrs || '';

        const defaultImage = "./assets/images/default.jpg";
        // Fixed: Use training.profile_picture instead of undefined 'user'
        const trainerImage = training.profile_picture ? training.profile_picture : defaultImage;

        const viewImgElement = document.getElementById('viewTrainerImg');
        if (viewImgElement) viewImgElement.src = trainerImage;

    } catch (err) {
        console.error("Error opening training profile:", err);
    }
}

function switchToTrainingEditMode() {
    document.getElementById('trainingViewMode').style.display = 'none';
    document.getElementById('editTrainingToggleBtn').style.display = 'none';
    document.getElementById('trainingEditMode').style.display = 'flex';

    document.getElementById('editTraining').value = document.getElementById('viewTraining').innerText;
    document.getElementById('editTrainer').value = document.getElementById('viewTrainer').innerText;
    document.getElementById('edithrs').value = document.getElementById('viewHrs').innerText;
}

function switchToTrainingViewMode() {
    document.getElementById('trainingViewMode').style.display = 'flex';
    document.getElementById('editTrainingToggleBtn').style.display = 'flex';
    document.getElementById('trainingEditMode').style.display = 'none';
}

function addTraining() {
    document.getElementById('training-form').style.display = 'flex';
    document.getElementById('training-list').style.display = 'none';
}


// ==========================================
// 5. EVENT LISTENERS SETUP (DOM CONTENT LOADED)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initial Data Loads
    loadUserTable();
    loadProjectTable();
    loadTrainingTable();

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
                    editImg.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // ------------------------------------------
    // Toggle Buttons & Navigation Triggers
    // ------------------------------------------
    const editToggleBtn = document.getElementById('editProfileToggleBtn');
    if (editToggleBtn) editToggleBtn.addEventListener('click', switchToEditMode);

    const addUserToggleBtn = document.getElementById('addUserToggleBtn');
    if (addUserToggleBtn) addUserToggleBtn.addEventListener('click', addUser);

    const ProjecteditToggleBtn = document.getElementById('editProjectToggleBtn');
    if (ProjecteditToggleBtn) ProjecteditToggleBtn.addEventListener('click', ProjectEditMode);

    const addProjectToggleBtn = document.getElementById('addProjectToggleBtn');
    if (addProjectToggleBtn) addProjectToggleBtn.addEventListener('click', addProject);

    const TrainingeditToggleBtn = document.getElementById('editTrainingToggleBtn');
    if (TrainingeditToggleBtn) TrainingeditToggleBtn.addEventListener('click', switchToTrainingEditMode);

    const addTrainingToggleBtn = document.getElementById('addTrainingToggleBtn');
    if (addTrainingToggleBtn) addTrainingToggleBtn.addEventListener('click', addTraining);

    // Back Buttons
    const backBtn = document.getElementById('backToUsersBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showSection('users', document.querySelectorAll('.left-panel .menu-item')[3]);
        });
    }

    const ProjectbackBtn = document.getElementById('backToProjectsBtn');
    if (ProjectbackBtn) {
        ProjectbackBtn.addEventListener('click', () => {
            showSection('project', document.querySelectorAll('.left-panel .menu-item')[2]);
        });
    }

    const TrainingbackBtn = document.getElementById('backToTrainingsBtn');
    if (TrainingbackBtn) {
        TrainingbackBtn.addEventListener('click', () => {
            showSection('training', document.querySelectorAll('.left-panel .menu-item')[1]);
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

    const backFromAddTrainingBtn = document.getElementById('backFromAddTrainingBtn');
    if (backFromAddTrainingBtn) {
        backFromAddTrainingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('training-form').style.display = 'none';
            document.getElementById('training-list').style.display = 'flex';
        });
    }

    // Cancel Profile Edit
    const cancelUserBtn = document.getElementById('cancelProfileBtn');
    if (cancelUserBtn) {
        cancelUserBtn.addEventListener('click', switchToViewMode);
    }

    // Cancel Project Edit
    const cancelProjectBtn = document.getElementById('cancelprojectBtn');
    if (cancelProjectBtn) {
        cancelProjectBtn.addEventListener('click', switchProjectToViewMode);
    }

    // ------------------------------------------
    // Form Submissions & Saves
    // ------------------------------------------

    // User Profile Save
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
            formData.append('cert_candidate', document.getElementById('editCertState').value);
            formData.append('site', document.getElementById('editSite').value);
            formData.append('role', document.getElementById('editRole').value);
            formData.append('trainer_coach', document.getElementById('editTrainerCoach').value);
            formData.append('lss_pdca', document.getElementById('editLssPdca').value);

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

    // Add New Project Form Submission
    const projectFormElement = document.querySelector('#project-form .project-form');
    if (projectFormElement) {
        projectFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(projectFormElement);
            const projectData = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectData)
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Failed to add project');

                alert('Project added successfully!');
                projectFormElement.reset();
                document.getElementById('project-form').style.display = 'none';
                document.getElementById('project-list').style.display = 'flex';

                loadProjectTable();
            } catch (err) {
                console.error('Error submitting project:', err);
                alert(`Error: ${err.message}`);
            }
        });
    }

    // Project Save Action
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
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData)
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Failed to update project");

                alert("Project updated successfully!");
                loadProjectTable();
                openProjectProfile(selectedProjectId);
            } catch (err) {
                console.error("Save error:", err);
                alert("Error saving project: " + err.message);
            }
        });
    }

    // Training Save Action
    const TrainingsaveBtn = document.getElementById('savetrainingBtn');
    if (TrainingsaveBtn) {
        TrainingsaveBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const updatedData = {
                trainer: document.getElementById('editTrainer').value,
                training: document.getElementById('editTraining').value,
                hrs: document.getElementById('edithrs').value
            };

            try {
                // Fixed: Uses global selectedTrainingId instead of undefined scope variable
                const response = await fetch(`/api/trainings/${selectedTrainingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData)
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Failed to update training");

                alert("Training updated successfully!");
                loadTrainingTable();
                openTrainingProfile(selectedTrainingId);
            } catch (err) {
                console.error("Save error:", err);
                alert("Error saving training: " + err.message);
            }
        });
    }

    // Add New Training Form Submission
    const trainingFormElement = document.querySelector('#training-form .training-form');
    if (trainingFormElement) {
        trainingFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(trainingFormElement);
            const trainingData = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/trainings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(trainingData)
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Failed to add training');

                alert('Training added successfully!');
                // Fixed: Resets trainingFormElement instead of projectFormElement
                trainingFormElement.reset();
                document.getElementById('training-form').style.display = 'none';
                document.getElementById('training-list').style.display = 'flex';

                loadTrainingTable();
            } catch (err) {
                console.error('Error submitting training:', err);
                alert(`Error: ${err.message}`);
            }
        });
    }

        const registerForm = document.getElementById("user-form2");
    const messageContainer = document.getElementById("registerMessage");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault(); 

            messageContainer.innerText = "Processing...";
            messageContainer.style.color = "gray";

            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            try {
                console.log("Sending registration data...", data);

                const response = await fetch("/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                console.log("Response JSON:", result);

                if (!response.ok) {
                    messageContainer.style.color = "red";
                    messageContainer.innerText = result.error || "Registration failed.";
                } else {
                    messageContainer.style.color = "green";
                    messageContainer.innerText = result.message;
                    registerForm.reset();
                    
                    setTimeout(() => {
                        window.location.reload(); 
                    }, 2000);
                }
            } catch (err) {
                console.error("Fetch/Network error caught:", err);
                messageContainer.style.color = "red";
                messageContainer.innerText = "An unexpected error occurred.";
            }
        });
    } else {
        console.warn("actualRegisterForm element not found in DOM!");
    }
});