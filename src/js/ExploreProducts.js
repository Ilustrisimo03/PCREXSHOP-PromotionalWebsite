const galleryGrid = document.getElementById('gallery-grid');

// Dito nakalagay ang layout ng bawat card (hindi binago)
const cardLayouts = [
  "sm:col-span-1 sm:row-span-1 h-72", // small square
  "sm:col-span-1 sm:row-span-1 h-72", // small square
  "sm:col-span-2 sm:row-span-1 h-72", // wide rectangle
  "sm:col-span-2 sm:row-span-1 h-72", // wide rectangle
  "sm:col-span-1 sm:row-span-1 h-72", // small
  "sm:col-span-1 sm:row-span-1 h-72"  // small
];

const renderGalleryCards = (products) => {
  if (!galleryGrid) return;

  galleryGrid.innerHTML = products.map((product, index) => {
    
    // --- SIMULA NG PAGBABAGO ---

    // Tinitingnan kung ang produkto ay "Processors" o "Memory (RAM)"
    const isSpecialImage = product.title === "Processors" || product.title === "Memory (RAM)";

    // Naglalagay ng ibang class para sa image container kung special ito
    // Dito, ginawa nating mas malaki at nakasentro ang special image
    const imageContainerClasses = isSpecialImage
      ? "absolute right-4 bottom-0" // Style para sa Processor at RAM
      : "absolute right-4 bottom-0 w-40 h-40 sm:w-100 sm:h-100";   // Default style para sa iba

    // Naglalagay din ng ibang class para mismo sa <img> tag
    const imageTagClasses = isSpecialImage
      ? "object-contain w-60 h-60" // Mas malaking sukat ng image
      : "object-contain w-full h-full"; // Default na sukat

    // --- WAKAS NG PAGBABAGO ---

    return `
      <div class="relative rounded-2xl p-6 flex flex-col justify-between shadow-lg overflow-hidden
                  transition-transform duration-300 hover:scale-[1.03] ${cardLayouts[index % cardLayouts.length]}"
           style="background-color: ${product.color};">

        <!-- Text (nilagyan ng z-index para mapatungan ang image) -->
        <div class="relative z-10">
          <p class="text-sm font-semibold uppercase text-white/90">Best</p>
          <h3 class="text-2xl font-extrabold text-white">${product.title}</h3>
          <p class="text-base text-white/90 mt-1">${product.subtitle}</p>
        </div>

        <!-- Product Image (ginagamit na ang bagong classes) -->
        <div class="${imageContainerClasses}">
          <img src="${product.image}" alt="${product.alt}" class="${imageTagClasses}">
        </div>

        <!-- Button (nilagyan ng z-index para hindi matabunan) -->
        <button class="relative z-10 mt-auto w-fit px-4 py-2 bg-white text-[#E31C25] text-sm font-semibold rounded-lg shadow hover:bg-gray-100 transition">
          Explore
        </button>
      </div>
    `;
  }).join('');
};

const loadProductData = async (url) => {
  try {
    const response = await fetch(url);
    const products = await response.json();
    renderGalleryCards(products);
  } catch (error) {
    console.error("Could not fetch or render product data:", error);
    galleryGrid.innerHTML = `<p class="text-center text-red-500 col-span-full">Failed to load products.</p>`;
  }
};

loadProductData('../data/ExploreProducts.json');