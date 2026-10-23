document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId) {
        loadUserProfile(userId);
    } else {
        console.warn("No user ID found in URL parameters.");
    }
});

async function loadUserProfile(userId) {
    const spinner = document.getElementById('loadingSpinner');
    const content = document.getElementById('profileContent');
    try {
        const response = await fetch(`/api/public-profile/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch profile data");

        const data = await response.json();
        const user = data.user;
        const projects = data.projects;
        const totals = data.totals || { savings: 0, quality: 0 };

        // 1. Populate Text Details
        document.getElementById('headerFirstname').textContent = user.nickname || user.firstname || 'User';
        document.getElementById('viewFirstname').textContent = user.nickname || user.firstname || '';
        document.getElementById('viewLastname').textContent = user.lastname || '';
        document.getElementById('viewSite').textContent = user.site || '';
        document.getElementById('viewCertification').textContent = user.certification || '';
        document.getElementById('viewPosition').textContent = user.position || '';
        document.getElementById('viewDepartment').textContent = user.department || '';

        // 2. Fix Profile Picture Path
        const profileImg = document.getElementById('viewProfileImg');
        if (profileImg) {
            if (user.profile_picture && user.profile_picture.trim() !== "") {
                let imgPath = user.profile_picture.trim();
                
                // Remove leading dot or relative indicators
                if (imgPath.startsWith('.')) {
                    imgPath = imgPath.substring(1);
                }
                // Ensure it starts with a forward slash to root from server base
                if (!imgPath.startsWith('/')) {
                    imgPath = '/' + imgPath;
                }
                profileImg.src = imgPath;
            } else {
                profileImg.src = './assets/images/default.jpg';
            }
        }

        // 3. Populate Financial & Quality Numbers
        const financialElem = document.getElementById('viewFinancial');
        const qualityElem = document.getElementById('viewQuality');

        if (financialElem) financialElem.textContent = `$${totals.savings.toLocaleString()}K`;
        if (qualityElem) qualityElem.textContent = totals.quality;

        // 4. Populate Project Cards
        const projectContainer = document.querySelector('.project-cards');
        if (projectContainer) {
            projectContainer.innerHTML = '';

            if (projects.length === 0) {
                projectContainer.innerHTML = '<p style="padding: 20px;">No projects registered under this user yet.</p>';
            } else {
                projects.forEach(project => {
                    const cardHTML = `
                        <div class="project-card">
                            <div class="project-title">
                                <h1>${project.project_title || 'Untitled Project'}</h1>
                            </div>
                            <div class="content">
                                <h2>${project.project_impact || '-'}</h2>
                                <p style="margin-top: 10px;"><strong>Project Savings:</strong> $${project.project_savings || 0}K / year</p>
                            </div>
                        </div>
                    `;
                    projectContainer.insertAdjacentHTML('beforeend', cardHTML);
                });
            }
        }

    // Hide spinner and show profile content smoothly
        if (spinner) spinner.style.display = 'none';
        if (content) content.style.display = 'block';

    } catch (error) {
        console.error("Error loading profile details:", error);
        if (spinner) spinner.innerHTML = '<p style="color: red;">Failed to load profile details.</p>';
    }
}

const backBtn = document.getElementById('back');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.history.back();
        // Alternatively, if you want it to go back to whatever page they came from (like Green Belts or Coaches), use this instead:
        // window.history.back();
    });
}