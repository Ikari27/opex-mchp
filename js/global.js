
// ==========================================================
// Check general login status to toggle Login/Logout buttons
// ==========================================================

fetch("/api/user")
    .then(res => res.json())
    .then(data => {
        const loginItem = document.getElementById("login");
        const logoutItem = document.getElementById("logout");
        const helloItem = document.getElementById("hello");
        const adminItem = document.getElementById("admin");

        if (data.loggedIn) {
            // If logged in, hide Login and Register, show Logout
            if (loginItem) loginItem.style.display = "none";
            if (helloItem) helloItem.style.display = "block";
            if (adminItem) helloItem.style.display = "block";
            if (logoutItem) logoutItem.style.display = "block";

            if (data.user && data.user.role === 'admin') {
                if (adminItem) adminItem.style.display = "block"; // Show admin elements
            } else {
                if (adminItem) adminItem.style.display = "none";  // Hide admin elements for regular members
            }
        } else {
            // If NOT logged in, show Login and Register, hide Logout
            if (loginItem) loginItem.style.display = "block";
            if (helloItem) helloItem.style.display = "none";
            if (adminItem) adminItem.style.display = "none";
            if (logoutItem) logoutItem.style.display = "none";
        }
    })
    .catch(error => console.error("Error fetching user session:", error));

// ==================================================================
// Fetch and display logged-in user's first name (Admin or Non-Admin)
// ==================================================================

document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/user')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn && data.user && data.user.firstname) {
                // Selects all elements with the class 'firstname' and updates them
                const nameElements = document.querySelectorAll('.firstname');
                nameElements.forEach(el => {
                    el.textContent = data.user.firstname;
                });
            }
        })
        .catch(error => console.error('Error fetching user data:', error));
});

// =============
// TEXT EDITOR
// =============

let originalData = {};
            // Fetch all content and user session status simultaneously
            Promise.all([
                fetch('/api/all-content').then(res => res.json()),
                fetch('/api/user').then(res => res.json())
            ])
            .then(([contentMap, userData]) => {
                originalData = contentMap;
                const editables = document.querySelectorAll('.editable');

                editables.forEach(el => {
                    const id = el.getAttribute('data-id');

                    // If database already has content for this ID, load it
                    if (contentMap[id] !== undefined) {
                        el.innerHTML = contentMap[id];
                    } 
                    // If missing from DB, auto-create it using the HTML text
                    else {
                        const initialText = el.innerHTML.trim();
                        fetch('/api/content/create-specific', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: id, content: initialText })
                        })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                originalData[id] = initialText;
                            }
                        })
                        .catch(err => console.error(`Error auto-creating row ${id}:`, err));
                    }
                });

                // If logged in as admin, unlock editing capabilities
                if (userData.loggedIn && userData.user.role === 'admin') {
                    editables.forEach(el => {
                        el.setAttribute('contenteditable', 'true');
                        el.style.border = '1px dashed #007bff';
                        el.style.padding = '4px';
                    });

                    document.getElementById('editor-bar').style.display = 'block';
                    document.getElementById('editor-toolbar').style.display = 'block';
                    document.getElementById('save-btn').style.display = 'inline-block';
                    document.getElementById('cancel-btn').style.display = 'inline-block';
                }
            })
            .catch(err => console.error("Initialization Error:", err));

            function formatText(command, value = null) {
                document.execCommand(command, false, value);
            }

            function cancelChanges() {
                document.querySelectorAll('.editable').forEach(el => {
                    const id = el.getAttribute('data-id');
                    if (originalData[id] !== undefined) {
                        el.innerHTML = originalData[id];
                    }
                });
                const status = document.getElementById('status-msg');
                status.textContent = "Changes discarded.";
                status.style.color = "orange";
                setTimeout(() => status.textContent = "", 3000);
            }

            function saveAllChanges() {
                const editables = document.querySelectorAll('.editable');
                let promises = [];

                editables.forEach(el => {
                    const id = el.getAttribute('data-id');
                    const content = el.innerHTML;

                    promises.push(
                        fetch('/api/content/update', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id, content })
                        }).then(res => res.json())
                    );
                });

                Promise.all(promises)
                    .then(results => {
                        const status = document.getElementById('status-msg');
                        if (results.every(r => r.success)) {
                            editables.forEach(el => {
                                originalData[el.getAttribute('data-id')] = el.innerHTML;
                            });
                            status.textContent = "All changes saved successfully!";
                            status.style.color = "green";
                        } else {
                            status.textContent = "Some changes failed to save.";
                            status.style.color = "red";
                        }
                        setTimeout(() => status.textContent = "", 3000);
                    })
                    .catch(err => {
                        console.error(err);
                        const status = document.getElementById('status-msg');
                        status.textContent = "Network error!";
                        status.style.color = "red";
                    });
            }

//=====================
// IMAGE/VIDEO EDITOR
// ====================

// Load content from database on page load
fetch('/api/all-content')
    .then(res => res.json())
    .then(contentMap => {
        // Handle images
        document.querySelectorAll('.editable-img').forEach(img => {
            const id = img.getAttribute('data-id');
            if (contentMap[id] !== undefined && contentMap[id].trim() !== "") {
                let dbPath = contentMap[id];
                if (dbPath.startsWith('.')) dbPath = dbPath.substring(1);
                img.src = dbPath;
            }
        });

        // Handle videos
        document.querySelectorAll('.editable-video').forEach(vid => {
            const id = vid.getAttribute('data-id');
            if (contentMap[id] !== undefined && contentMap[id].trim() !== "") {
                let dbPath = contentMap[id];
                if (dbPath.startsWith('.')) dbPath = dbPath.substring(1);
                vid.src = dbPath;
                vid.load(); // Force video element to reload source
            }
        });
    });

// Enable click-to-upload for admins
fetch('/api/user').then(res => res.json()).then(userData => {
    if (userData.loggedIn && userData.user.role === 'admin') {
        // Setup images
        document.querySelectorAll('.editable-img').forEach(img => {
            const id = img.getAttribute('data-id');
            img.style.cursor = 'pointer';
            img.style.border = '2px dashed #007bff';
            img.title = "Click to change image";
            img.onclick = () => document.getElementById(`image-file-input-${id}`).click();
        });

        // Setup videos
        document.querySelectorAll('.editable-video').forEach(vid => {
            const id = vid.getAttribute('data-id');
            vid.style.cursor = 'pointer';
            vid.style.border = '2px dashed #007bff';
            vid.title = "Click to change video";
            vid.onclick = () => document.getElementById(`image-file-input-${id}`).click();
        });
    }
});

// Reusable upload function for both images and videos
function uploadImage(id, inputElement) {
    if (inputElement.files && inputElement.files[0]) {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('imageFile', inputElement.files[0]);

        fetch('/api/content/upload-image', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                let webPath = data.filePath;
                if (webPath.startsWith('.')) webPath = webPath.substring(1);

                // Check if target is an image or a video and update accordingly
                const targetElement = document.querySelector(`[data-id="${id}"]`);
                if (targetElement) {
                    if (targetElement.tagName.toLowerCase() === 'video') {
                        targetElement.src = webPath + "?" + new Date().getTime();
                        targetElement.load();
                        targetElement.play();
                    } else {
                        targetElement.src = webPath + "?" + new Date().getTime();
                    }
                }
                
                const status = document.getElementById('status-msg');
                status.textContent = "Media updated successfully!";
                status.style.color = "green";
                setTimeout(() => status.textContent = "", 3000);
            } else {
                alert("Failed to upload file.");
            }
        })
        .catch(err => console.error("Upload error:", err));
    }
}