
document.addEventListener('DOMContentLoaded', () => {

    // The main container that will hold the scrolling items.
    const scrollContent = document.getElementById('scroll-content');

    /**
     * Generates the HTML for a single group of category items.
     * This function maps over the data to create the links.
     * @param {Array} categories - An array of category objects from the JSON file.
     * @param {boolean} isDuplicate - If true, adds aria-hidden to the group for accessibility.
     * @returns {string} - A string of HTML representing one complete category group.
     */
    const createCategoryGroupHtml = (categories, isDuplicate = false) => {
        // Create an HTML string for each category item
        const itemsHtml = categories.map(category => `
            <a href="${category.url}" class="category-item group flex items-center gap-2 sm:gap-3 px-3 py-2 hover:bg-[#FFFFFF] rounded-lg transition-all duration-200">
                <i class="${category.icon} text-lg sm:text-xl text-[#FFFFFF] group-hover:text-[#074ec2] transition-colors" aria-hidden="true"></i>
                <span class="text-sm sm:text-base text-[#FFFFFF] font-medium group-hover:text-[#074ec2] transition-colors">${category.name}</span>
            </a>
        `).join(''); // Join all item strings together

        const ariaHidden = isDuplicate ? 'aria-hidden="true"' : '';
        
        // Wrap the items in the group container div
        return `
            <div class="category-group flex items-center gap-x-6 sm:gap-x-8 px-4 whitespace-nowrap" ${ariaHidden}>
                ${itemsHtml}
            </div>
        `;
    };

    /**
     * Fetches category data from the JSON file and renders it into the DOM.
     * @param {string} url - The path to the JSON file.
     */
    const loadScrollingCategories = async (url) => {
        if (!scrollContent) {
            console.error('Error: The scroll content container was not found in the DOM.');
            return;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }
            const categories = await response.json();

            // Generate the HTML for both the original and the duplicated groups
            const originalGroup = createCategoryGroupHtml(categories, false);
            const duplicateGroup = createCategoryGroupHtml(categories, true); // Hidden from screen readers

            // Set the innerHTML of the container with both groups to enable the infinite scroll animation
            scrollContent.innerHTML = originalGroup + duplicateGroup;

        } catch (error) {
            console.error("Could not load scrolling categories:", error);
            // Display a user-friendly error message
            scrollContent.innerHTML = `<p class="text-center text-red-500 px-4">Error loading categories.</p>`;
        }
    };

    // --- Initial Load ---
    // Trigger the function to fetch and render the categories.
    // Ensure the path to your JSON file is correct.
    loadScrollingCategories('../data/scrollingCategories.json');
});