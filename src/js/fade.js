

document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(
    ".animate-fade-left, .animate-fade-right, .animate-fade-up, .animate-fade-down"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Restart animation
          entry.target.style.animation = "none";
          entry.target.offsetHeight; // Trigger reflow
          entry.target.style.animation = "";

          // Add the correct animation again
          if (entry.target.classList.contains("animate-fade-left")) {
            entry.target.style.animation = "fadeLeft 1s ease-out forwards";
          } else if (entry.target.classList.contains("animate-fade-right")) {
            entry.target.style.animation = "fadeRight 1s ease-out forwards";
          } else if (entry.target.classList.contains("animate-fade-up")) {
            entry.target.style.animation = "fadeUp 1s ease-out forwards";
          } else if (entry.target.classList.contains("animate-fade-down")) {
            entry.target.style.animation = "fadeDown 1s ease-out forwards";
          }
        } else {
          // Optional: hide again when scrolled out
          entry.target.style.opacity = 0;
        }
      });
    },
    { threshold: 0.2 } // Trigger when 20% of the element is visible
  );

  fadeElements.forEach((el) => observer.observe(el));
});
