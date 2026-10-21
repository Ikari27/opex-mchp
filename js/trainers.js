function showGallery(galleryId, button) {

    document.querySelectorAll('.trainers-gallery').forEach(gallery => {
        gallery.classList.remove('active');
    });

    document.querySelectorAll('.site-selector button').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(galleryId).classList.add('active');

    button.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
    fetchTrainers();
});

async function fetchTrainers() {
    const spinner = document.getElementById('loadingSpinner');
    const content = document.getElementById('Content');

    try {
        const response = await fetch('/api/trainers');
        if (!response.ok) throw new Error("Failed to fetch Trainer list");

        const users = await response.json();

        // Target gallery containers
        const mphil1Container = document.querySelector('#mphil1 .trainerrow');
        const mphil3Container = document.querySelector('#mphil3 .trainerrow');

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
                <a href="profile.html?id=${user.id}" class="trainer-card-link" style="text-decoration: none; color: inherit;">
                    <div class="trainer-card">
                        <img src="${imgSrc}" alt="${fullName}">
                        <div class="trainer-caption">
                            <h2>${fullName}</h2>
                            <p class="trainer-position">${position}</p>
                            <p class="trainer-department">${department}</p>
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
        console.error("Error loading Trainer details:", error);
    } finally {
        // ALWAYS RUNS: Hides spinner and shows main gallery content seamlessly
        if (spinner) spinner.style.display = 'none';
        if (content) content.style.display = 'block';
    }
}