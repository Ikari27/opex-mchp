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
        const user = data.user || {};
        const trainings = data.trainings || [];
        const totals = data.totals || { hrs: 0 };

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

        // 3. Populate Training Hours
        const hrsElem = document.getElementById('viewHrs');
        if (hrsElem) {
            const totalHours = totals.hrs || 0;
            hrsElem.textContent = `${Number(totalHours).toLocaleString()} Hrs`;
        }

        // 4. Populate Training Cards
        const trainingContainer = document.querySelector('.training-cards');
        if (trainingContainer) {
            trainingContainer.innerHTML = '';

            if (trainings.length === 0) {
                trainingContainer.innerHTML = '<p style="padding: 20px;">No Trainings registered under this user yet.</p>';
            } else {
                trainings.forEach(training => {
                    const cardHTML = `
                        <div class="training-card">
                            <div class="training-title">
                                <h1>${training.training || 'Untitled Training'}</h1>
                            </div>
                        </div>
                    `;
                    trainingContainer.insertAdjacentHTML('beforeend', cardHTML);
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

// Back Button Handler
const backBtn = document.getElementById('back');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.history.back();
    });
}