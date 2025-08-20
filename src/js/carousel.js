document.addEventListener('DOMContentLoaded', () => {

    const carouselTrack = document.querySelector('.carousel-track');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    let slides = [];
    let dots = [];
    let slideCount = 0;
    const scrollInterval = 3000; // 3 seconds
    let autoScrollTimer;

    /**
     * Fetches carousel data and initializes the carousel.
     */
    async function initializeCarousel() {
        try {
            const response = await fetch('../data/Carousel.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const imageData = await response.json();
            setupCarousel(imageData);
        } catch (error) {
            console.error("Could not fetch carousel data:", error);
            carouselTrack.innerHTML = '<p>Error loading images.</p>';
        }
    }

    /**
     * Populates the carousel with images and dots, and sets up for infinite scroll.
     * @param {Array} images - Array of image objects from JSON.
     */
    function setupCarousel(images) {
        if (!images || images.length === 0) return;

        slideCount = images.length;

        // Create slides
        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `<img class="carousel-image" src="${image.src}" alt="${image.alt}">`;
            carouselTrack.appendChild(slide);

            // Create dots
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
        });

        // For seamless infinite scroll, clone the first slide and append it
        const firstSlideClone = carouselTrack.firstElementChild.cloneNode(true);
        carouselTrack.appendChild(firstSlideClone);

        slides = Array.from(carouselTrack.children);
        dots = Array.from(dotsContainer.children);
        
        updateDots();
        startAutoScroll();

        // Event listeners
        const container = document.querySelector('.carousel-container');
        container.addEventListener('mouseenter', stopAutoScroll);
        container.addEventListener('mouseleave', startAutoScroll);

        // Event delegation for dot clicks for better performance
        dotsContainer.addEventListener('click', (e) => {
            const targetDot = e.target.closest('.carousel-dot');
            if (!targetDot) return;

            const targetIndex = parseInt(targetDot.dataset.index);
            moveToSlide(targetIndex);
        });
    }

    /**
     * Moves the carousel to a specific slide index.
     * @param {number} targetIndex - The index of the slide to move to.
     */
    function moveToSlide(targetIndex) {
        currentIndex = targetIndex;
        carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
        
        // Reset auto-scroll timer after manual navigation
        stopAutoScroll();
        startAutoScroll();
    }
    
    /**
     * Moves the carousel to the next slide.
     */
    function moveToNextSlide() {
        currentIndex++;
        
        carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        // If we are at the cloned slide, reset to the beginning without animation
        if (currentIndex === slideCount) {
            setTimeout(() => {
                carouselTrack.style.transition = 'none';
                currentIndex = 0;
                carouselTrack.style.transform = `translateX(0%)`;
            }, 500); // Must match the transition duration
        }
        
        updateDots();
    }

    /**
     * Updates the active state of the dot indicators.
     */
    function updateDots() {
        const activeIndex = currentIndex % slideCount; // Use modulo to handle the cloned slide
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    /**
     * Starts the automatic scrolling interval.
     */
    function startAutoScroll() {
        if (autoScrollTimer) clearInterval(autoScrollTimer);
        autoScrollTimer = setInterval(moveToNextSlide, scrollInterval);
    }

    /**
     * Stops the automatic scrolling.
     */
    function stopAutoScroll() {
        clearInterval(autoScrollTimer);
    }

    // Start the process
    initializeCarousel();
});