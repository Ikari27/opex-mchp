function showGallery(galleryId, button) {

    document.querySelectorAll('.gb-gallery').forEach(gallery => {
        gallery.classList.remove('active');
    });

    document.querySelectorAll('.site-selector button').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(galleryId).classList.add('active');

    button.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
    fetchBlackbelts();
});

async function fetchBlackbelts() {
    const spinner = document.getElementById('loadingSpinner');
    const content = document.getElementById('Content');
    try {
        const response = await fetch('/api/greenbelts');
        const users = await response.json();

        // Target your gallery containers
        const mphil1Container = document.querySelector('#mphil1 .gbrow');
        const mphil3Container = document.querySelector('#mphil3 .gbrow');

        // Clear existing static placeholder cards if desired
        if (mphil1Container) mphil1Container.innerHTML = '';
        if (mphil3Container) mphil3Container.innerHTML = '';

        users.forEach(user => {
            // Determine image path (fallback to sample if profile_picture is missing)
            const imgSrc = user.profile_picture ? user.profile_picture : './assets/images/default.jpg';
            const fullName = `${user.firstname || ''} ${user.lastname || ''}`.trim();
            const position = user.position || '';
            const department = user.department || '';

            // Build the card markup matching your template
            const cardHTML = `
                <a href="profile.html?id=${user.id}" class="gb-card-link" style="text-decoration: none; color: inherit;">
                    <div class="gb-card">
                        <img src="${imgSrc}" alt="${fullName}">
                        <div class="gb-caption">
                            <h2>${fullName}</h2>
                            <p class="gb-position">${position}</p>
                            <p class="gb-department">${department}</p>
                        </div>
                    </div>
                </a>
            `;

            // Append to the correct container based on the user's site field in MySQL
            if (user.site === 'MPHIL1' && mphil1Container) {
                mphil1Container.insertAdjacentHTML('beforeend', cardHTML);
            } else if (user.site === 'MPHIL3' && mphil3Container) {
                mphil3Container.insertAdjacentHTML('beforeend', cardHTML);
            }
        });

    // Hide spinner and show profile content smoothly
        if (spinner) spinner.style.display = 'none';
        if (content) content.style.display = 'block';

    } catch (error) {
        console.error("Error loading profile details:", error);
        if (spinner) spinner.innerHTML = '<p style="color: red;">Failed to load profile details.</p>';
    }
}