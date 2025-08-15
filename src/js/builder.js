
// document.addEventListener('DOMContentLoaded', () => {

//     // --- DATA ---
//     // The JSON data you provided.
//     const productData = [
//       { "id": 13, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "AMD Wraith Stealth Cooler", "price": "17.99", "description": "The AMD Wraith Stealth is a low-profile stock CPU cooler...", "rate": 4.3, "stock": 13, "review": 48, "percent": 86, "category": { "name": "Components" }, "type": "CPU Cooling", "socket": ["AM4"] },
//       { "id": 28, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "AMD Stock Heatsink Fan", "price": "14.99", "description": "A standard AMD stock CPU cooler...", "rate": 3.8, "stock": 2, "review": 19, "percent": 76, "category": { "name": "Components" }, "type": "CPU Cooling", "socket": ["AM4"] },
//       { "id": 21, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "Deepcool AG400 Cooler", "price": "29.99", "description": "A single-tower 120mm CPU cooler...", "rate": 4.6, "stock": 10, "review": 135, "percent": 92, "category": { "name": "Components" }, "type": "CPU Cooling", "socket": ["AM4", "AM5", "LGA 1700"]},
//       { "id": 16, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "MSI PRO B650M-A WiFi", "price": "179.99", "description": "A Micro-ATX motherboard for AMD Ryzen 7000 series CPUs...", "rate": 4.2, "stock": 5, "review": 43, "percent": 84, "category": { "name": "Components" }, "type": "Motherboard", "socket": "AM5", "memoryType": "DDR5" },
//       { "id": 20, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "Biostar A520MHP Motherboard", "price": "54.99", "description": "A budget-friendly Micro-ATX motherboard...", "rate": 4.1, "stock": 6, "review": 38, "percent": 82, "category": { "name": "Components" }, "type": "Motherboard", "socket": "AM4", "memoryType": "DDR4" },
//       { "id": 19, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "Biostar RX 580 8GB", "price": "129.99", "description": "An 8GB GDDR5 graphics card...", "rate": 4.4, "stock": 2, "review": 74, "percent": 88, "category": { "name": "Components" }, "type": "Graphics Card" },
//       { "id": 30, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "MSI GeForce RTX 3060 Ventus", "price": "289.99", "description": "A 12GB GDDR6 graphics card...", "rate": 4.7, "stock": 6, "review": 54, "percent": 94, "category": { "name": "Components" }, "type": "Graphics Card" },
//       { "id": 25, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "Acer AC-550 550W Power Supply", "price": "59.99", "description": "A 550W fully modular power supply...", "rate": 4.5, "stock": 4, "review": 93, "percent": 90, "category": { "name": "Components"}, "type": "Power Supply" },
//       { "id": 22, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "InPlay GS750-Ultra 750W", "price": "49.99", "description": "An 80+ Bronze rated power supply...", "rate": 4.3, "stock": 7, "review": 88, "percent": 86, "category": { "name": "Components"}, "type": "Power Supply" },
//       { "id": 29, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "Seagate Barracuda 1TB HDD", "price": "44.99", "description": "A 1TB internal hard drive...", "rate": 4.2, "stock": 20, "review": 31, "percent": 84, "category": { "name": "Components"}, "type": "Storage" },
//       { "id": 17, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "Seagate ST2000DM008 2TB HDD", "price": "54.99", "description": "A 2TB internal hard drive...", "rate": 4.4, "stock": 12, "review": 23, "percent": 88, "category": { "name": "Components"}, "type": "Storage" },
//       { "id": 26, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "Kingston A400 480GB SSD", "price": "34.99", "description": "A 480GB SATA 2.5-inch solid-state drive...", "rate": 4.6, "stock": 9, "review": 17, "percent": 92, "category": { "name": "Components"}, "type": "Storage" },
//       { "id": 18, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "Team Elite T-Force Delta 16GB RGB", "price": "54.99", "description": "A 16GB (2x8GB) DDR4 memory kit...", "rate": 4.7, "stock": 3, "review": 109, "percent": 94, "category": { "name": "Components" }, "type": "Memory (RAM)", "memoryType": "DDR4" },
//       { "id": 27, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "Kingston Fury Beast 16GB RGB", "price": "49.99", "description": "A 16GB DDR4 memory module...", "rate": 4.7, "stock": 15, "review": 28, "percent": 94, "category": { "name": "Components" }, "type": "Memory (RAM)", "memoryType": "DDR4" },
//       { "id": 11, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "Kingston 16GB DDR5 SODIMM", "price": "39.99", "description": "A 16GB DDR5 3200MHz SODIMM memory module...", "rate": 4.8, "stock": 13, "review": 1111, "percent": 96, "category": { "name": "Components" }, "type": "Memory (RAM)", "memoryType": "DDR5" },
//       { "id": 4, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "AMD Ryzen 5 5600X", "price": "149.99", "description": "A 6-core, 12-thread processor...", "rate": 4.8, "stock": 20, "review": 33, "percent": 96, "category": { "name": "Components" }, "type": "Processor", "socket": "AM4" },
//       { "id": 6, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "AMD Ryzen 7 5700G", "price": "179.99", "description": "An 8-core, 16-thread processor with integrated graphics...", "rate": 4.7, "stock": 10, "review": 22, "percent": 94, "category": { "name": "Components" }, "type": "Processor", "socket": "AM4", "hasGpu": true },
//       { "id": 32, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "AMD Ryzen 7 7700X", "price": "399.00", "description": "An 8-core, 16-thread processor...", "rate": 4.6, "stock": 10, "review": 22, "percent": 92, "category": { "name": "Components" }, "type": "Processor", "socket": "AM5", "hasGpu": true },
//       { "id": 33, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "Intel Core i7-14700F", "price": "359.00", "description": "A 20-core, 28-thread processor from Intel...", "rate": 4.5, "stock": 10, "review": 22, "percent": 90, "category": { "name": "Components" }, "type": "Processor", "socket": "LGA 1700", "hasGpu": false },
//       { "id": 8, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "InPlay Wind 05 Micro ATX Case", "price": "29.99", "description": "A Micro-ATX PC case...", "rate": 4.3, "stock": 13, "review": 3, "percent": 86, "category": { "name": "Furniture" }, "type": "PC Case" },
//       { "id": 1, "images": ["https://drive.google.com/uc?export=view&id=1LrB58msapJOfj_rNMFsienaXu3onQnS7"], "name": "YGT V300 M-ATX Gaming PC Case", "price": "34.99", "description": "A white Micro-ATX gaming PC case...", "rate": 4.7, "stock": 0, "review": 111, "percent": 94, "category": { "name": "Furniture" }, "type": "PC Case" }
//     ];

