document.addEventListener('DOMContentLoaded', () => {

    const carouselTrack = document.querySelector('.carousel-track');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentIndex = 0;
    let slides = [];
    let dots = [];
    let slideCount = 0;
    const scrollInterval = 3000; // 3 seconds
    let autoScrollTimer;
    let isTransitioning = false; // To prevent rapid clicks during animation

    /**
     * Fetches carousel data and initializes the carousel.
     */
    async function initializeCarousel() {
        try {
            const response = await fetch('../data/BannerSlider.json'); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const imageData = await response.json();
            setupCarousel(imageData);
        } catch (error) {
            console.error("Could not fetch carousel data:", error);
            carouselTrack.innerHTML = '<p class="text-center p-4 text-red-600">Error loading images.</p>';
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
            slide.className = 'carousel-slide flex-none w-full'; 
            slide.innerHTML = `<img class="carousel-image w-full h-full object-cover rounded-xl" src="${image.src}" alt="${image.alt}">`;
            carouselTrack.appendChild(slide);

            // Create dots
            const dot = document.createElement('button');
            dot.className = 'carousel-dot w-3 h-3 rounded-full bg-white bg-opacity-50 cursor-pointer transition-colors duration-300 hover:bg-opacity-80'; 
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
        });

        // For seamless infinite scroll, clone the first and last slides
        const firstSlide = carouselTrack.firstElementChild.cloneNode(true);
        const lastSlide = carouselTrack.lastElementChild.cloneNode(true);
        carouselTrack.appendChild(firstSlide); // Append clone of first to the end
        carouselTrack.prepend(lastSlide); // Prepend clone of last to the beginning

        slides = Array.from(carouselTrack.children);
        // Set initial position to the actual first slide (after the prepended clone)
        currentIndex = 1; 
        carouselTrack.style.transition = 'none'; // Disable transition for initial positioning
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        // Re-enable transition after a small delay
        setTimeout(() => {
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        }, 50);

        dots = Array.from(dotsContainer.children);
        
        updateDots();
        startAutoScroll();

        // Event listeners
        const carouselWrapper = document.querySelector('.carousel-container'); 
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
            carouselWrapper.addEventListener('mouseleave', startAutoScroll);
        } else {
            console.warn("Carousel wrapper not found for mouse events.");
        }

        // Event delegation for dot clicks
        dotsContainer.addEventListener('click', (e) => {
            const targetDot = e.target.closest('.carousel-dot');
            if (!targetDot || isTransitioning) return;

            const targetIndex = parseInt(targetDot.dataset.index) + 1; // Adjust for cloned slide at start
            moveToSlide(targetIndex);
        });

        // Navigation button listeners
        prevBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            moveToPrevSlide();
        });

        nextBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            moveToNextSlide();
        });

        // Listen for end of transition
        carouselTrack.addEventListener('transitionend', () => {
            isTransitioning = false;
            // Handle infinite loop for the clones
            if (currentIndex === slides.length - 1) { // If at the cloned first slide
                carouselTrack.style.transition = 'none';
                currentIndex = 1; // Jump to the actual first slide
                carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            } else if (currentIndex === 0) { // If at the cloned last slide
                carouselTrack.style.transition = 'none';
                currentIndex = slideCount; // Jump to the actual last slide
                carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
            // Re-enable transition after a very short delay to ensure it applies for next movement
            setTimeout(() => {
                carouselTrack.style.transition = 'transform 0.5s ease-in-out';
            }, 50);

            updateDots();
        });
    }

    /**
     * Moves the carousel to a specific slide index.
     * @param {number} targetIndex - The index of the slide to move to (adjusted for clones).
     */
    function moveToSlide(targetIndex) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = targetIndex;
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        stopAutoScroll();
        startAutoScroll();
    }
    
    /**
     * Moves the carousel to the next slide.
     */
    function moveToNextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        stopAutoScroll();
        startAutoScroll();
    }

    /**
     * Moves the carousel to the previous slide.
     */
    function moveToPrevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        stopAutoScroll();
        startAutoScroll();
    }

    /**
     * Updates the active state of the dot indicators.
     */
    function updateDots() {
        // Adjust activeIndex to account for the cloned slides at the start and end
        const activeIndex = (currentIndex - 1 + slideCount) % slideCount; 
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active'); // Custom class for active dot color
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