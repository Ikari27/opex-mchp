document.querySelectorAll(".bubble").forEach(bubble => {
    const count = Number(
        bubble.querySelector(".context p").textContent
    );

    const diameter = 115 * Math.sqrt(count);

    bubble.style.width = `${diameter}px`;
    bubble.style.height = `${diameter}px`;
});
``