//     const componentCategories = [
//         { id: 'cpu', name: 'Processor (CPU)', type: 'Processor', icon: 'fa-microchip' },
//         { id: 'motherboard', name: 'Motherboard', type: 'Motherboard', icon: 'fa-clipboard-list' },
//         { id: 'memory', name: 'Memory (RAM)', type: 'Memory (RAM)', icon: 'fa-memory' },
//         { id: 'gpu', name: 'Graphics Card (GPU)', type: 'Graphics Card', icon: 'fa-gamepad' },
//         { id: 'storage', name: 'Storage (SSD/HDD)', type: 'Storage', icon: 'fa-hdd' },
//         { id: 'psu', name: 'Power Supply (PSU)', type: 'Power Supply', icon: 'fa-plug' },
//         { id: 'cooling', name: 'CPU Cooler', type: 'CPU Cooling', icon: 'fa-fan' },
//         { id: 'case', name: 'PC Case', type: 'PC Case', icon: 'fa-cube' },
//     ];

//     let selectedComponents = {};
    
//     // --- DOM Elements ---
//     const componentSlotsContainer = document.getElementById('component-slots');
//     const modal = document.getElementById('component-modal');
//     const modalTitle = document.getElementById('modal-title');
//     const modalBody = document.getElementById('modal-body');
//     const closeModalBtn = document.getElementById('close-modal-btn');
//     const totalPriceEl = document.getElementById('total-price');
//     const summaryContainer = document.getElementById('selected-components-summary');
//     const clearBuildBtn = document.getElementById('clear-build-btn');
//     const addToCartBtn = document.getElementById('add-to-cart-btn');

//     // --- Functions ---
    
//     function initializeBuilder() {
//         renderComponentSlots();
//         updateSummary();
//         updateTotalPrice();
//     }

//     function renderComponentSlots() {
//         componentSlotsContainer.innerHTML = '';
//         componentCategories.forEach(cat => {
//             const isSelected = selectedComponents[cat.id];
//             const slotHTML = `
//                 <div id="slot-${cat.id}" class="component-slot border border-slate-200 p-4 rounded-lg flex items-center justify-between gap-4">
//                     <div class="flex items-center gap-4">
//                         <i class="fas ${cat.icon} text-2xl text-slate-500 w-8 text-center"></i>
//                         <div>
//                             <h3 class="font-semibold text-slate-800">${cat.name}</h3>
//                             <div class="text-sm text-slate-600 component-name-display">
//                                 ${isSelected ? selectedComponents[cat.id].name : 'Not selected'}
//                             </div>
//                         </div>
//                     </div>
//                     <div class="flex items-center gap-2">
//                         ${isSelected ? `
//                             <button class="remove-btn text-sm bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md" data-id="${cat.id}">Remove</button>
//                         ` : ''}
//                         <button class="choose-btn text-sm bg-[#E31C25] text-white hover:bg-red-700 font-semibold px-4 py-2 rounded-md" data-id="${cat.id}" data-type="${cat.type}" data-name="${cat.name}" data-icon="${cat.icon}">
//                             Choose
//                         </button>
//                     </div>
//                 </div>
//             `;
//             componentSlotsContainer.insertAdjacentHTML('beforeend', slotHTML);
//         });
//     }

//     function openModal(category) {
//         modalTitle.innerHTML = `<i class="fas ${category.icon} mr-3 text-[#E31C25]"></i> Select ${category.name}`;
        
//         let compatibleProducts = getCompatibleProducts(category.type);

//         modalBody.innerHTML = ''; // Clear previous content
//         if(compatibleProducts.length === 0) {
//             modalBody.innerHTML = `<div class="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <h4 class="font-semibold text-yellow-800">Compatibility Alert!</h4>
//                 <p class="text-yellow-700 mt-2">No compatible components found. Please select a CPU and Motherboard first, or check your existing selections.</p>
//             </div>`;
//         } else {
//             compatibleProducts.forEach(product => {
//                 const productHTML = `
//                     <div class="modal-item flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
//                         <img src="${product.images[0]}" alt="${product.name}" class="w-24 h-24 object-cover rounded-md border">
//                         <div class="flex-grow">
//                             <h4 class="font-bold text-slate-900">${product.name}</h4>
//                             <p class="text-xs text-slate-500 mt-1">${product.description.substring(0, 100)}...</p>
//                             <div class="text-sm mt-2">
//                                 <span class="font-semibold">Compatibility:</span>
//                                 ${getCompatibilityInfo(product)}
//                             </div>
//                         </div>
//                         <div class="text-center sm:text-right">
//                             <p class="text-lg font-bold text-[#E31C25]">₱${parseFloat(product.price).toFixed(2)}</p>
//                             <button class="select-component-btn mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold" data-product-id="${product.id}" data-category-id="${category.id}">Select</button>
//                         </div>
//                     </div>
//                 `;
//                 modalBody.insertAdjacentHTML('beforeend', productHTML);
//             });
//         }
        
//         modal.classList.remove('hidden');
//     }
    
//     function getCompatibilityInfo(product) {
//         let info = '';
//         if(product.socket) {
//             const socketInfo = Array.isArray(product.socket) ? product.socket.join(', ') : product.socket;
//             info += `<span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Socket: ${socketInfo}</span>`;
//         }
//         if(product.memoryType) {
//             info += `<span class="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Memory: ${product.memoryType}</span>`;
//         }
//         return info || '<span class="text-slate-500">General</span>';
//     }

//     function getCompatibleProducts(type) {
//         const cpu = selectedComponents['cpu'];
//         const motherboard = selectedComponents['motherboard'];

//         return productData.filter(product => {
//             if (product.type !== type) return false;

//             // Motherboard compatibility with CPU
//             if (type === 'Motherboard' && cpu) {
//                 return product.socket === cpu.socket;
//             }
//             // CPU Cooler compatibility with Motherboard/CPU
//             if (type === 'CPU Cooling' && motherboard) {
//                 return product.socket.includes(motherboard.socket);
//             }
//             // RAM compatibility with Motherboard
//             if (type === 'Memory (RAM)' && motherboard) {
//                 return product.memoryType === motherboard.memoryType;
//             }
//             // If no specific dependencies, show all products of the type
//             return true;
//         });
//     }

//     function selectComponent(productId, categoryId) {
//         const product = productData.find(p => p.id === parseInt(productId));
//         selectedComponents[categoryId] = product;
        
//         // If a new CPU or Motherboard is selected, clear dependent components
//         if (categoryId === 'cpu') {
//             delete selectedComponents['motherboard'];
//             delete selectedComponents['memory'];
//             delete selectedComponents['cooling'];
//         }
//         if (categoryId === 'motherboard') {
//             delete selectedComponents['memory'];
//             delete selectedComponents['cooling'];
//         }
        
