document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(
    ".animate-fade-left, .animate-fade-right, .animate-fade-up, .animate-fade-down"
  );

  let lastScrollY = window.scrollY;

  const observer = new IntersectionObserver(
    (entries) => {
      const scrollingDown = window.scrollY > lastScrollY;
      lastScrollY = window.scrollY;

      entries.forEach((entry) => {
        if (entry.isIntersecting && scrollingDown) {
          // Play fade animation only when scrolling down
          entry.target.style.animation = "none";
          entry.target.offsetHeight; // trigger reflow
          entry.target.style.animation = "";

          if (entry.target.classList.contains("animate-fade-left")) {
            entry.target.style.animation = "fadeLeft 2s ease-out forwards";
          } else if (entry.target.classList.contains("animate-fade-right")) {
            entry.target.style.animation = "fadeRight 2s ease-out forwards";
          } else if (entry.target.classList.contains("animate-fade-up")) {
            entry.target.style.animation = "fadeUp 2s ease-out forwards";
          } else if (entry.target.classList.contains("animate-fade-down")) {
            entry.target.style.animation = "fadeDown 2s ease-out forwards";
          }
        }
      });
    },
    { threshold: 0.2 }
  );

  fadeElements.forEach((el) => observer.observe(el));
});
