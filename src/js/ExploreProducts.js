document.addEventListener('DOMContentLoaded', () => {

  const galleryGrid = document.getElementById('ExploreProducts-grid');
  const modal = document.getElementById('productModal');
  const closeModalBtn = document.getElementById('closeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  // Dito nakalagay ang layout ng bawat card (hindi binago)
  const cardLayouts = [
    "sm:col-span-1 sm:row-span-1 h-72", // small square
    "sm:col-span-1 sm:row-span-1 h-72", // small square
    "sm:col-span-2 sm:row-span-1 h-72", // wide rectangle
    "sm:col-span-2 sm:row-span-1 h-72", // wide rectangle
    "sm:col-span-1 sm:row-span-1 h-72", // small
    "sm:col-span-1 sm:row-span-1 h-72" // small
  ];

  let allItems = []; // Itatabi natin dito ang lahat ng produkto galing sa Item.json

  // Binago para tumanggap ng allItems data
  const renderGalleryCards = (products) => {
    if (!galleryGrid) return;

    galleryGrid.innerHTML = products.map((product, index) => {
      const isSpecialImage = product.title === "Processors" || product.title === "Memory (RAM)";
      const imageContainerClasses = isSpecialImage ?
        "absolute right-4 bottom-0" :
        "absolute right-4 bottom-0 w-40 h-40 sm:w-100 sm:h-100";
      const imageTagClasses = isSpecialImage ?
        "object-contain w-60 h-60" :
        "object-contain w-full h-full";

      // Nagdagdag ng data-title attribute para malaman kung anong kategorya ang iclick
      return `
        <div class="relative rounded-2xl p-6 flex flex-col justify-between shadow-lg overflow-hidden
                    transition-transform duration-300 hover:scale-[1.03] ${cardLayouts[index % cardLayouts.length]}"
             style="background-color: ${product.color};">
          <div class="relative z-10">
            <p class="text-sm font-semibold uppercase text-white/90">Best</p>
            <h3 class="text-2xl font-extrabold text-white">${product.title}</h3>
            <p class="text-base text-white/90 mt-1">${product.subtitle}</p>
          </div>
          <div class="${imageContainerClasses}">
            <img src="${product.image}" alt="${product.alt}" class="${imageTagClasses}">
          </div>
          <button data-title="${product.title}" class="explore-btn relative z-10 mt-auto w-fit px-4 py-2 bg-white text-[#E31C25] text-sm font-semibold rounded-lg shadow hover:bg-gray-100 transition">
            Explore
          </button>
        </div>
      `;
    }).join('');

    // Pagkatapos mag-render, ilagay ang event listeners
    addEventListenersToButtons();
  };

  // --- BAGONG FUNCTIONS PARA SA MODAL ---

  const openModal = (title) => {
    modalTitle.textContent = `${title} Selections`;

    // Itinatama ang pangalan ng 'type' para tumugma sa Item.json
    let itemType = title;
    if (title === "Processors") itemType = "Processor";
    if (title === "Graphics Cards") itemType = "Graphics Card";
    if (title === "CPU Coolings") itemType = "CPU Cooling";
    if (title === "Power Supplies") itemType = "Power Supply";
    if (title === "Storage Drives") itemType = "Storage (HDD / SSD)";
    if (title === "Motherboards") itemType = "Motherboard";


    // I-filter ang mga produkto base sa title
    const filteredItems = allItems.filter(item => item.type === itemType);

    if (filteredItems.length > 0) {
      modalBody.innerHTML = filteredItems.map(item => `
        <div class="flex flex-col sm:flex-row items-center gap-6 p-4 border-b last:border-b-0">
          <img src="${item.images[0]}" alt="${item.name}" class="w-24 h-24 object-contain rounded-lg bg-gray-100">
          <div class="flex-1 text-center sm:text-left">
            <h4 class="font-bold text-lg text-gray-800">${item.name}</h4>
            <p class="text-sm text-gray-600 mt-1">${item.description}</p>
            <div class="flex items-center justify-center sm:justify-start gap-4 mt-2">
               <span class="text-xl font-extrabold text-[#E31C25]">$${item.price}</span>
               <span class="text-sm text-gray-500">${item.stock} in stock</span>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      modalBody.innerHTML = `<p class="text-center text-gray-500 py-8">No items found for this category.</p>`;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  const addEventListenersToButtons = () => {
    const exploreButtons = document.querySelectorAll('.explore-btn');
    exploreButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const title = e.currentTarget.getAttribute('data-title');
        openModal(title);
      });
    });
  };

  // --- BINAGONG DATA LOADING ---

  const loadAllData = async () => {
    try {
      const [productsRes, itemsRes] = await Promise.all([
        fetch('../data/ExploreProducts.json'),
        fetch('../data/Item.json')
      ]);

      const products = await productsRes.json();
      allItems = await itemsRes.json(); // Itabi ang data

      renderGalleryCards(products);

    } catch (error) {
      console.error("Could not fetch or render data:", error);
      if (galleryGrid) {
          galleryGrid.innerHTML = `<p class="text-center text-red-500 col-span-full">Failed to load products.</p>`;
      }
    }
  };

  // Event listeners para isara ang modal
  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Simulan ang pag-load ng lahat ng data
  loadAllData();

});