//         closeModal();
//         initializeBuilder();
//     }
    
//     function removeComponent(categoryId) {
//         delete selectedComponents[categoryId];
        
//         // Also clear dependent components
//          if (categoryId === 'cpu') {
//             delete selectedComponents['motherboard'];
//             delete selectedComponents['memory'];
//             delete selectedComponents['cooling'];
//         }
//         if (categoryId === 'motherboard') {
//             delete selectedComponents['memory'];
//             delete selectedComponents['cooling'];
//         }
        
//         initializeBuilder();
//     }

//     function closeModal() {
//         modal.classList.add('hidden');
//     }
    
//     function updateSummary() {
//         const selectedCount = Object.keys(selectedComponents).length;
//         if(selectedCount === 0) {
//             summaryContainer.innerHTML = '<p class="text-slate-500 italic">No components selected yet.</p>';
//             addToCartBtn.disabled = true;
//             addToCartBtn.classList.add('opacity-50', 'cursor-not-allowed');
//             return;
//         }

//         summaryContainer.innerHTML = '';
//         let allRequiredSelected = true;
        
//         for (const cat of componentCategories) {
//             const item = selectedComponents[cat.id];
//             if (item) {
//                 const summaryItemHTML = `
//                     <div class="flex justify-between items-center">
//                         <div>
//                             <p class="font-semibold text-slate-800">${cat.name}</p>
//                             <p class="text-slate-600">${item.name}</p>
//                         </div>
//                         <p class="font-medium text-slate-700">₱${parseFloat(item.price).toFixed(2)}</p>
//                     </div>
//                 `;
//                 summaryContainer.insertAdjacentHTML('beforeend', summaryItemHTML);
//             } else {
//                  allRequiredSelected = false; // You can define which parts are truly required here
//             }
//         }
        
//         // Enable Add to Cart button only if all components are selected
//         if (selectedCount === componentCategories.length) {
//             addToCartBtn.disabled = false;
//             addToCartBtn.classList.remove('opacity-50', 'cursor-not-allowed');
//         } else {
//             addToCartBtn.disabled = true;
//             addToCartBtn.classList.add('opacity-50', 'cursor-not-allowed');
//         }
//     }

//     function updateTotalPrice() {
//         const total = Object.values(selectedComponents).reduce((sum, item) => sum + parseFloat(item.price), 0);
//         totalPriceEl.textContent = `₱${total.toFixed(2)}`;
//     }
    
//     function clearBuild() {
//         selectedComponents = {};
//         initializeBuilder();
//     }
    
//     // --- Event Listeners ---
//     componentSlotsContainer.addEventListener('click', e => {
//         if (e.target.classList.contains('choose-btn')) {
//             const category = {
//                 id: e.target.dataset.id,
//                 type: e.target.dataset.type,
//                 name: e.target.dataset.name,
//                 icon: e.target.dataset.icon,
//             };
//             openModal(category);
//         }
//         if (e.target.classList.contains('remove-btn')) {
//             removeComponent(e.target.dataset.id);
//         }
//     });

//     modal.addEventListener('click', e => {
//         if (e.target.classList.contains('select-component-btn')) {
//             selectComponent(e.target.dataset.productId, e.target.dataset.categoryId);
//         }
//     });

//     closeModalBtn.addEventListener('click', closeModal);
//     clearBuildBtn.addEventListener('click', clearBuild);

//     // Close modal if user clicks outside of the modal content
//     modal.addEventListener('click', e => {
//         if (e.target.id === 'component-modal') {
//             closeModal();
//         }
//     });
    
//     // --- Initial Load ---
//     initializeBuilder();
// });





