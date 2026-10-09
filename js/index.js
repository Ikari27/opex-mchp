const slides = document.querySelectorAll(".slide");
const indicators = document.querySelectorAll(".indicators button");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let currentSlide = 0;

function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove("active"));
    indicators.forEach(btn => btn.classList.remove("active"));

    // Add active class to current slide and indicator
    slides[index].classList.add("active");
    indicators[index].classList.add("active");

    currentSlide = index;
}

//button functions
function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
}

function prevSlide() {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
}

// Button clicks
nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// Indicator clicks
indicators.forEach((button, index) => {
button.addEventListener("click", () => {
showSlide(index);
});
});

//reset timer
let autoSlide = setInterval(nextSlide, 6000);

function resetTimer() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 6000);
}

nextBtn.addEventListener("click", () => {
    nextSlide();
    resetTimer();
});

prevBtn.addEventListener("click", () => {
    prevSlide();
    resetTimer();
});