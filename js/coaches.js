function showGallery(galleryId, button) {

    document.querySelectorAll('.coaches-gallery').forEach(gallery => {
        gallery.classList.remove('active');
    });

    document.querySelectorAll('.site-selector button').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(galleryId).classList.add('active');

    button.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
    fetchCoaches();
});

async function fetchCoaches() {
    const spinner = document.getElementById('loadingSpinner');
    const content = document.getElementById('Content');

    try {
        const response = await fetch('/api/coaches');
        if (!response.ok) throw new Error("Failed to fetch Coach list");

        const users = await response.json();

        // Target gallery containers
        const mphil1Container = document.querySelector('#mphil1 .coachrow');
        const mphil3Container = document.querySelector('#mphil3 .coachrow');

        // Clear existing static placeholder cards
        if (mphil1Container) mphil1Container.innerHTML = '';
        if (mphil3Container) mphil3Container.innerHTML = '';

        users.forEach(user => {
            // 1. Safe Image Path Resolution
            let imgSrc = './assets/images/default.jpg';
            if (user.profile_picture && user.profile_picture.trim() !== '') {
                imgSrc = user.profile_picture.trim();
                if (imgSrc.startsWith('.')) {
                    imgSrc = imgSrc.substring(1);
                }
                if (!imgSrc.startsWith('/')) {
                    imgSrc = '/' + imgSrc;
                }
            }

            const fullName = `${user.nickname || user.firstname || ''} ${user.lastname || ''}`.trim();
            const position = user.position || '';
            const department = user.department || '';

            // 2. Build Card Markup
            const cardHTML = `
                <a href="profile.html?id=${user.id}" class="coach-card-link" style="text-decoration: none; color: inherit;">
                    <div class="coach-card">
                        <img src="${imgSrc}" alt="${fullName}">
                        <div class="coach-caption">
                            <h2>${fullName}</h2>
                            <p class="coach-position">${position}</p>
                            <p class="coach-department">${department}</p>
                        </div>
                    </div>
                </a>
            `;

            // 3. Robust Site Filter (Handles case sensitivity & extra spaces)
            const site = (user.site || '').toUpperCase().trim();

            if (site === 'MPHIL1' && mphil1Container) {
                mphil1Container.insertAdjacentHTML('beforeend', cardHTML);
            } else if (site === 'MPHIL3' && mphil3Container) {
                mphil3Container.insertAdjacentHTML('beforeend', cardHTML);
            }
        });

    } catch (error) {
        console.error("Error loading Coach details:", error);
    } finally {
        // ALWAYS RUNS: Hides spinner and shows main gallery content seamlessly
        if (spinner) spinner.style.display = 'none';
        if (content) content.style.display = 'block';
    }
}