// document.addEventListener('DOMContentLoaded', () => {
//     // Data ng produkto (direktang inilagay mula sa JSON)
//     const products = [
//       { "id": 13, "name": "AMD Wraith Stealth Cooler", "price": "17.99", "description": "The AMD Wraith Stealth is a low-profile stock CPU cooler bundled with select Ryzen processors. It features an aluminum heatsink and a quiet fan, suitable for CPUs with a 65W TDP, making it a reliable choice for budget builds and standard computing tasks.", "rate": 4.3, "stock": 13, "review": 48, "percent": 86, "category": { "name": "Components" }, "type": "CPU Cooling" },
//       { "id": 28, "name": "AMD Stock Heatsink Fan", "price": "14.99", "description": "A standard AMD stock CPU cooler designed to provide sufficient cooling for compatible processors under normal operating conditions. While generally better than competitor stock options, they can become audible under heavy CPU loads. [24, 25]", "rate": 3.8, "stock": 2, "review": 19, "percent": 76, "category": { "name": "Components" }, "type": "CPU Cooling" },
//       { "id": 21, "name": "Deepcool AG400 Single Tower Hydro Bearing CPU Air Cooler ARGB White", "price": "29.99", "description": "A single-tower 120mm CPU cooler featuring four direct-touch copper heatpipes and a hydro bearing fan with ARGB lighting. It offers excellent thermal performance and RAM compatibility in a streamlined and budget-friendly package.", "rate": 4.6, "stock": 10, "review": 135, "percent": 92, "category": { "name": "Components" }, "type": "CPU Cooling" },
//       { "id": 16, "name": "MSI PRO B650M-A WiFi D5 AM5 DDR5 Motherboard", "price": "179.99", "description": "A Micro-ATX motherboard for AMD Ryzen 7000 series CPUs, supporting DDR5 memory. It offers a robust feature set including PCIe 4.0, Wi-Fi 6E, and 2.5G LAN, aimed at professionals and builders looking for a balance of performance and value.", "rate": 4.2, "stock": 5, "review": 43, "percent": 84, "category": { "name": "Components" }, "type": "Motherboard" },
//       { "id": 20, "name": "Biostar A520MHP Socket AM4 DDR4 Motherboard", "price": "54.99", "description": "A budget-friendly Micro-ATX motherboard with the AMD A520 chipset, supporting 3rd, 4th, and 5th Gen Ryzen CPUs. It features DDR4 memory support, a PCIe M.2 slot, and HDMI 4K resolution support, making it a solid foundation for entry-level builds.", "rate": 4.1, "stock": 6, "review": 38, "percent": 82, "category": { "name": "Components" }, "type": "Motherboard" },
//       { "id": 19, "name": "Biostar RX 580 VA5805RV82 Dual Cooling Fan 8GB 256-bit GDDR5 Gaming Videocard", "price": "129.99", "description": "An 8GB GDDR5 graphics card with a dual cooling fan design, offering solid 1080p gaming performance. It's a capable and affordable option for gamers looking for good frame rates on a budget.", "rate": 4.4, "stock": 2, "review": 74, "percent": 88, "category": { "name": "Components" }, "type": "Graphics Card" },
//       { "id": 30, "name": "MSI GeForce RTX 3060 Ventus 2X OC 12GB GDDR6 Gaming Graphics Card", "price": "289.99", "description": "A 12GB GDDR6 graphics card featuring a dual-fan thermal design. It delivers excellent performance for 1080p and 1440p gaming, with real-time ray tracing and AI-enhanced graphics.", "rate": 4.7, "stock": 6, "review": 54, "percent": 94, "category": { "name": "Components" }, "type": "Graphics Card" },
//       { "id": 25, "name": "Acer AC-550 550W Full Modular 80+ Bronze Power Supply", "price": "59.99", "description": "A 550W fully modular power supply with 80+ Bronze certification, ensuring efficient power delivery and easy cable management. It provides reliable performance for mainstream gaming and productivity systems.", "rate": 4.5, "stock": 4, "review": 93, "percent": 90, "category": { "name": "Components"}, "type": "Power Supply" },
//       { "id": 22, "name": "InPlay GS750-Ultra (750W, 450W, 650W) 80+ Bronze Rated Hydro Bearing RGB Power Supply", "price": "49.99", "description": "An 80+ Bronze rated power supply available in multiple wattage options. It features a hydro bearing RGB fan for quiet operation and customizable aesthetics, providing stable power for gaming rigs.", "rate": 4.3, "stock": 7, "review": 88, "percent": 86, "category": { "name": "Components"}, "type": "Power Supply" },
//       { "id": 29, "name": "Seagate Barracuda ST1000DM010 1TB 7200RPM SATA HDD", "price": "44.99", "description": "A 1TB internal hard drive with a 7200 RPM spindle speed and 64MB cache. It is a cost-effective solution for desktop storage, offering reliable performance for everyday computing and data archiving. [6, 8, 18, 19, 37]", "rate": 4.2, "stock": 20, "review": 31, "percent": 84, "category": { "name": "Components"}, "type": "Storage (HDD / SSD)" },
//       { "id": 17, "name": "Seagate ST2000DM008 2TB SATA HDD", "price": "54.99", "description": "A 2TB internal hard drive with a 7200 RPM spindle speed and 256MB cache. It provides ample storage for large files, games, and media, making it a great choice for desktop PCs and home servers.", "rate": 4.4, "stock": 12, "review": 23, "percent": 88, "category": { "name": "Components"}, "type": "Storage (HDD / SSD)" },
//       { "id": 26, "name": "Kingston SSDNow A400 480GB SATA 2.5 SSD", "price": "34.99", "description": "A 480GB SATA 2.5-inch solid-state drive that dramatically improves the responsiveness of your existing system with incredible boot, loading, and transfer times. It's a reliable and affordable upgrade for laptops and desktops.", "rate": 4.6, "stock": 9, "review": 17, "percent": 92, "category": { "name": "Components"}, "type": "Storage (HDD / SSD)" },
//       { "id": 24, "name": "Ramsta R600 256GB M.2 SATA SSD", "price": "19.99", "description": "A 256GB M.2 SATA solid-state drive offering a compact form factor and faster performance than traditional hard drives. It's a cost-effective choice for improving boot times and application loading.", "rate": 4.2, "stock": 5, "review": 66, "percent": 84, "category": { "name": "Components"}, "type": "Storage (HDD / SSD)" },
//       { "id": 23, "name": "Kingston Fury Renegade SFYRS 500GB PCIe 4.0 NVMe SSD", "price": "69.99", "description": "A 500GB PCIe 4.0 NVMe M.2 SSD delivering cutting-edge performance with blazing-fast read/write speeds. It's ideal for gaming and content creation, providing top-tier performance for demanding users.", "rate": 4.8, "stock": 8, "review": 52, "percent": 96, "category": { "name": "Components" }, "type": "Storage (HDD / SSD)" },
//       { "id": 18, "name": "Team Elite TForce Delta 16GB (2x8GB) 3200MHz DDR4 RGB White", "price": "54.99", "description": "A 16GB (2x8GB) DDR4 memory kit with a 3200MHz frequency and full-frame 120° ultra-wide-angle RGB lighting. It features a minimalist, asymmetrical heat spreader in white, perfect for stylish and high-performance PC builds. [12, 45]", "rate": 4.7, "stock": 3, "review": 109, "percent": 94, "category": { "name": "Components" }, "type": "Memory (RAM)" },
//       { "id": 27, "name": "Kingston Fury Beast 16GB 3200MT/s DDR4 RGB Black", "price": "49.99", "description": "A 16GB DDR4 memory module with a speed of 3200MT/s and customizable RGB lighting. It provides a powerful performance boost for gaming, video editing, and rendering, with a stylish black heat spreader.", "rate": 4.7, "stock": 15, "review": 28, "percent": 94, "category": { "name": "Components" }, "type": "Memory (RAM)" },
//       { "id": 11, "name": "Kingston KVR32S22S8/16 16GB 3200MHz DDR4 SODIMM", "price": "39.99", "description": "A 16GB DDR4 3200MHz SODIMM memory module designed for laptops and small form-factor PCs. It offers reliable, high-performance, and is a cost-effective way to upgrade your system's memory.", "rate": 4.8, "stock": 13, "review": 1111, "percent": 96, "category": { "name": "Components" }, "type": "Memory (RAM)" },
//       { "id": 4, "name": "AMD Ryzen 5 5600X 6-Core 12-Thread AM4", "price": "149.99", "description": "A 6-core, 12-thread processor built on the Zen 3 architecture, offering a significant performance uplift for gaming and productivity tasks. It is highly power-efficient and a popular choice for mainstream PC builds. [3, 9, 16, 21, 24]", "rate": 4.8, "stock": 20, "review": 33, "percent": 96, "category": { "name": "Components" }, "type": "Processor" },
//       { "id": 6, "name": "AMD Ryzen 7 5700G 8-Core 16-Thread AM4", "price": "179.99", "description": "An 8-core, 16-thread processor with powerful integrated Radeon graphics, making it an excellent all-in-one solution for gaming and content creation without the need for a discrete graphics card.", "rate": 4.7, "stock": 10, "review": 22, "percent": 94, "category": { "name": "Components" }, "type": "Processor" },
//       { "id": 31, "name": "AMD Ryzen 3 3200G 4-Core AM4", "price": "93.00", "description": "A 4-core processor with built-in Radeon Vega 8 graphics. It's a budget-friendly choice for entry-level PCs, offering good performance for everyday tasks and light gaming. [1, 11, 25, 35, 36]", "rate": 4.2, "stock": 10, "review": 22, "percent": 84, "category": { "name": "Components" }, "type": "Processor" },
//       { "id": 32, "name": "AMD Ryzen 7 7700X AM5", "price": "399.00", "description": "An 8-core, 16-thread processor based on the Zen 4 architecture, designed for the AM5 platform. It offers exceptional performance for gaming and content creation, with support for DDR5 memory and PCIe 5.0. [5, 10, 17, 32, 33]", "rate": 4.6, "stock": 10, "review": 22, "percent": 92, "category": { "name": "Components" }, "type": "Processor" },
//       { "id": 33, "name": "Intel Core i7-14700F LGA 1700", "price": "359.00", "description": "A 20-core, 28-thread processor from Intel's 14th generation, featuring a hybrid architecture with 8 Performance-cores and 12 Efficient-cores. It delivers outstanding performance for demanding games and applications, but requires a discrete graphics card. [7, 29, 39, 41, 42]", "rate": 4.5, "stock": 10, "review": 22, "percent": 90, "category": { "name": "Components" }, "type": "Processor" },
//       { "id": 8, "name": "InPlay Wind 05 and Wind 01 Acrylic Side Panel Micro ATX Tempered Glass Case", "price": "29.99", "description": "A Micro-ATX PC case featuring a tempered glass side panel and options for acrylic front panels. It offers good airflow and a clear view of your components, making it a stylish choice for budget to mid-range builds.", "rate": 4.3, "stock": 13, "review": 3, "percent": 86, "category": { "name": "Furniture" }, "type": "PC Case" },
//       { "id": 1, "name": "YGT V300 M-ATX Tempered Glass Gaming PC Case White", "price": "34.99", "description": "A white Micro-ATX gaming PC case with a tempered glass side panel to showcase your build. It is designed for good airflow and offers a clean, modern aesthetic for a stylish gaming setup.", "rate": 4.7, "stock": 0, "review": 111, "percent": 94, "category": { "name": "Furniture" }, "type": "PC Case" }
//     ];

