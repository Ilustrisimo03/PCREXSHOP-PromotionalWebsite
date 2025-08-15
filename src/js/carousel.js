// document.addEventListener('DOMContentLoaded', () => {
//   const carousel = document.getElementById('carousel');
//   // Kung walang carousel element, huwag nang ituloy para maiwasan ang errors.
//   if (!carousel) {
//     console.error("Carousel element with ID 'carousel' not found.");
//     return;
//   }

//   let scrollStep = 0;

//   // Function para kalkulahin ang tamang sukat ng pag-scroll.
//   const calculateScrollStep = () => {
//     // Siguraduhing mayroong hindi bababa sa dalawang imahe para masukat ang pagitan.
//     if (carousel.children.length > 1) {
//       const firstItem = carousel.children[0];
//       const secondItem = carousel.children[1];
      
//       // Ang pinakamabisang paraan para makuha ang scroll step ay ang pagsukat
//       // sa distansya mula sa simula ng una hanggang sa simula ng pangalawang item.
//       // Awtomatiko nitong isinasama ang lapad ng item at ang espasyo (gap) sa pagitan nila.
//       scrollStep = secondItem.offsetLeft - firstItem.offsetLeft;
//     } else if (carousel.children.length === 1) {
//       // Kung iisa lang ang imahe, ang scroll step ay ang lapad lang nito.
//       scrollStep = carousel.children[0].offsetWidth;
//     }
//   };

//   // Gamitin ang 'window.onload' para siguraduhing tapos nang mag-load ang lahat ng resources (kasama ang mga imahe)
//   // bago kalkulahin ang scroll step. Ito ay mas maaasahan kaysa sa `setTimeout`.
//   window.addEventListener('load', () => {
//     calculateScrollStep();

//     // Kalkulahin ulit kapag nagbago ang laki ng window para sa responsiveness.
//     window.addEventListener('resize', calculateScrollStep);
//   });

//   // Auto-scroll
//   setInterval(() => {
//     // Huwag mag-scroll kung ang scrollStep ay hindi pa nakakalkula (hal. hindi pa tapos mag-load ang mga imahe).
//     if (scrollStep <= 0) {
//       calculateScrollStep(); // Subukang kalkulahin ulit.
//       if (scrollStep <= 0) return; // Kung 0 pa rin, laktawan muna.
//     }

//     // Suriin kung ang kasalukuyang scroll position ay malapit na sa dulo.
//     // Ang `carousel.scrollWidth` ay ang kabuuang lapad ng lahat ng items.
//     // Ang `carousel.clientWidth` ay ang nakikitang lapad ng container.
//     // Nagdagdag ng 1px buffer para sa mga isyu sa rounding.
//     if (carousel.scrollLeft + carousel.clientWidth + 1 >= carousel.scrollWidth) {
//       // Kung nasa dulo na, bumalik sa simula nang smooth.
//       carousel.scrollTo({ left: 0, behavior: 'smooth' });
//     } else {
//       // Kung hindi pa, mag-scroll pasulong ng isang step.
//       carousel.scrollBy({ left: scrollStep, behavior: 'smooth' });
//     }
//   }, 3000); // Maaaring baguhin ang bilis ng interval kung kinakailangan.
// });



// document.addEventListener('DOMContentLoaded', () => {
//   const carousel = document.getElementById('carousel');
//   // Kung walang carousel, itigil ang script.
//   if (!carousel) {
//     console.error("Carousel element with ID 'carousel' not found.");
//     return;
//   }

//   const images = carousel.querySelectorAll('.carousel-image');
//   if (images.length === 0) {
//     return; // Walang imahe, walang gagawin.
//   }

//   let currentIndex = 0;

//   // Ipakita agad ang unang imahe pagka-load ng page.
//   images[currentIndex].classList.add('active');

//   // Function para palitan ang imahe.
//   const showNextImage = () => {
//     // Alisin ang 'active' class sa kasalukuyang imahe para mag-fade out ito.
//     images[currentIndex].classList.remove('active');

//     // Kalkulahin ang index ng susunod na imahe.
//     // Ang '%' (modulo) operator ay sinisigurong bumabalik sa 0 kapag nasa dulo na.
//     currentIndex = (currentIndex + 1) % images.length;

//     // Idagdag ang 'active' class sa susunod na imahe para mag-fade in ito.
//     images[currentIndex].classList.add('active');
//   };

//   // Ulitin ang pagpapalit ng imahe bawat 5 segundo (5000ms).
//   setInterval(showNextImage, 5000);
// });

 document.addEventListener('DOMContentLoaded', () => {
            const carousel = document.getElementById('carousel');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            
            // Since all images are the same size, we can get the width from the first one
            // We use clientWidth which includes padding but not borders/margins
            const imageWidth = carousel.clientWidth;

            let currentIndex = 0;
            let autoScrollInterval;

            // Function to go to the next slide
            const nextSlide = () => {
                // If at the last slide, loop back to the first, otherwise go to the next one
                currentIndex = (currentIndex + 1) % carousel.children.length;
                carousel.scrollTo({
                    left: currentIndex * imageWidth,
                    behavior: 'smooth'
                });
            };

            // Function to go to the previous slide
            const prevSlide = () => {
                // If at the first slide, loop to the last, otherwise go to the previous one
                currentIndex = (currentIndex - 1 + carousel.children.length) % carousel.children.length;
                 carousel.scrollTo({
                    left: currentIndex * imageWidth,
                    behavior: 'smooth'
                });
            };

            // Function to start the automatic scrolling
            const startAutoScroll = () => {
                // Set an interval to call nextSlide every 3000 milliseconds (3 seconds)
                autoScrollInterval = setInterval(nextSlide, 3000);
            };

            // Function to stop the automatic scrolling
            const stopAutoScroll = () => {
                clearInterval(autoScrollInterval);
            };

            // Event listeners for the navigation buttons
            nextBtn.addEventListener('click', () => {
                nextSlide();
                // When user clicks, reset the auto-scroll timer
                stopAutoScroll();
                startAutoScroll();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                // When user clicks, reset the auto-scroll timer
                stopAutoScroll();
                startAutoScroll();
            });

            // Pause auto-scrolling when the mouse is over the carousel
            carousel.addEventListener('mouseenter', stopAutoScroll);
            // Resume auto-scrolling when the mouse leaves the carousel
            carousel.addEventListener('mouseleave', startAutoScroll);

            // Also pause when hovering over the buttons themselves
            prevBtn.addEventListener('mouseenter', stopAutoScroll);
            nextBtn.addEventListener('mouseenter', stopAutoScroll);

            // A variable to prevent scroll event from firing too often
            let scrollTimeout;
            // Update current index when user scrolls manually (e.g., swiping)
            carousel.addEventListener('scroll', () => {
                // Clear the previous timeout to avoid unnecessary calculations
                clearTimeout(scrollTimeout);
                // Set a new timeout
                scrollTimeout = setTimeout(() => {
                    // Calculate the new index based on the scroll position
                    currentIndex = Math.round(carousel.scrollLeft / imageWidth);
                }, 100); // A small delay to wait for scroll to finish
            });

            // Kick off the auto-scrolling when the page loads
            startAutoScroll();
        });