function showGallery(galleryId, button) {

    document.querySelectorAll('.bb-gallery').forEach(gallery => {
        gallery.classList.remove('active');
    });

    document.querySelectorAll('.site-selector button').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(galleryId).classList.add('active');

    button.classList.add('active');
}