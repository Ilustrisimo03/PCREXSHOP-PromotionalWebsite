document.addEventListener("DOMContentLoaded", function () {
      const loader = document.getElementById('page-loader');
      
      // Select all links that don't start with '#' (for in-page anchors),
      // don't have a 'download' attribute, and are not just for javascript actions.
      const navLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([download]):not([href^="javascript:"])');

      navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
          // Get the destination URL
          const destination = this.href;

          // Check if the link is opening in a new tab
          if (this.target === '_blank' || e.ctrlKey || e.metaKey) {
            // If it's a new tab, don't show the loader, just let the browser do its thing.
            return;
          }
          
          // Prevent the browser from navigating immediately
          e.preventDefault();

          // Show the loader
          if(loader) {
            loader.classList.remove('hidden');
          }

          // Navigate to the new page after a short delay to allow the loader to be seen
          setTimeout(function () {
            window.location.href = destination;
          }, 200); // 200 milliseconds delay
        });
      });

      // Hide loader when the page is fully loaded or when navigating back/forward
      window.addEventListener('pageshow', function(event) {
        if (loader) {
          loader.classList.add('hidden');
        }
      });
    });