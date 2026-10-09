const dropdownLinks = document.querySelectorAll(".dp > a");
const navbar = document.querySelector(".navbar");

dropdownLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const currentMenu = this.nextElementSibling;

        document.querySelectorAll(".dp-list").forEach(menu => {
            if (menu !== currentMenu) {
                menu.classList.remove("show");
            }
        });

        currentMenu.classList.toggle("show");
    });
});

navbar.addEventListener("click", function (e) {
    if (!e.target.closest(".dp > a")) {
        document.querySelectorAll(".dp-list").forEach(menu => {
            menu.classList.remove("show");
        });
    }
});