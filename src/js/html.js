document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll("nav, section, footer"); // Kasama na ang navbar

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("opacity-100");
                    entry.target.classList.remove("opacity-0");
                } else {
                    entry.target.classList.add("opacity-0"); // Magiging invisible ulit kapag lumabas sa viewport
                }
            });
        },
        { threshold: 0.2 }
    );

    elements.forEach((element) => observer.observe(element));
});



    // Initialize Swiper
    const swiper = new Swiper('.hero-pc-swiper', {
        // Optional parameters
        loop: true, // Enables continuous loop mode
        autoplay: {
            delay: 3000, // Delay between transitions (in ms)
            disableOnInteraction: false, // Autoplay will not be disabled after user interactions (swipes)
        },
        effect: 'slide', // 'slide', 'fade', 'cube', 'coverflow', 'flip'
        grabCursor: true, // Shows a grab cursor when hovering over Swiper

        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true, // Allows clicking on pagination bullets to navigate
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Accessibility
        a11y: {
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
        },
    });

    // For the hero section fade-in
    window.addEventListener('load', () => {
        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
            heroSection.classList.remove('opacity-0');
            heroSection.classList.add('opacity-100');
        }
    });