//     const componentSlotsContainer = document.getElementById('component-slots');
//     const modal = document.getElementById('component-modal');
//     const modalTitle = document.getElementById('modal-title');
//     const modalBody = document.getElementById('modal-body');
//     const closeModalBtn = document.getElementById('close-modal-btn');
//     const totalPriceEl = document.getElementById('total-price');
//     const summaryContainer = document.getElementById('selected-components-summary');
//     const compatibilityStatusEl = document.getElementById('overall-compatibility-status');
//     const clearBuildBtn = document.getElementById('clear-build-btn');

//     let selectedComponents = {};
//     let currentSlotId = null;

//     // Estruktura ng PC Build
//     const componentStructure = [
//         { id: 'cpu', name: 'Processor (CPU)', type: 'Processor', required: true, icon: 'fa-microchip' },
//         { id: 'motherboard', name: 'Motherboard', type: 'Motherboard', required: true, icon: 'fa-clipboard' },
//         { id: 'memory', name: 'Memory (RAM)', type: 'Memory (RAM)', required: true, icon: 'fa-memory' },
//         { id: 'storage', name: 'Storage (SSD/HDD)', type: 'Storage (HDD / SSD)', required: true, icon: 'fa-hdd' },
//         { id: 'gpu', name: 'Graphics Card (GPU)', type: 'Graphics Card', required: false, icon: 'fa-gamepad' },
//         { id: 'psu', name: 'Power Supply (PSU)', type: 'Power Supply', required: true, icon: 'fa-plug' },
//         { id: 'cpu_cooler', name: 'CPU Cooler', type: 'CPU Cooling', required: false, icon: 'fa-fan' },
//         { id: 'case', name: 'PC Case', type: 'PC Case', required: true, icon: 'fa-cube' }
//     ];

//     // Function para makuha ang mga detalye mula sa pangalan o description
//     const getAttribute = (product, keywords) => {
//         const text = `${product.name} ${product.description}`.toLowerCase();
//         for (const keyword of keywords) {
//             if (text.includes(keyword.toLowerCase())) return keyword;
//         }
//         return null;
//     };
//     const getCpuSocket = (product) => getAttribute(product, ['AM4', 'AM5', 'LGA 1700']);
//     const getRamType = (product) => getAttribute(product, ['DDR4', 'DDR5']);
//     const getRamFormFactor = (product) => getAttribute(product, ['SODIMM']);
//     const getMoboFormFactor = (product) => getAttribute(product, ['Micro-ATX', 'Micro ATX']);
//     const getStorageInterface = (product) => getAttribute(product, ['PCIe 4.0', 'M.2', 'SATA']);


//     const checkCompatibility = () => {
//         const issues = [];
//         const { cpu, motherboard, memory, psu, cpu_cooler, pccase } = selectedComponents;

//         if (cpu && motherboard) {
//             const cpuSocket = getCpuSocket(cpu);
//             const moboSocket = getCpuSocket(motherboard);
//             if (cpuSocket !== moboSocket) {
//                 issues.push(`Hindi tugma ang socket: CPU (${cpuSocket}) at Motherboard (${moboSocket}).`);
//             }
//         }

//         if (memory && motherboard) {
//             const memType = getRamType(memory);
//             const moboMemType = getRamType(motherboard);
//             if (memType !== moboMemType) {
//                 issues.push(`Hindi tugma ang RAM: Memory (${memType}) at Motherboard (${moboMemType}).`);
//             }
//             if (getRamFormFactor(memory) === 'SODIMM') {
//                  issues.push(`Ang napiling RAM (SODIMM) ay para sa laptop at hindi tugma sa desktop motherboard.`);
//             }
//         }
        
//         if (pccase && motherboard) {
//             const moboFormFactor = getMoboFormFactor(motherboard);
//             const caseFormFactor = getMoboFormFactor(pccase);
//              if (moboFormFactor && caseFormFactor && moboFormFactor !== caseFormFactor) {
//                 issues.push(`Hindi kasya: Motherboard (${moboFormFactor}) sa PC Case (${caseFormFactor}).`);
//             }
//         }
        
//         if (cpu_cooler && cpu) {
//             const cpuSocket = getCpuSocket(cpu);
//             // Simplistic check, real-world check is more complex
//              if (cpuSocket === 'AM5' && cpu_cooler.name.includes('Wraith Stealth')) {
//                 issues.push(`Warning: Ang ${cpu_cooler.name} ay maaaring hindi sapat para sa ${cpu.name}.`);
//             }
//         }

//         if (issues.length > 0) {
//             return {
//                 compatible: false,
//                 message: `<i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>May mga isyu sa compatibility`,
//                 details: issues
//             };
//         }

