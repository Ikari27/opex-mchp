function showGallery(galleryId, button) {
    document.querySelectorAll('.bb-gallery').forEach(gallery => {
        gallery.classList.remove('active');
    });

    document.querySelectorAll('.site-selector button').forEach(btn => {
        btn.classList.remove('active');
    });

    const targetGallery = document.getElementById(galleryId);
    if (targetGallery) targetGallery.classList.add('active');

    if (button) button.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
    fetchBlackbelts();
});

async function fetchBlackbelts() {
    const spinner = document.getElementById('loadingSpinner');
    const content = document.getElementById('Content');

    try {
        const response = await fetch('/api/blackbelts');
        if (!response.ok) throw new Error("Failed to fetch Black Belt list");

        const users = await response.json();

        // Target gallery containers
        const mphil1Container = document.querySelector('#mphil1 .bbrow');
        const mphil3Container = document.querySelector('#mphil3 .bbrow');

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
                <a href="profile.html?id=${user.id}" class="bb-card-link" style="text-decoration: none; color: inherit;">
                    <div class="bb-card">
                        <img src="${imgSrc}" alt="${fullName}">
                        <div class="bb-caption">
                            <h2>${fullName}</h2>
                            <p class="bb-position">${position}</p>
                            <p class="bb-department">${department}</p>
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
        console.error("Error loading Black Belt details:", error);
    } finally {
        // ALWAYS RUNS: Hides spinner and shows main gallery content seamlessly
        if (spinner) spinner.style.display = 'none';
        if (content) content.style.display = 'block';
    }
}