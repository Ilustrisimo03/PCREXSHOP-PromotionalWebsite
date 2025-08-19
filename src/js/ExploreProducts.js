// --- DOM Element ---
const galleryGrid = document.getElementById('gallery-grid');

/**
 * Renders the product gallery cards into the grid.
 * @param {Array} products - An array of product objects from the JSON file.
 */
const renderGalleryCards = (products) => {
    if (!galleryGrid) {
        console.error('Gallery grid container not found!');
        return;
    }

    // Generate HTML for each card using the new image-centric template.
    galleryGrid.innerHTML = products.map(product => `
   <div class="group relative rounded-2xl overflow-hidden shadow-lg h-80 sm:h-96 cursor-pointer" style="background-color: ${product.color};">
    <!-- Background Image -->
   <img src="${product.image}" alt="${product.alt}"
     class="absolute inset-0 w-3/4 h-3/4 object-contain m-auto transition-transform duration-500 ease-in-out group-hover:scale-105">

    <!-- Semi-transparent overlay on hover (no gradient) -->
    <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    <!-- Floating Text -->
    <div class="absolute bottom-0 left-0 right-0 p-6
                transform translate-y-6 opacity-0
                group-hover:translate-y-0 group-hover:opacity-100
                transition-all duration-500 ease-out">
        <h3 class="text-2xl font-bold tracking-tight text-[#FFFFFF] bg-[#E31C25] backdrop-blur-sm rounded-lg px-3 py-1 inline-block shadow-md">
            ${product.title}
        </h3>
        <p class="mt-2 text-base text-[#ebebeb] bg-[#E31C25] backdrop-blur-sm rounded-md px-2 py-1 inline-block shadow">
            ${product.subtitle}
        </p>
    </div>

    <!-- Hover border highlight -->
    <div class="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-red-500 transition duration-300 pointer-events-none"></div>
</div>
    `).join('');
};

/**
 * Fetches product data from a JSON file and initiates rendering.
 * @param {string} url - The URL of the JSON file.
 */
const loadProductData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const productsData = await response.json();
        renderGalleryCards(productsData);
    } catch (error) {
        console.error("Could not fetch or render product data:", error);
        if (galleryGrid) {
            galleryGrid.innerHTML = `<p class="text-center text-red-400 col-span-full">Failed to load products. Please try again later.</p>`;
        }
    }
};

// --- Initial Load ---
// Ensure the path points to your new JSON file.
loadProductData('../data/ExploreProducts.json');