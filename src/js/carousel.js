const carousel = document.getElementById('carousel');
let scrollAmount = 0;
let scrollStep = 300; // Default scroll step

function calculateScrollStep() {
  if (carousel && carousel.children.length > 0) {
    const firstImage = carousel.querySelector('img');
    if (firstImage) {
      const imageWidth = firstImage.offsetWidth;
      // Get gap from space-x-4 (which is 1rem = 16px by default)
      // This is a common way, but for more precision, you could inspect computed style if needed.
      const gap = 16; // Assuming 1rem for space-x-4
      scrollStep = imageWidth + gap;

      // Ensure carousel is wide enough to avoid issues if only one image is less wide than container
      // This can be complex with responsive image widths, so we'll stick to a calculated step
      // and ensure enough images are present.
    }
  }
}

// Calculate initial scroll step
// Use a small delay to allow images to render and get correct offsetWidth
setTimeout(calculateScrollStep, 100);
// Recalculate on resize for responsiveness
window.addEventListener('resize', () => {
  setTimeout(calculateScrollStep, 100); // Recalculate after resize debounce
});


// Auto scroll
if (carousel) {
  setInterval(() => {
    // If near the end, scroll to beginning
    // Add a buffer (e.g., scrollStep / 2) to avoid getting stuck if scrollWidth is not an exact multiple
    if (carousel.scrollLeft + carousel.offsetWidth + (scrollStep / 2) >= carousel.scrollWidth) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      // Otherwise, scroll by the calculated step
      carousel.scrollBy({ left: scrollStep, behavior: 'smooth' });
    }
  }, 3000); // Adjust interval as needed
}