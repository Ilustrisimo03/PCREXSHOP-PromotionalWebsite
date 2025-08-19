document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element ---
    const categoryGrid = document.getElementById('category-grid');

    /**
     * Renders the product category cards into the grid.
     * @param {Array} productCategories - An array of category objects.
     */
    const renderCategoryCards = (productCategories) => {
        if (!categoryGrid) {
            console.error('Category grid container not found!');
            return;
        }

        // Generate HTML for each card and inject it into the grid.
        categoryGrid.innerHTML = productCategories.map(category => {
            const descriptionHtml = category.description
                ? `<p class="${category.colors.description || 'text-gray-200'} mt-2 text-sm max-w-[60%]">${category.description}</p>`
                : '';
            
            const titleColorClass = category.colors.title || '';

            return `
                <div class="${category.colors.bg} ${category.layout} rounded-xl overflow-hidden text-[#FAF5F1] group relative flex flex-col justify-between min-h-[280px] sm:min-h-[320px] shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <img src="${category.image}" alt="${category.alt}" class="${category.imageClasses} absolute transition-transform duration-300 z-10 drop-shadow-lg ${category.hoverEffect}">
                    <div class="p-6 sm:p-8 flex flex-col justify-between h-full z-0 relative">
                        <div>
                            <p class="text-sm font-semibold ${category.colors.subtitle} uppercase tracking-wider">${category.subtitle}</p>
                            <h3 class="text-2xl sm:text-3xl font-bold uppercase mt-1 heading ${titleColorClass}">${category.title}</h3>
                            ${descriptionHtml}
                        </div>
                        <a href="#" class="mt-6 bg-[#FAF5F1] ${category.colors.buttonText} px-5 py-2 rounded-md text-sm font-semibold ${category.colors.buttonHover} transition duration-150 ease-in-out self-start shadow-sm hover:shadow-md">Browse</a>
                    </div>
                </div>
            `;
        }).join('');
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
            const categories = await response.json();
            renderCategoryCards(categories);
        } catch (error) {
            console.error("Could not fetch or render product data:", error);
            // Optionally, display an error message to the user in the UI
            if (categoryGrid) {
                categoryGrid.innerHTML = `<p class="text-center text-red-500 col-span-full">Failed to load products. Please try again later.</p>`;
            }
        }
    };

    // --- Initial Load ---
    // Make sure the path to your components.json is correct
    loadProductData('../Components/ExploreProducts.json');
});