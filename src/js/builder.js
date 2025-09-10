document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENT SELECTORS ---
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

    // --- NEW: Selectors for the Confirmation Modal ---
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmClearBtn = document.getElementById('confirm-clear-btn');
    const cancelClearBtn = document.getElementById('cancel-clear-btn');

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
        if (!product) return null;
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

    // --- RECOMMENDATION ENGINE ---
    const getCompatibilityInfo = (product, productType, currentSelection) => {
        const { cpu, motherboard } = currentSelection;

        if (productType === 'Motherboard' && cpu) {
            const cpuSocket = getCpuSocket(cpu);
            const moboSocket = getCpuSocket(product);
            if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
                return { compatible: false, reason: `Socket Mismatch: Requires ${cpuSocket}` };
            }
        }

        if (productType === 'Processor' && motherboard) {
            const moboSocket = getCpuSocket(motherboard);
            const cpuSocket = getCpuSocket(product);
            if (moboSocket && cpuSocket && moboSocket !== cpuSocket) {
                return { compatible: false, reason: `Socket Mismatch: Requires ${moboSocket}` };
            }
        }

        if (productType === 'Memory (RAM)' && motherboard) {
            const moboRamType = getRamType(motherboard);
            const memRamType = getRamType(product);
            if (moboRamType && memRamType && moboRamType !== memRamType) {
                return { compatible: false, reason: `RAM Type Mismatch: Requires ${moboRamType}` };
            }
        }
        
        if (getRamFormFactor(product) === 'SODIMM') {
            return { compatible: false, reason: 'SODIMM RAM is for laptops, not desktops.'};
        }

        return { compatible: true, reason: null };
    };

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
            totalPriceEl.textContent = '₱0.00';
            compatibilityStatusEl.innerHTML = 'Start by selecting a component.';
            compatibilityStatusEl.className = 'p-4 rounded-[15px] text-center font-bold mb-4 text-slate-700 bg-slate-100';
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
                    <p class="font-bold text-slate-800">${slotInfo.name}</p>
                    <p class="text-slate-500 truncate max-w-[180px]">${product.name}</p>
                </div>
                <p class="font-medium text-slate-700">₱${product.price}</p>
            `;
            summaryContainer.appendChild(summaryItem);
        });

        totalPriceEl.textContent = `₱${totalPrice.toFixed(2)}`;

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
        
        if (message.includes('Issues')) {
            compatibilityStatusEl.className = 'p-4 rounded-[15px] text-left font-bold mb-4 text-orange-800 bg-orange-100';
        } else if (message.includes('compatible')) {
            compatibilityStatusEl.className = 'p-4 rounded-[15px] text-center font-bold mb-4 text-green-800 bg-green-100';
        } else {
             compatibilityStatusEl.className = 'p-4 rounded-[15px] text-center font-bold mb-4 text-blue-800 bg-blue-100';
        }
    };

    const renderComponentSlots = () => {
        componentSlotsContainer.innerHTML = '';
        componentStructure.forEach(slot => {
            const product = selectedComponents[slot.id];
            const slotDiv = document.createElement('div');
            slotDiv.className = 'component-slot flex items-center justify-between p-4 border border-slate-200 rounded-[15px] transition-all duration-300';
            slotDiv.id = `slot-${slot.id}`;
            
            const requiredText = slot.required ? `<span class="text-red-500 text-[10px] lg:text-md font-bold ml-2">REQUIRED</span>` : '';

            if (product) {
                 const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : 'https://via.placeholder.com/150';
                 slotDiv.innerHTML = `
                    <div class="flex items-center gap-4 min-w-0">
                       <img src="${imageUrl}" alt="${product.name}" class="w-16 h-16 object-contain rounded-md flex-shrink-0 bg-white p-1 border">
                        <div class="min-w-0">
                            <h4 class="font-bold text-slate-800">${slot.name}</h4>
                            <p class="text-slate-600 truncate">${product.name}</p>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-4">
                        <p class="font-bold text-sm lg:text-lg text-slate-800">₱${product.price}</p>
                        <button class="remove-item-btn text-sm lg:text-lg text-[#E31C25] hover:text-red-600 font-bold" data-slot-id="${slot.id}">Change</button>
                    </div>
                `;
            } else {
                slotDiv.innerHTML = `
                    <div class="flex items-center gap-4">
                        <i class="fas ${slot.icon} text-xl text-slate-400 w-6 text-center"></i>
                        <h3 class="text-sm lg:text-lg font-bold text-slate-600">${slot.name} ${requiredText}</h3>
                    </div>
                    <button class="choose-btn bg-[#E31C25] hover:bg-[#cf1c25] text-sm lg:text-lg text-[#FFFFFF] font-bold py-2 px-4 rounded-[15px] transition-colors" data-slot-id="${slot.id}" data-type="${slot.type}">
                        Choose <i class="fas fa-chevron-right ml-2 text-sm lg:text-lg"></i>
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
        
        modalBody.innerHTML = `
            <div class="flex items-center justify-end mb-4 px-4 sm:px-0">
                <label for="compat-toggle" class="mr-3 text-sm font-medium text-slate-700">Show only compatible parts</label>
                <input type="checkbox" id="compat-toggle" class="h-4 w-4 rounded border-slate-300 text-[#E31C25] focus:ring-[#E31C25]" checked>
            </div>
            <div id="modal-product-list" class="space-y-3"></div>
        `;

        const productListContainer = document.getElementById('modal-product-list');
        const compatToggle = document.getElementById('compat-toggle');

        const renderProductsInModal = () => {
            productListContainer.innerHTML = ''; 
            const showOnlyCompatible = compatToggle.checked;
            const availableProducts = allProducts.filter(p => p.type === type);
            let displayedCount = 0;

            if (availableProducts.length === 0) {
                productListContainer.innerHTML = `<p class="text-center text-slate-500">No available parts for this category.</p>`;
                return;
            }

            availableProducts.forEach(product => {
                const { compatible, reason } = getCompatibilityInfo(product, type, selectedComponents);
                if (showOnlyCompatible && !compatible) {
                    return; // Skip rendering this item
                }
                displayedCount++;

                const isSelected = selectedComponents[slotId]?.id === product.id;
                const itemDiv = document.createElement('div');
                itemDiv.className = `component-item flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border rounded-[15px] transition-all duration-200 ${!compatible ? 'border-orange-300 bg-orange-50/50' : 'border-slate-200 hover:border-[#E31C25] hover:bg-blue-50/50'} ${isSelected ? 'selected' : ''}`;
                
                const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : 'https://via.placeholder.com/150';
                
                let compatibilityHTML = '';
                if (!compatible) {
                    compatibilityHTML = `<p class="text-xs text-orange-600 mt-2 font-bold"><i class="fas fa-exclamation-triangle mr-1"></i> Incompatible: ${reason}</p>`;
                }
                
                itemDiv.innerHTML = `
                    <div class="flex items-center gap-4 min-w-0">
                        <img src="${imageUrl}" alt="${product.name}" class="w-20 h-20 object-contain rounded-[15px] flex-shrink-0 bg-white p-1 border">
                        <div class="min-w-0">
                            <h5 class="font-bold text-slate-800">${product.name}</h5>
                            <p class="text-sm text-slate-500 mt-1">${product.description}</p>
                            <p class="text-sm text-slate-400 mt-2">Rating: ${product.rate}/5 (${product.review} reviews)</p>
                             ${compatibilityHTML}
                        </div>
                    </div>
                    <div class="text-left sm:text-right flex-shrink-0 ml-0 sm:ml-4 mt-4 sm:mt-0">
                        <p class="font-bold text-xl text-[#E31C25]">₱${product.price}</p>
                         <button class="select-btn w-full sm:w-auto mt-2 font-bold py-2 px-5 rounded-[15px] transition-colors ${compatible ? 'bg-[#E31C25] text-white hover:bg-[#cf0610]' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}" data-product-id="${product.id}" ${!compatible ? 'disabled' : ''}>Select</button>
                    </div>
                `;
                if(compatible) {
                    itemDiv.querySelector('.select-btn').addEventListener('click', () => selectComponent(product.id));
                }
                productListContainer.appendChild(itemDiv);
            });
            
            if (displayedCount === 0) {
                 productListContainer.innerHTML = `<p class="text-center text-slate-500">No compatible parts found for your current selection.</p>`;
            }
        };
        compatToggle.addEventListener('change', renderProductsInModal);
        renderProductsInModal(); // Initial render

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
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

        // --- NEW: Event Listeners for Custom Confirmation Modal ---
        clearBuildBtn.addEventListener('click', () => {
            confirmationModal.classList.remove('hidden');
        });

        cancelClearBtn.addEventListener('click', () => {
            confirmationModal.classList.add('hidden');
        });

        confirmClearBtn.addEventListener('click', () => {
            selectedComponents = {};
            renderComponentSlots();
            updateBuildSummary();
            confirmationModal.classList.add('hidden');
        });
        
        confirmationModal.addEventListener('click', (event) => {
            if (event.target === confirmationModal) {
                confirmationModal.classList.add('hidden');
            }
        });
    }

    // --- DATA FETCHING ---
    fetch('../data/Item.json')
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
            loadingState.classList.add('hidden');
            componentSlotsContainer.innerHTML = `<div class="text-center text-red-500 py-10 bg-red-50 rounded-[15px]">
                <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                <p class="font-bold">Error: Could not load product data.</p>
                <p class="text-sm">Please ensure 'Item.json' is in the correct folder and is a valid JSON file.</p>
            </div>`;
        });
        
    // Modal closing listeners
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});