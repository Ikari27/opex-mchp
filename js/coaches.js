// State variables to track active selections
let currentSite = 'mphil1';
let currentTeam = 'lss';

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
            
            // Normalize lss_pdca value from database (e.g., 'PDCA' -> 'pdca', 'LSS' -> 'lss')
            const lssPdca = (user.lss_pdca || '').toLowerCase().trim();

            // 2. Build Card Markup with data-team attribute included
            const cardHTML = `
                <a href="trainer_profile.html?id=${user.id}" class="coach-card-link" data-team="${lssPdca}" style="text-decoration: none; color: inherit;">
                    <div class="coach-card">
                        <img src="${imgSrc}" alt="${fullName}">
                        <div class="coach-caption">
                            <h2>${fullName}</h2>
                            <p class="coach-position">${position}</p>
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

        // Run initial filter after inserting cards
        filterCoaches();

    } catch (error) {
        console.error("Error loading Coach details:", error);
    } finally {
        // Hides spinner and shows main gallery content seamlessly
        if (spinner) spinner.style.display = 'none';
        if (content) content.style.display = 'block';
    }
}

// 4. Handle button clicks for site and team selection
function showGallery(type, element) {
    // Check if site button was clicked
    if (type === 'mphil1' || type === 'mphil3') {
        currentSite = type;

        // Update active class for site buttons
        const siteButtons = document.querySelectorAll('.site-selector button');
        siteButtons.forEach(btn => btn.classList.remove('active'));
        element.classList.add('active');

        // Switch visible gallery view container
        const galleries = document.querySelectorAll('.coaches-gallery');
        galleries.forEach(gallery => gallery.classList.remove('active'));
        
        const targetGallery = document.getElementById(type);
        if (targetGallery) {
            targetGallery.classList.add('active');
        }
    }
    // Check if team button was clicked (lss or pdca)
    else if (type === 'lss' || type === 'pdca') {
        currentTeam = type;

        // Update active class for team buttons
        const teamButtons = document.querySelectorAll('.team-selector button');
        teamButtons.forEach(btn => btn.classList.remove('active'));
        element.classList.add('active');
    }

    // Apply the filter visually
    filterCoaches();
}

// 5. Core filter logic to show/hide trainer cards
function filterCoaches() {
    const activeGallery = document.querySelector('.coaches-gallery.active');
    if (!activeGallery) return;

    // Target the card links containing the data-team attribute
    const trainerCards = activeGallery.querySelectorAll('.coach-card-link');

    trainerCards.forEach(card => {
        const cardTeam = card.getAttribute('data-team');

        if (cardTeam === currentTeam) {
            card.style.display = 'block'; // Show if it matches active lss/pdca
        } else {
            card.style.display = 'none';  // Hide otherwise
        }
    });
}