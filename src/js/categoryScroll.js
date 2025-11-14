document.addEventListener('DOMContentLoaded', () => {

    const scrollContent = document.getElementById('scroll-content');
    const itemModal = document.getElementById('item-modal'); // Get the modal element
    const itemModalTitle = document.getElementById('item-modal-title'); // Modal title
    const itemModalBody = document.getElementById('item-modal-body'); // Modal body for items
    const closeModalBtn = document.getElementById('close-modal-btn'); // Close button

    /**
     * Generates the HTML for a single group of category items.
     * This function maps over the data to create the links.
     * @param {Array} categories - An array of category objects from the JSON file.
     * @param {boolean} isDuplicate - If true, adds aria-hidden to the group for accessibility.
     * @returns {string} - A string of HTML representing one complete category group.
     */
    const createCategoryGroupHtml = (categories, isDuplicate = false) => {
        const itemsHtml = categories.map(category => `
            <a href="#" data-category="${category.name}" class="category-item group flex items-center gap-2 sm:gap-3 px-3 py-2 hover:bg-[#FFFFFF] rounded-lg transition-all duration-200">
                <i class="${category.icon} text-lg sm:text-xl text-[#FFFFFF] group-hover:text-[#074ec2] transition-colors" aria-hidden="true"></i>
                <span class="text-sm sm:text-base text-[#FFFFFF] font-medium group-hover:text-[#074ec2] transition-colors">${category.name}</span>
            </a>
        `).join('');

        const ariaHidden = isDuplicate ? 'aria-hidden="true"' : '';
        
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

            const originalGroup = createCategoryGroupHtml(categories, false);
            const duplicateGroup = createCategoryGroupHtml(categories, true);

            scrollContent.innerHTML = originalGroup + duplicateGroup;

            // Attach event listeners after content is loaded
            addCategoryClickListeners();

        } catch (error) {
            console.error("Could not load scrolling categories:", error);
            scrollContent.innerHTML = `<p class="text-center text-red-500 px-4">Error loading categories.</p>`;
        }
    };

    /**
     * Adds click event listeners to each category item.
     */
    const addCategoryClickListeners = () => {
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', async (event) => {
                event.preventDefault(); // Prevent default link behavior
                const categoryName = event.currentTarget.dataset.category;
                console.log(`Category clicked: ${categoryName}`);
                await openItemModal(categoryName);
            });
        });
    };

    /**
     * Fetches items based on category and displays them in a modal.
     * It now also filters out items with 0 stock.
     * @param {string} categoryName - The name of the category to filter items by.
     */
    const openItemModal = async (categoryName) => {
        itemModalTitle.textContent = `${categoryName} Products`;
        itemModalBody.innerHTML = '<p class="text-center text-gray-600">Loading items...</p>';
        
        // --- MODIFIED LINE ---
        itemModal.classList.remove('hidden'); // Remove 'hidden'
        itemModal.classList.add('flex');      // Add 'flex' to make it visible
        // ---------------------

        document.body.classList.add('overflow-hidden'); // Prevent background scrolling

        try {
            // Replace with the actual path to your items JSON file
            const response = await fetch('/src/data/Item.json'); 
            if (!response.ok) {
                throw new Error(`Failed to fetch items: ${response.status} ${response.statusText}`);
            }
            const allItems = await response.json();

            // First filter by category, then filter out items with 0 stock
            const filteredItems = allItems.filter(item => 
                item.category.name === categoryName && item.stock > 0
            );

            if (filteredItems.length > 0) {
                itemModalBody.innerHTML = filteredItems.map(item => `
                    <div class="p-4 border rounded-lg shadow-sm bg-white">
                        <img src="${item.images[0]}" alt="${item.name}" class="w-full h-30 object-cover rounded-md mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">${item.name}</h3>
                        <p class="text-[#074ec2] font-semibold">Price: ₱${item.price}</p>
                        <p class="text-gray-600 text-sm mt-2">${item.description}</p>
                        <p class="text-sm text-yellow-500">Rating: ${item.rate} (${item.review} reviews)</p>
                        <p class="text-sm text-gray-500">Stock: ${item.stock}</p>
                    </div>
                `).join('');
            } else {
                itemModalBody.innerHTML = `<p class="text-center text-gray-600">No available items found for ${categoryName}.</p>`;
            }

        } catch (error) {
            console.error("Could not load items for category:", error);
            itemModalBody.innerHTML = `<p class="text-center text-red-500">Error loading items.</p>`;
        }
    };

    /**
     * Closes the item modal.
     */
    const closeItemModal = () => {
        // --- MODIFIED LINE ---
        itemModal.classList.add('hidden');    // Add 'hidden' to hide it
        itemModal.classList.remove('flex');   // Remove 'flex'
        // ---------------------

        document.body.classList.remove('overflow-hidden'); // Restore background scrolling
    };

    // --- Event Listeners for Modal ---
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeItemModal);
    }

    // Close modal if clicking outside the content
    if (itemModal) {
        itemModal.addEventListener('click', (event) => {
            if (event.target === itemModal) {
                closeItemModal();
            }
        });
    }

    // --- Initial Load ---
    loadScrollingCategories('/src/data/scrollingCategories.json');
});