//         const allRequiredMet = componentStructure.every(slot => !slot.required || selectedComponents[slot.id]);
//         if (!allRequiredMet) {
//              return {
//                 compatible: false,
//                 message: `<i class="fas fa-info-circle text-[#E31C25] mr-2"></i>Punan ang lahat ng kinakailangang piyesa`,
//                 details: []
//             };
//         }
        
//         return {
//             compatible: true,
//             message: `<i class="fas fa-check-circle text-green-500 mr-2"></i>Maganda! Compatible ang iyong build.`,
//             details: []
//         };
//     };

//     const updateBuildSummary = () => {
//         let totalPrice = 0;
//         summaryContainer.innerHTML = '';

//         if (Object.keys(selectedComponents).length === 0) {
//             summaryContainer.innerHTML = '<p class="text-slate-500 italic">Wala pang napipiling piyesa.</p>';
//             totalPriceEl.textContent = '₱0.00';
//             compatibilityStatusEl.innerHTML = 'Magsimulang pumili ng piyesa.';
//             return;
//         }

//         for (const slotId in selectedComponents) {
//             const product = selectedComponents[slotId];
//             totalPrice += parseFloat(product.price);
            
//             const slotInfo = componentStructure.find(s => s.id === slotId);

//             const summaryItem = document.createElement('div');
//             summaryItem.className = 'flex justify-between items-center';
//             summaryItem.innerHTML = `
//                 <div>
//                     <p class="font-semibold text-slate-800">${slotInfo.name}</p>
//                     <p class="text-slate-600 truncate max-w-[180px]">${product.name}</p>
//                 </div>
//                 <p class="font-medium text-slate-700">₱${product.price}</p>
//             `;
//             summaryContainer.appendChild(summaryItem);
//         }

//         totalPriceEl.textContent = `₱${totalPrice.toFixed(2)}`;

//         const compatibility = checkCompatibility();
//         compatibilityStatusEl.innerHTML = compatibility.message;
//         if (compatibility.details.length > 0) {
//             const detailsList = document.createElement('ul');
//             detailsList.className = 'list-disc list-inside text-left text-sm mt-2 font-normal';
//             compatibility.details.forEach(issue => {
//                 const listItem = document.createElement('li');
//                 listItem.textContent = issue;
//                 detailsList.appendChild(listItem);
//             });
//             compatibilityStatusEl.appendChild(detailsList);
//         }
//     };


//     const renderComponentSlots = () => {
//         componentSlotsContainer.innerHTML = '';
//         componentStructure.forEach(slot => {
//             const product = selectedComponents[slot.id];
//             const slotDiv = document.createElement('div');
//             slotDiv.className = 'component-slot flex items-center justify-between p-4 border rounded-lg';
//             slotDiv.id = `slot-${slot.id}`;
            
//             let requiredText = slot.required ? `<span class="text-red-500 text-xs font-semibold ml-2">REQUIRED</span>` : '';

//             if (product) {
//                  slotDiv.innerHTML = `
//                     <div class="flex items-center gap-4">
//                        <i class="fas ${slot.icon} text-xl text-[#E31C25] w-6 text-center"></i>
//                         <div>
//                             <h4 class="font-bold text-slate-800">${slot.name}</h4>
//                             <p class="text-slate-600">${product.name}</p>
//                         </div>
//                     </div>
//                     <div class="text-right">
//                         <p class="font-semibold text-lg text-slate-800">₱${product.price}</p>
//                         <button class="remove-item-btn text-sm text-[#E31C25] hover:text-red-600 font-semibold" data-slot-id="${slot.id}">Palitan</button>
//                     </div>
//                 `;
//             } else {
//                 slotDiv.innerHTML = `
//                     <div class="flex items-center gap-4">
//                         <i class="fas ${slot.icon} text-xl text-slate-400 w-6 text-center"></i>
//                         <h3 class="text-lg font-semibold text-slate-700">${slot.name} ${requiredText}</h3>
//                     </div>
//                     <button class="choose-btn bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-4 rounded-md transition-colors" data-slot-id="${slot.id}" data-type="${slot.type}">
//                         Pumili <i class="fas fa-chevron-right ml-2 text-xs"></i>
//                     </button>
//                 `;
//             }
//             componentSlotsContainer.appendChild(slotDiv);
//         });
//     };

//     const openModal = (slotId, type) => {
//         currentSlotId = slotId;
//         const slotInfo = componentStructure.find(s => s.id === slotId);
//         modalTitle.innerHTML = `<i class="fas ${slotInfo.icon} mr-3 text-[#E31C25]"></i> Pumili ng ${slotInfo.name}`;
//         modalBody.innerHTML = '';

//         const filteredProducts = products.filter(p => p.type === type);

//         if (filteredProducts.length === 0) {
//             modalBody.innerHTML = `<p class="text-center text-slate-500">Walang available na piyesa para sa kategoryang ito.</p>`;
//         } else {
//             filteredProducts.forEach(product => {
//                 const isSelected = selectedComponents[slotId] && selectedComponents[slotId].id === product.id;
//                 const itemDiv = document.createElement('div');
//                 itemDiv.className = `component-item flex justify-between items-center p-4 border rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-50 ${isSelected ? 'selected' : ''}`;
//                 itemDiv.innerHTML = `
//                     <div>
//                         <h5 class="font-bold text-slate-800">${product.name}</h5>
//                         <p class="text-sm text-slate-500">${product.description.substring(0, 100)}...</p>
//                         <p class="text-sm text-slate-500 mt-1">Rating: ${product.rate}/5 (${product.review} reviews)</p>
//                     </div>
//                     <div class="text-right flex-shrink-0 ml-4">
//                         <p class="font-semibold text-xl text-[#E31C25]">₱${product.price}</p>
//                          <button class="select-btn mt-2 bg-[#E31C25] text-white font-bold py-2 px-4 rounded-md" data-product-id="${product.id}">Piliin</button>
//                     </div>
//                 `;
//                 itemDiv.querySelector('.select-btn').addEventListener('click', () => selectComponent(product.id));
//                 modalBody.appendChild(itemDiv);
//             });
//         }
//         modal.classList.remove('hidden');
//     };

//     const closeModal = () => {
//         modal.classList.add('hidden');
//     };

//     const selectComponent = (productId) => {
//         const product = products.find(p => p.id === productId);
//         selectedComponents[currentSlotId] = product;
        
//         renderComponentSlots();
//         updateBuildSummary();
//         closeModal();
//     };
    
//     const removeComponent = (slotId) => {
//         delete selectedComponents[slotId];
//         renderComponentSlots();
//         updateBuildSummary();
//     };

