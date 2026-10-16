function showSection(sectionId, menuItem) {

    // hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // show selected section
    document.getElementById(sectionId).style.display = 'block';

    // remove active from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // add active to clicked menu item
    menuItem.classList.add('active');
    
}