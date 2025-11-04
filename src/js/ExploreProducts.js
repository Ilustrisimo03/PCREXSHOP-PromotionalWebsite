document.addEventListener('DOMContentLoaded', () => {

  const galleryGrid = document.getElementById('ExploreProducts-grid');
  const modal = document.getElementById('productModal');
  const closeModalBtn = document.getElementById('closeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  const cardLayouts = [
    "sm:col-span-2 sm:row-span-1 h-72 animate-fade-left",
    "sm:col-span-1 sm:row-span-1 h-72 animate-fade-down",
    "sm:col-span-1 sm:row-span-1 h-72 animate-fade-right",
    "sm:col-span-1 sm:row-span-1 h-72 animate-fade-left",
    "sm:col-span-1 sm:row-span-1 h-72 animate-fade-down",
    "sm:col-span-2 sm:row-span-1 h-72 animate-fade-right",
  ];

  let allItems = [];

  const renderGalleryCards = (products) => { 
    if (!galleryGrid) return;
    galleryGrid.innerHTML = products.map((product, index) => {
   
      const isWideImage = ["Motherboards", "Power Supplies"].includes(product.title);
      const isTallImage = ["Graphics Cards", "Processors" ].includes(product.title);
      const isSmallImage = ["Memory (RAM)", "Storage Drives"].includes(product.title);

      let imageContainerClasses = "absolute bottom-0 right-0 flex justify-end items-end transition-all duration-300 ease-out";
      let imageTagClasses = "object-contain drop-shadow-2xl transition-transform duration-300 ease-out hover:scale-105";


      if (isWideImage) {
        imageContainerClasses += " w-[270px] sm:w-[320px] h-[220px]";
        imageTagClasses += " translate-y-2 sm:translate-y-4";
      } else if (isTallImage) {
        imageContainerClasses += " w-[240px] sm:w-[260px] h-[260px] sm:h-[280px]";
        imageTagClasses += " translate-x-2 sm:translate-x-4";
      } else if (isSmallImage) {
        imageContainerClasses += " w-[240px] sm:w-[260px] h-[240px] sm:h-[260px]";
        imageTagClasses += " translate-y-4 sm:translate-y-6";
      }

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

    let itemTypesToFilter = [];

    // Corrected Mapping logic to match title to 'type' in Item.json
    if (title === "Processors") itemTypesToFilter = ["Processor"];
    else if (title === "Graphics Cards") itemTypesToFilter = ["Graphics Card"];
    else if (title === "CPU Coolings") itemTypesToFilter = ["CPU Cooling"];
    else if (title === "Power Supplies") itemTypesToFilter = ["Power Supply"];
    else if (title === "Storage Drives") itemTypesToFilter = ["HDD", "SSD"]; // Corrected: Filter for both HDD and SSD
    else if (title === "Motherboards") itemTypesToFilter = ["Motherboard"];
    else if (title === "Memory (RAM)") itemTypesToFilter = ["Memory (RAM)"];
    else if (title === "Peripherals") itemTypesToFilter = ["Keyboard", "Mouse", "Monitor", "AVR", "Headset", "Speaker"]; // Added other peripherals
    else if (title === "Accessories") itemTypesToFilter = ["Cable", "Networking"]; // Added accessories
    else if (title === "Pre-Built PC") itemTypesToFilter = ["PC"]; // Added for pre-built PCs

    const filteredItems = allItems.filter(item => itemTypesToFilter.includes(item.type));

    // I-reset ang class ng modalBody bago magdagdag ng content
    modalBody.className = 'overflow-y-auto p-6 md:p-8 space-y-6';

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
                
                <!-- Price -->
                <p class="text-xl font-bold text-[#074ec2] mt-2">₱${item.price}</p>
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
      // Assuming ExploreProducts.json is still correct or adjusted if needed.
      // If you've updated your categories, ensure this JSON matches the 'title' values
      // used in your ExploreProducts.json.
      const [productsRes, itemsRes] = await Promise.all([
        fetch('/src/data/ExploreProducts.json'), // Make sure this path is correct
        fetch('/src/data/Item.json') // Make sure this path is correct
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