//     componentSlotsContainer.addEventListener('click', (e) => {
//         if (e.target.closest('.choose-btn')) {
//             const button = e.target.closest('.choose-btn');
//             openModal(button.dataset.slotId, button.dataset.type);
//         }
//         if (e.target.closest('.remove-item-btn')) {
//             const button = e.target.closest('.remove-item-btn');
//             removeComponent(button.dataset.slotId);
//         }
//     });

//     closeModalBtn.addEventListener('click', closeModal);
//     modal.addEventListener('click', (e) => {
//         if (e.target === modal) {
//             closeModal();
//         }
//     });
    
//     clearBuildBtn.addEventListener('click', () => {
//         if(confirm('Sigurado ka bang gusto mong i-clear ang buong build?')) {
//             selectedComponents = {};
//             renderComponentSlots();
//             updateBuildSummary();
//         }
//     });

//     // Initial render
//     renderComponentSlots();
//     updateBuildSummary();
// });












document.addEventListener('DOMContentLoaded', () => {

    const componentSlotsContainer = document.getElementById('component-slots');
    const loadingState = document.getElementById('loading-state');
    const modal = document.getElementById('component-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const totalPriceEl = document.getElementById('total-price');
    const summaryContainer = document.getElementById('selected-components-summary');
    const compatibilityStatusEl = document.getElementById('overall-compatibility-status');
    const clearBuildBtn = document.getElementById('clear-build-btn');

    let allProducts = [];
    let selectedComponents = {};
    let currentSlotId = null;

    const componentStructure = [
        { id: 'cpu', name: 'Processor (CPU)', type: 'Processor', required: true, icon: 'fa-microchip' },
        { id: 'motherboard', name: 'Motherboard', type: 'Motherboard', required: true, icon: 'fa-server' },
        { id: 'memory', name: 'Memory (RAM)', type: 'Memory (RAM)', required: true, icon: 'fa-memory' },
        { id: 'storage', name: 'Storage', type: 'Storage (HDD / SSD)', required: true, icon: 'fa-hdd' },
        { id: 'gpu', name: 'Graphics Card (GPU)', type: 'Graphics Card', required: false, icon: 'fa-gamepad' },
        { id: 'case', name: 'PC Case', type: 'PC Case', required: true, icon: 'fa-box' },
        { id: 'psu', name: 'Power Supply (PSU)', type: 'Power Supply', required: true, icon: 'fa-box' },
        { id: 'cpu_cooler', name: 'CPU Cooler', type: 'CPU Cooling', required: false, icon: 'fa-fan' }
    ];

    // --- UTILITY FUNCTIONS ---
    const getAttribute = (product, keywords) => {
        const text = `${product.name} ${product.description}`.toLowerCase();
        for (const keyword of keywords) {
            if (text.includes(keyword.toLowerCase())) return keyword;
        }
        return null;
    };
    const getCpuSocket = (product) => getAttribute(product, ['AM4', 'AM5', 'LGA 1700']);
    const getRamType = (product) => getAttribute(product, ['DDR4', 'DDR5']);
    const getRamFormFactor = (product) => getAttribute(product, ['SODIMM']);
    const getMoboFormFactor = (product) => getAttribute(product, ['Micro-ATX', 'Micro ATX']);

    // --- COMPATIBILITY CHECK ---
    const checkCompatibility = () => {
        const issues = [];
        const { cpu, motherboard, memory, pccase, cpu_cooler } = selectedComponents;

        if (cpu && motherboard) {
            const cpuSocket = getCpuSocket(cpu);
            const moboSocket = getCpuSocket(motherboard);
            if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
                issues.push(`Socket Mismatch: CPU (${cpuSocket}) vs Motherboard (${moboSocket}).`);
            }
        }

        if (memory && motherboard) {
            const memType = getRamType(memory);
            const moboMemType = getRamType(motherboard);
            if (memType && moboMemType && memType !== moboMemType) {
                issues.push(`RAM Mismatch: Memory (${memType}) vs Motherboard (${moboMemType}).`);
            }
            if (getRamFormFactor(memory) === 'SODIMM') {
                issues.push(`Form Factor Warning: SODIMM RAM is for laptops, not desktops.`);
            }
        }
        
        if (pccase && motherboard) {
            const moboFormFactor = getMoboFormFactor(motherboard);
            const caseFormFactor = getMoboFormFactor(pccase);
             if (moboFormFactor && caseFormFactor && moboFormFactor !== caseFormFactor) {
                issues.push(`Fit Warning: Motherboard (${moboFormFactor}) may not fit in Case (${caseFormFactor}).`);
            }
        }
        
        if (cpu_cooler && cpu) {
            const cpuSocket = getCpuSocket(cpu);
             if (cpuSocket === 'AM5' && cpu_cooler.name.includes('Wraith Stealth')) {
                issues.push(`Cooling Warning: ${cpu_cooler.name} may be insufficient for ${cpu.name}.`);
            }
        }

        if (issues.length > 0) {
            return { compatible: false, message: `<i class="fas fa-exclamation-triangle text-orange-500 mr-2"></i>Compatibility Issues Found`, details: issues };
        }

        const allRequiredMet = componentStructure.every(slot => !slot.required || selectedComponents[slot.id]);
        if (!allRequiredMet) {
             return { compatible: false, message: `<i class="fas fa-info-circle text-[#E31C25] mr-2"></i>Please select all required parts`, details: [] };
        }
        
        return { compatible: true, message: `<i class="fas fa-check-circle text-green-500 mr-2"></i>Your build is compatible!`, details: [] };
    };

    // --- UI RENDERING ---
    const updateBuildSummary = () => {
        let totalPrice = 0;
        summaryContainer.innerHTML = '';

        const selectedIds = Object.keys(selectedComponents);

        if (selectedIds.length === 0) {
            summaryContainer.innerHTML = '<p class="text-slate-500 italic pt-4 text-center">No components selected yet.</p>';
            totalPriceEl.textContent = '$0.00';
            compatibilityStatusEl.innerHTML = 'Start by selecting a component.';
            compatibilityStatusEl.className = 'p-4 rounded-lg text-center font-semibold mb-4 text-slate-700 bg-slate-100';
            return;
        }

        selectedIds.forEach(slotId => {
            const product = selectedComponents[slotId];
            totalPrice += parseFloat(product.price);
            
            const slotInfo = componentStructure.find(s => s.id === slotId);
            const summaryItem = document.createElement('div');
            summaryItem.className = 'flex justify-between items-center';
            summaryItem.innerHTML = `
                <div>
                    <p class="font-semibold text-slate-800">${slotInfo.name}</p>
                    <p class="text-slate-500 truncate max-w-[180px]">${product.name}</p>
                </div>
                <p class="font-medium text-slate-700">$${product.price}</p>
            `;
            summaryContainer.appendChild(summaryItem);
        });

        totalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;

        const { message, details } = checkCompatibility();
        compatibilityStatusEl.innerHTML = message;
        if (details.length > 0) {
            const detailsList = document.createElement('ul');
            detailsList.className = 'list-disc list-inside text-left text-sm mt-2 font-normal';
            details.forEach(issue => {
                const listItem = document.createElement('li');
                listItem.textContent = issue;
                detailsList.appendChild(listItem);
            });
            compatibilityStatusEl.appendChild(detailsList);
        }
        // Update status color
        if (message.includes('Issues')) {
            compatibilityStatusEl.className = 'p-4 rounded-lg text-left font-semibold mb-4 text-orange-800 bg-orange-100';
        } else if (message.includes('compatible')) {
            compatibilityStatusEl.className = 'p-4 rounded-lg text-center font-semibold mb-4 text-green-800 bg-green-100';
        } else {
             compatibilityStatusEl.className = 'p-4 rounded-lg text-center font-semibold mb-4 text-blue-800 bg-blue-100';
        }
    };

    const renderComponentSlots = () => {
        componentSlotsContainer.innerHTML = '';
        componentStructure.forEach(slot => {
            const product = selectedComponents[slot.id];
            const slotDiv = document.createElement('div');
            slotDiv.className = 'component-slot flex items-center justify-between p-4 border border-slate-200 rounded-lg transition-all duration-300';
            slotDiv.id = `slot-${slot.id}`;
            
            const requiredText = slot.required ? `<span class="text-red-500 text-xs font-semibold ml-2">REQUIRED</span>` : '';

            if (product) {
                 slotDiv.innerHTML = `
                    <div class="flex items-center gap-4 min-w-0">
                       <i class="fas ${slot.icon} text-xl text-[#E31C25] w-6 text-center"></i>
                        <div class="min-w-0">
                            <h4 class="font-bold text-slate-800">${slot.name}</h4>
                            <p class="text-slate-600 truncate">${product.name}</p>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-4">
                        <p class="font-semibold text-lg text-slate-800">$${product.price}</p>
                        <button class="remove-item-btn text-sm text-[#E31C25] hover:text-red-600 font-semibold" data-slot-id="${slot.id}">Change</button>
                    </div>
                `;
            } else {
                slotDiv.innerHTML = `
                    <div class="flex items-center gap-4">
                        <i class="fas ${slot.icon} text-xl text-slate-400 w-6 text-center"></i>
                        <h3 class="text-lg font-semibold text-slate-600">${slot.name} ${requiredText}</h3>
                    </div>
                    <button class="choose-btn bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg transition-colors" data-slot-id="${slot.id}" data-type="${slot.type}">
                        Choose <i class="fas fa-chevron-right ml-2 text-xs"></i>
                    </button>
                `;
            }
            componentSlotsContainer.appendChild(slotDiv);
        });
    };

    // --- MODAL CONTROLS ---
    const openModal = (slotId, type) => {
        currentSlotId = slotId;
        const slotInfo = componentStructure.find(s => s.id === slotId);
        modalTitle.innerHTML = `<i class="fas ${slotInfo.icon} mr-3 text-[#E31C25]"></i> Select a ${slotInfo.name}`;
        modalBody.innerHTML = '';

        const filteredProducts = allProducts.filter(p => p.type === type);

        if (filteredProducts.length === 0) {
            modalBody.innerHTML = `<p class="text-center text-slate-500">No available parts for this category.</p>`;
        } else {
            filteredProducts.forEach(product => {
                const isSelected = selectedComponents[slotId]?.id === product.id;
                const itemDiv = document.createElement('div');
                itemDiv.className = `component-item flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border border-slate-200 rounded-lg transition-all duration-200 hover:border-[#E31C25] hover:bg-blue-50/50 ${isSelected ? 'selected' : ''}`;
                itemDiv.innerHTML = `
                    <div class="min-w-0">
                        <h5 class="font-bold text-slate-800">${product.name}</h5>
                        <p class="text-sm text-slate-500 mt-1">${product.description}</p>
                        <p class="text-sm text-slate-400 mt-2">Rating: ${product.rate}/5 (${product.review} reviews)</p>
                    </div>
                    <div class="text-left sm:text-right flex-shrink-0 ml-0 sm:ml-4 mt-4 sm:mt-0">
                        <p class="font-bold text-xl text-[#E31C25]">$${product.price}</p>
                         <button class="select-btn w-full sm:w-auto mt-2 bg-[#E31C25] text-white font-bold py-2 px-5 rounded-lg transition-colors hover:bg-[#cf0610]" data-product-id="${product.id}">Select</button>
                    </div>
                `;
                itemDiv.querySelector('.select-btn').addEventListener('click', () => selectComponent(product.id));
                modalBody.appendChild(itemDiv);
            });
        }
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore background scrolling
    };

    // --- EVENT HANDLERS ---
    const selectComponent = (productId) => {
        const product = allProducts.find(p => p.id === productId);
        selectedComponents[currentSlotId] = product;
        
        renderComponentSlots();
        updateBuildSummary();
        closeModal();
    };
    
    const removeComponent = (slotId) => {
        delete selectedComponents[slotId];
        renderComponentSlots();
        updateBuildSummary();
    };
    
    // --- MAIN INITIALIZATION ---
    function initializeApp(products) {
        allProducts = products;
        loadingState.classList.add('hidden');
        renderComponentSlots();
        updateBuildSummary();

        componentSlotsContainer.addEventListener('click', (e) => {
            const chooseBtn = e.target.closest('.choose-btn');
            const removeBtn = e.target.closest('.remove-item-btn');
            if (chooseBtn) {
                openModal(chooseBtn.dataset.slotId, chooseBtn.dataset.type);
            } else if (removeBtn) {
                removeComponent(removeBtn.dataset.slotId);
            }
        });

        clearBuildBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the entire build?')) {
                selectedComponents = {};
                renderComponentSlots();
                updateBuildSummary();
            }
        });
    }

    // --- DATA FETCHING ---
    fetch('../js/Item.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            initializeApp(data);
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            componentSlotsContainer.innerHTML = `<div class="text-center text-red-500 py-10 bg-red-50 rounded-lg">
                <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                <p class="font-semibold">Error: Could not load product data.</p>
                <p class="text-sm">Please ensure 'Item.json' is in the correct folder ('../js/Item.json) and is a valid JSON file.</p>
            </div>`;
        });
        
    // Modal closing listeners
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});
