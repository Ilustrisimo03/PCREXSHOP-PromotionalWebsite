document.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("page-loader");

  // Select all valid navigation links
  const navLinks = document.querySelectorAll(
    'a[href]:not([href^="#"]):not([download]):not([href^="javascript:"])'
  );

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const destination = this.href;

      // If opening in new tab, do nothing
      if (this.target === "_blank" || e.ctrlKey || e.metaKey) return;

      // Prevent immediate navigation
      e.preventDefault();

      // Show loader (remove hidden, add flex)
      if (loader) {
        loader.classList.remove("hidden");
        loader.classList.add("flex");
      }

      // Navigate after short delay
      setTimeout(function () {
        window.location.href = destination;
      }, 300);
    });
  });

  // Hide loader when page finishes loading or when using back/forward
  window.addEventListener("pageshow", function () {
    if (loader) {
      loader.classList.add("hidden");
      loader.classList.remove("flex");
    }
  });
});
