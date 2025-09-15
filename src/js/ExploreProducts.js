document.addEventListener('DOMContentLoaded', () => {

  const galleryGrid = document.getElementById('ExploreProducts-grid');
  const modal = document.getElementById('productModal');
  const closeModalBtn = document.getElementById('closeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  const cardLayouts = [
    "sm:col-span-2 sm:row-span-1 h-72",
    "sm:col-span-1 sm:row-span-1 h-72",
    "sm:col-span-1 sm:row-span-1 h-72",
    "sm:col-span-1 sm:row-span-1 h-72",
    "sm:col-span-1 sm:row-span-1 h-72",
    "sm:col-span-2 sm:row-span-1 h-72",
  ];

  let allItems = [];

  const renderGalleryCards = (products) => {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = products.map((product, index) => {
      // Logic para sa special image sizes
      const isSpecialImage = product.title === "Processors" || product.title === "Memory (RAM)";
      const imageContainerClasses = isSpecialImage ? "absolute -right-2 bottom-0" : "absolute right-4 bottom-0 w-40 h-40 sm:w-52 sm:h-52";
      const imageTagClasses = isSpecialImage ? "object-contain w-60 h-60" : "object-contain w-full h-full";
      return `
        <div class="relative rounded-2xl p-6 flex flex-col justify-between shadow-lg overflow-hidden
                    transition-transform duration-300 hover:scale-[1.03] ${cardLayouts[index % cardLayouts.length]}"
             style="background-color: ${product.color};">
          <div class="relative z-10 text-white">
            <h3 class="text-3xl font-extrabold">${product.title}</h3>
            <p class="text-white/90 mt-1 max-w-xs">${product.subtitle}</p>
          </div>
          <div class="${imageContainerClasses}">
            <img src="${product.image}" alt="${product.alt}" class="${imageTagClasses} drop-shadow-2xl">
          </div>
          <button data-title="${product.title}" data-color="${product.color}" class="explore-btn relative z-10 mt-auto w-fit px-4 py-2 bg-white text-gray-800 text-sm font-semibold rounded-lg shadow hover:bg-gray-100 transition">
            Explore
          </button>
        </div>
      `;
    }).join('');
    addEventListenersToButtons();
    // Gawing visible ang section pagkatapos ma-render ang content
    document.getElementById('ExploreProducts').classList.remove('opacity-0');
  };

  const openModal = (title, color) => {
    modalTitle.textContent = `${title} Showcase`;

    let itemType = title;
    // Mapping logic para i-match ang title sa 'type' sa Item.json
    if (title === "Processors") itemType = "Processor";
    else if (title === "Graphics Cards") itemType = "Graphics Card";
    else if (title === "CPU Coolings") itemType = "CPU Cooling";
    else if (title === "Power Supplies") itemType = "Power Supply";
    else if (title === "Storage Drives") itemType = "Storage (HDD / SSD)";
    else if (title === "Motherboards") itemType = "Motherboard";
    else if (title === "Memory (RAM)") itemType = "Memory (RAM)";

    const filteredItems = allItems.filter(item => item.type === itemType);

    // I-reset ang class ng modalBody bago magdagdag ng content
    modalBody.className = 'overflow-y-auto p-6 md:p-8 space-y-6'; // Ibinalik ang space-y-6

    if (filteredItems.length > 0) {
      modalBody.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${filteredItems.map(item => `
            <div class="relative flex flex-col rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
                 style="border-top: 5px solid ${color};">
              <!-- Image Area -->
              <div class="relative bg-white p-4 h-48 flex items-center justify-center">
                <img src="${item.images[0]}" alt="${item.name}" class="max-h-full max-w-full object-contain">
                ${item.isBestSeller ? '<span class="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">Best Seller</span>' : ''}
              </div>

              <!-- Content Area -->
              <div class="p-4 flex flex-col flex-grow">
                <h4 class="font-bold text-md text-gray-800 leading-tight">${item.name}</h4>
                
                <!-- Description -->
                <p class="text-xs text-gray-600 mt-2 flex-grow">${item.description}</p>

                <!-- Social Proof: Star Rating & Reviews -->
                <div class="flex items-center mt-3 gap-2 border-t pt-3">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"></path></svg>
                    <span class="text-xs text-gray-600 ml-1 font-medium">${item.rate}</span>
                  </div>
                  <span class="text-gray-300">|</span>
                  <span class="text-xs text-gray-500">${item.review} Reviews</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      modalBody.innerHTML = `<p class="text-center text-gray-500 py-12">No product details available for this category.</p>`;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden'); // Pigilan ang pag-scroll ng background
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden'); // Ibalik ang pag-scroll ng background
  };

  const addEventListenersToButtons = () => {
    const exploreButtons = document.querySelectorAll('.explore-btn');
    exploreButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const title = e.currentTarget.getAttribute('data-title');
        const color = e.currentTarget.getAttribute('data-color');
        openModal(title, color);
      });
    });
  };

  const loadAllData = async () => {
    try {
      const [productsRes, itemsRes] = await Promise.all([
        fetch('../data/ExploreProducts.json'),
        fetch('../data/Item.json')
      ]);
      if (!productsRes.ok || !itemsRes.ok) throw new Error('Network response was not ok');
      const products = await productsRes.json();
      allItems = await itemsRes.json();
      renderGalleryCards(products);
    } catch (error) {
      console.error("Could not fetch or render data:", error);
      if (galleryGrid) {
        galleryGrid.innerHTML = `<p class="text-center text-red-500 col-span-full">Failed to load product categories.</p>`;
      }
    }
  };

  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  loadAllData();
});