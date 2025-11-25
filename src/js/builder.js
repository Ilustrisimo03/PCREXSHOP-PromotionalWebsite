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

    // --- Action Buttons ---
    const clearBuildBtn = document.getElementById('clear-build-btn');
    const saveBuildBtn = document.getElementById('save-build-btn');
    const loadBuildBtn = document.getElementById('load-build-btn');

    // --- Confirmation Modal Selectors ---
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmModalIcon = document.getElementById('confirm-modal-icon');
    const confirmModalTitle = document.getElementById('confirm-modal-title');
    const confirmModalMessage = document.getElementById('confirm-modal-message');
    const confirmActionBtn = document.getElementById('confirm-action-btn');
    const cancelActionBtn = document.getElementById('cancel-action-btn');

    // --- Toast Selectors ---
    const successToast = document.getElementById('success-toast');
    const toastMessage = document.getElementById('toast-message');
    const errorToast = document.getElementById('error-toast');
    const errorToastMessage = document.getElementById('error-toast-message');

    let allProducts = [];
    let selectedComponents = {}; // Stores selected products by slotId
    let currentSlotId = null; // Used for the modal to know which slot is being chosen for

    // Store a reference to the active confirmation callback
    let activeConfirmCallback = null;

    // --- Component Structure (Updated to match the provided React structure more closely for IDs and types) ---
    const componentStructure = [
        { id: 'cpu', name: 'Processor (CPU)', type: 'Processor', required: false, icon: 'fa-microchip' },
        { id: 'motherboard', name: 'Motherboard', type: 'Motherboard', required: false, icon: 'fa-network-wired' },
        { id: 'memory', name: 'Memory (RAM)', type: 'Memory (RAM)', required: false, icon: 'fa-memory' },
        { id: 'ssd_sata', name: 'SSD (SATA)', type: 'SSD', subType: 'SATA', required: false, icon: 'fa-hard-drive' },
        { id: 'ssd_m2', name: 'SSD (M.2)', type: 'SSD', subType: 'M.2', required: false, icon: 'fa-hard-drive' },
        { id: 'hdd', name: 'HDD', type: 'HDD', required: false, icon: 'fa-compact-disc' },
        { id: 'gpu', name: 'Graphics Card (GPU)', type: 'Graphics Card', required: false, icon: 'fa-gamepad' },
        { id: 'pccase', name: 'PC Case', type: 'PC Case', required: false, icon: 'fa-box' }, 
        { id: 'psu', name: 'Power Supply (PSU)', type: 'Power Supply', required: false, icon: 'fa-power-off' },
        { id: 'cpu_cooler', name: 'CPU Cooler', type: 'CPU Cooling', required: false, icon: 'fa-fan' }
    ];

    // --- UTILITY FUNCTIONS ---
    const formatPrice = (value) => {
        const num = parseFloat(value);
        if (Number.isInteger(num)) {
            return `₱${num.toLocaleString()}`;
        } else {
            return `₱${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    };

    const getAttribute = (product, keywords) => {
        if (!product) return null;
        const text = `${product.name} ${product.description || ''}`.toLowerCase();
        for (const keyword of keywords) {
            if (text.includes(keyword.toLowerCase())) return keyword;
        }
        return null;
    };

    const getCpuSocket = (product) => getAttribute(product, ['AM4', 'AM5', 'LGA 1700']);
    const getRamType = (product) => getAttribute(product, ['DDR4', 'DDR5']);
    const getRamFormFactor = (product) => getAttribute(product, ['SODIMM']);
    const getMoboFormFactor = (product) => getAttribute(product, ['Micro-ATX', 'Micro ATX', 'Mini-ITX', 'ATX', 'E-ATX']);
    const getStorageType = (product) => {
        if (!product) return null;
        const text = `${product.name} ${product.description || ''}`.toLowerCase();

        if (text.includes('m.2') || text.includes('nvme')) {
            return 'M.2';
        }
        if (text.includes('sata')) {
            return 'SATA';
        }
        if (product.type === 'HDD') {
            return 'SATA'; // HDDs are generally SATA
        }
        if (product.type === 'SSD') {
            return 'SATA'; // Default SSDs without explicit M.2/NVMe/SATA mention to SATA
        }
        return null;
    };

    const hasIntegratedGraphics = (cpu) => {
        if (!cpu) return false;
        const cpuName = cpu.name.toLowerCase();
        if (cpuName.includes('intel') && cpuName.includes('f')) {
            return false;
        }
        if (cpuName.includes('ryzen') && cpuName.includes('g')) {
            return true;
        }
        if (cpuName.includes('intel')) {
            return true;
        }
        if (cpuName.includes('ryzen') && (cpu.description || '').toLowerCase().includes('radeon graphics')) {
            return true;
        }
        return false;
    };

    // --- COMPATIBILITY LOGIC ---
    const getCompatibilityInfo = (product, productType, currentSlotIdToCheck, currentSelection) => {
        const { cpu, motherboard, pccase, gpu } = currentSelection;
        const issues = [];

        // Universal check: Product already selected in another slot (prevent duplicates, except RAM)
        const isDuplicate = Object.values(currentSelection).some(
            (selectedItem) => selectedItem && selectedItem.id === product.id && currentSlotIdToCheck !== 'memory'
        );
        if (isDuplicate) {
             issues.push('This item is already in your build.');
        }

        // Motherboard compatibility with CPU
        if (productType === 'Motherboard' && cpu) {
            const cpuSocket = getCpuSocket(cpu);
            const moboSocket = getCpuSocket(product);
            if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
                issues.push(`Socket Mismatch: Requires ${cpuSocket}`);
            }
        }
        // Processor compatibility with Motherboard
        if (productType === 'Processor' && motherboard) {
            const moboSocket = getCpuSocket(motherboard);
            const cpuSocket = getCpuSocket(product);
            if (moboSocket && cpuSocket && moboSocket !== cpuSocket) {
                issues.push(`Socket Mismatch: Requires ${moboSocket}`);
            }
        }
        // Memory (RAM) compatibility with Motherboard
        if (productType === 'Memory (RAM)' && motherboard) {
            const moboRamType = getRamType(motherboard);
            const memRamType = getRamType(product);
            if (moboRamType && memRamType && moboRamType !== memRamType) {
                issues.push(`RAM Type Mismatch: Requires ${moboRamType}`);
            }
            if (getRamFormFactor(product) === 'SODIMM') {
                issues.push('SODIMM RAM is for laptops, not desktops.');
            }
        }
        // PC Case compatibility with Motherboard
        if (productType === 'PC Case' && motherboard) {
            const moboFormFactor = getMoboFormFactor(motherboard);
            const caseDescription = (product.description || '').toLowerCase();
            let caseSupportsMobo = false;

            if (moboFormFactor === 'Mini-ITX' && (caseDescription.includes('mini-itx') || caseDescription.includes('itx'))) caseSupportsMobo = true;
            else if (moboFormFactor === 'Micro-ATX' && (caseDescription.includes('micro-atx') || caseDescription.includes('m-atx') || caseDescription.includes('atx'))) caseSupportsMobo = true;
            else if (moboFormFactor === 'ATX' && caseDescription.includes('atx')) caseSupportsMobo = true;
            // Add other form factors if necessary (E-ATX)

            if (moboFormFactor && !caseSupportsMobo) {
                issues.push(`Motherboard Form Factor Mismatch: Case may not explicitly support ${moboFormFactor}.`);
            }
        }
        // CPU Cooler compatibility with CPU (basic check)
        if (productType === 'CPU Cooling' && cpu) {
            const cpuSocket = getCpuSocket(cpu);
            const coolerDescription = (product.description || '').toLowerCase();
            if (cpuSocket === 'AM5' && (coolerDescription.includes('wraith stealth') || coolerDescription.includes('stock cooler'))) {
                 issues.push(`Cooling Warning: ${product.name} may be insufficient for high-performance AM5 CPUs. Consider an aftermarket cooler.`);
            }
            if (cpuSocket === 'AM4' && (cpu.name || '').toLowerCase().includes('ryzen 7') && (coolerDescription.includes('wraith stealth') || coolerDescription.includes('stock cooler'))) {
                issues.push(`Cooling Warning: ${product.name} may be insufficient for high-performance AM4 Ryzen 7/9 CPUs.`);
            }
            if (cpuSocket && !(coolerDescription.includes((cpuSocket || '').toLowerCase().replace(/\s/g, '')) || coolerDescription.includes('lga') || coolerDescription.includes('amd'))) {
                 issues.push(`Socket Compatibility: Cooler may not explicitly support ${cpuSocket}.`);
            }
        }

        // Storage specific checks for the MODAL when choosing a component
        if (productType === 'SSD') {
            const currentProductStorageType = getStorageType(product);
            if (currentSlotIdToCheck === 'ssd_sata' && currentProductStorageType !== 'SATA') {
                issues.push(`This slot requires a SATA SSD. This is an ${currentProductStorageType} SSD.`);
            } else if (currentSlotIdToCheck === 'ssd_m2' && currentProductStorageType !== 'M.2') {
                issues.push(`This slot requires an M.2 SSD. This is a ${currentProductStorageType} SSD.`);
            }
        } else if (productType === 'HDD') {
            if (product.type !== 'HDD' || getStorageType(product) !== 'SATA') {
                 issues.push(`This slot requires a SATA HDD. This is a ${product.type || 'unknown'} (${getStorageType(product) || 'unknown'}) drive.`);
            }
        }

        // PSU Wattage (basic check, can be greatly expanded)
        if (productType === 'Power Supply') {
            const estimatedWattage = 300; // Placeholder
            const psuWattageMatch = (product.name || '').match(/(\d{3,4})\s*w/i);
            const psuWattage = psuWattageMatch ? parseInt(psuWattageMatch[1]) : 0;
            if (psuWattage > 0 && psuWattage < estimatedWattage) {
                 issues.push(`Power Warning: ${product.name} (${psuWattage}W) might be too low for a typical build (est. ${estimatedWattage}W).`);
            }
        }

        return { compatible: issues.length === 0, reason: issues.join('; ') };
    };

    const checkOverallBuildCompatibility = () => {
        const issues = [];
        const { cpu, motherboard, memory, pccase, cpu_cooler, ssd_sata, ssd_m2, hdd, psu, gpu } = selectedComponents;

        // Core component presence checks
        if (motherboard && !cpu) issues.push('A Processor is needed for the Motherboard.');
        if (cpu && !motherboard) issues.push('A Motherboard is needed to connect the Processor.');
        // RAM is "required" for a functional build, but allowing flexibility in initial choice
        // if (motherboard && !memory) issues.push('Memory (RAM) is usually required for a functional system with a Motherboard.');
        if (motherboard && !pccase) issues.push('A PC Case is typically needed to house the Motherboard.');
        if (motherboard && !psu) issues.push('A Power Supply Unit (PSU) is essential to power the Motherboard and other components.');

        // CPU & Motherboard Compatibility
        if (cpu && motherboard) {
            const cpuSocket = getCpuSocket(cpu);
            const moboSocket = getCpuSocket(motherboard);
            if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
                issues.push(`Socket Mismatch: CPU (${cpuSocket}) vs Motherboard (${moboSocket}).`);
            }
            const moboRamType = getRamType(motherboard);
            if (!moboRamType) {
                 issues.push('Motherboard RAM type could not be determined.');
            }
        }

        // Memory & Motherboard Compatibility
        if (memory && motherboard) {
            const memType = getRamType(memory);
            const moboMemType = getRamType(motherboard);
            if (memType && moboMemType && memType !== moboMemType) {
                issues.push(`RAM Mismatch: Memory (${memType}) vs Motherboard (${moboMemType}).`);
            }
            if (getRamFormFactor(memory) === 'SODIMM') {
                issues.push(`Form Factor Warning: SODIMM RAM is for laptops, not desktops.`);
            }
        } else if (memory && !motherboard) {
            issues.push('Memory (RAM) needs a Motherboard to be compatible with.');
        }

        // PC Case & Motherboard Compatibility
        if (pccase && motherboard) {
            const moboFormFactor = getMoboFormFactor(motherboard);
            const caseDescription = (pccase.description || '').toLowerCase();
            let caseSupportsMobo = false;
            if (moboFormFactor === 'Mini-ITX' && (caseDescription.includes('mini-itx') || caseDescription.includes('itx'))) caseSupportsMobo = true;
            else if (moboFormFactor === 'Micro-ATX' && (caseDescription.includes('micro-atx') || caseDescription.includes('m-atx') || caseDescription.includes('atx'))) caseSupportsMobo = true;
            else if (moboFormFactor === 'ATX' && caseDescription.includes('atx')) caseSupportsMobo = true;

            if (moboFormFactor && !caseSupportsMobo) {
                issues.push(`Fit Warning: Motherboard (${moboFormFactor}) may not fit in Case (${pccase.name}).`);
            }
        } else if (pccase && !motherboard) {
            issues.push('A PC Case needs a Motherboard to determine compatibility.');
        }

        // CPU Cooler & CPU Compatibility
        if (cpu_cooler && cpu) {
            const cpuSocket = getCpuSocket(cpu);
            const coolerDescription = (cpu_cooler.description || '').toLowerCase();
            if (cpuSocket === 'AM5' && (coolerDescription.includes('wraith stealth') || coolerDescription.includes('stock cooler'))) {
                issues.push(`Cooling Warning: ${cpu_cooler.name} may be insufficient for high-performance ${cpu.name}.`);
            }
             if (cpuSocket && !(coolerDescription.includes((cpuSocket || '').toLowerCase().replace(/\s/g, '')) || coolerDescription.includes('lga') || coolerDescription.includes('amd'))) {
                 issues.push(`Socket Compatibility: Cooler (${cpu_cooler.name}) may not explicitly support ${cpuSocket}.`);
            }
        } else if (cpu_cooler && !cpu) {
            issues.push('A CPU Cooler needs a Processor to determine compatibility.');
        }

        // Storage checks
        const hasAnyBootableStorage = (ssd_sata && getStorageType(ssd_sata) === 'SATA') || (ssd_m2 && getStorageType(ssd_m2) === 'M.2') || (hdd && hdd.type === 'HDD');
        
        if (cpu && motherboard && !hasAnyBootableStorage) {
            issues.push('At least one bootable storage device (SATA SSD/HDD or M.2 SSD) is usually needed for a functional PC.');
        }

        // Specific storage slot type mismatches
        if (ssd_sata && getStorageType(ssd_sata) !== 'SATA') {
            issues.push(`SSD (SATA) slot has an incompatible drive type: ${getStorageType(ssd_sata)} SSD.`);
        }
        if (ssd_m2 && getStorageType(ssd_m2) !== 'M.2') {
            issues.push(`SSD (M.2) slot has an incompatible drive type: ${getStorageType(ssd_m2)} SSD.`);
        }
        if (hdd && getStorageType(hdd) !== 'SATA') {
            issues.push(`HDD slot has an incompatible drive type: ${getStorageType(hdd)} (expected SATA HDD).`);
        } else if (hdd && hdd.type !== 'HDD') {
            issues.push(`HDD slot has a non-HDD item: ${hdd.name}.`);
        }

        // GPU / Integrated Graphics check
        if (cpu && !gpu && !hasIntegratedGraphics(cpu)) {
            issues.push(`Display Warning: The selected CPU (${cpu.name}) likely does not have integrated graphics. A Graphics Card (GPU) is required for display output.`);
        }

        // PSU Wattage
        if (psu && cpu && (gpu || hasIntegratedGraphics(cpu))) {
            let estimatedBuildWattage = 100;
            if (cpu) estimatedBuildWattage += 65;
            if (gpu) estimatedBuildWattage += 150;
            
            const psuWattageMatch = (psu.name || '').match(/(\d{3,4})\s*w/i);
            const psuWattage = psuWattageMatch ? parseInt(psuWattageMatch[1]) : 0;

            if (psuWattage > 0 && psuWattage < (estimatedBuildWattage * 1.2)) {
                 issues.push(`Power Warning: PSU (${psuWattage}W) might be undersized for this build (estimated need ~${Math.ceil(estimatedBuildWattage * 1.2)}W).`);
            }
        } else if (!psu && (cpu || motherboard)) {
             issues.push('A Power Supply Unit (PSU) is required to power the system.');
        }

        // Check if all required components are selected
        const allRequiredMet = componentStructure.every(slot => !slot.required || selectedComponents[slot.id]);
        if (!allRequiredMet && Object.keys(selectedComponents).length > 0) { // Only show this if some components are picked but not all required
             issues.push('Please select all required parts for a functional build.');
        }


        if (Object.keys(selectedComponents).length === 0) {
            return { compatible: false, status: 'empty', message: 'Start by adding components to your build.', details: [] };
        } else if (issues.length > 0) {
            return { compatible: false, status: 'issues', message: 'Potential Compatibility Issues Found or Incomplete Build', details: issues };
        } else {
            return { compatible: true, status: 'compatible', message: 'Your build looks good!', details: [] };
        }
    };

    // --- UI RENDERING ---
    const updateBuildSummary = () => {
        let totalPrice = 0;
        summaryContainer.innerHTML = '';

        const selectedIds = Object.keys(selectedComponents);

        if (selectedIds.length === 0) {
            summaryContainer.innerHTML = '<p class="text-gray-500 italic pt-4 text-center">No components selected yet.</p>';
            totalPriceEl.textContent = formatPrice(0);
            compatibilityStatusEl.innerHTML = '<i class="fas fa-info-circle text-blue-500 mr-2"></i>Start by selecting a component.';
            compatibilityStatusEl.className = 'p-4 rounded-lg text-center font-semibold mb-4 text-blue-800 bg-blue-100';
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
                    <p class="font-bold text-gray-800">${slotInfo.name}</p>
                    <p class="text-gray-500 truncate max-w-[180px]">${product.name}</p>
                </div>
                <p class="font-bold text-blue-700">${formatPrice(product.price)}</p>
            `;
            summaryContainer.appendChild(summaryItem);
        });

        totalPriceEl.textContent = formatPrice(totalPrice);

        const { status, message, details } = checkOverallBuildCompatibility();
        compatibilityStatusEl.innerHTML = `<i class="${status === 'compatible' ? 'fas fa-check-circle text-green-500' : (status === 'issues' ? 'fas fa-exclamation-triangle text-orange-500' : 'fas fa-info-circle text-blue-500')} mr-2"></i> ${message}`;
        
        if (details.length > 0) {
            const detailsList = document.createElement('ul');
            detailsList.className = 'list-disc list-inside text-left text-sm mt-2 font-normal text-gray-700';
            details.forEach(issue => {
                const listItem = document.createElement('li');
                listItem.textContent = issue;
                detailsList.appendChild(listItem);
            });
            compatibilityStatusEl.appendChild(detailsList);
        }
        
        if (status === 'issues') {
            compatibilityStatusEl.className = 'p-4 rounded-lg text-left font-semibold mb-4 text-orange-800 bg-orange-100';
        } else if (status === 'compatible') {
            compatibilityStatusEl.className = 'p-4 rounded-lg text-center font-semibold mb-4 text-green-800 bg-green-100';
        } else { // empty or info
             compatibilityStatusEl.className = 'p-4 rounded-lg text-center font-semibold mb-4 text-blue-800 bg-blue-100';
        }
    };

    const renderComponentSlots = () => {
        componentSlotsContainer.innerHTML = '';
        componentStructure.forEach(slot => {
            const product = selectedComponents[slot.id];
            const slotDiv = document.createElement('div');
            // ... (previous builder.js content up to slotDiv.className)

            slotDiv.className = 'component-slot flex items-center justify-between p-3 border-b border-gray-200 transition-all duration-300 hover:shadow-sm';
            slotDiv.id = `slot-${slot.id}`;
            
            const requiredText = slot.required ? `<span class="text-red-500 text-xs font-bold ml-2">(REQUIRED)</span>` : '';

            if (product) {
                 const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : 'https://via.placeholder.com/150/f1f5f9/94a3b8?text=No+Image';
                 slotDiv.innerHTML = `
                    <div class="flex items-center gap-4 min-w-0">
                       <img src="${imageUrl}" alt="${product.name}" class="w-16 h-16 object-contain rounded-lg flex-shrink-0 bg-white p-1">
                        <div class="min-w-0">
                            <h4 class="text-[#1C1C1C] truncate text-lg font-bold">${product.name}</h4>
                            <p class="text-md text-gray-800">${slot.name}</p>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-4">
                        <p class="font-bold text-lg text-gray-800">${formatPrice(product.price)}</p>
                        <button class="remove-item-btn text-blue-700 hover:text-blue-800 text-sm font-bold" data-slot-id="${slot.id}">Change</button>
                    </div>
                `;
            } else {
                slotDiv.innerHTML = `
                    <div class="flex items-center gap-4">
                        <i class="fas ${slot.icon} text-xl sm:text-xl text-gray-400 w-6 text-center"></i>
                        <h3 class="text-[17px] sm:text-lg font-bold text-gray-600">${slot.name} ${requiredText}</h3>
                    </div>
                    <button class="choose-btn BG-gradient text-white font-bold py-3 px-3 sm:py-3 sm:px-6 rounded-lg text-[8px] sm:text-sm transition-colors hover:opacity-90" data-slot-id="${slot.id}" data-type="${slot.type}" data-subtype="${slot.subType || ''}">
                        Choose 
                        <i class="fas fa-chevron-right text-[8px] md:text-sm sm:text-sm"></i> <!-- Responsive icon size -->
                    </button>
                `;
            }
            componentSlotsContainer.appendChild(slotDiv);
        });
    };

    // --- MODAL CONTROLS ---
    const openModal = (slotId, type, subType) => {
        currentSlotId = slotId;
        const slotInfo = componentStructure.find(s => s.id === slotId);
        modalTitle.innerHTML = `<i class="fas ${slotInfo.icon} mr-3 text-blue-700"></i> Select a ${slotInfo.name}`;
        
        modalBody.innerHTML = `
            <div class="flex items-center justify-end mb-4 px-4 sm:px-0">
                <label for="compat-toggle" class="mr-3 text-sm font-medium text-gray-700">Show only compatible parts</label>
                <input type="checkbox" id="compat-toggle" class="h-4 w-4 rounded border-blue-700 text-blue-700 focus:ring-blue-700" checked>
            </div>
            <div id="modal-product-list" class="space-y-3"></div>
        `;

        const productListContainer = document.getElementById('modal-product-list');
        const compatToggle = document.getElementById('compat-toggle');

        const renderProductsInModal = () => {
        productListContainer.innerHTML = '';
        const showOnlyCompatible = compatToggle.checked;

        // Determine current slot details from the global state/variables
        // Assuming 'type', 'subType', 'currentSlotId', 'slotId' are available in the scope
        // For example, if currentSlot is a global object as in the first example:
        // const currentSlot = { id: currentSlotId, type: type, subType: subType };

        let availableProducts = allProducts.filter(p => p.type === type); // Initial filter by main type

        // --- Refined filtering by subType for SSD and HDD, similar to renderModalProductList ---
        // Note: The original renderProductsInModal used 'subType' and 'type' directly,
        // which aligns with how currentSlot?.id implies these for storage.
        if (subType === 'SATA' && type === 'SSD') { // Equivalent to currentSlot?.id === 'ssd_sata'
            availableProducts = availableProducts.filter(p => getStorageType(p) === 'SATA');
        } else if (subType === 'M.2' && type === 'SSD') { // Equivalent to currentSlot?.id === 'ssd_m2'
            availableProducts = availableProducts.filter(p => getStorageType(p) === 'M.2');
        } else if (type === 'HDD') { // Equivalent to currentSlot?.id === 'hdd'
            // Ensure it's an actual HDD type and detected as SATA
            availableProducts = availableProducts.filter(p => p.type === 'HDD' && getStorageType(p) === 'SATA');
        }

        // --- NEW: Filter out products with 0 stock (added based on first example's logic) ---
        // Assuming 'stock' property exists on product objects
        availableProducts = availableProducts.filter(p => p.stock > 0);


        // --- Handle case where no parts are available after initial filtering ---
        if (availableProducts.length === 0) {
            productListContainer.innerHTML = `<p class="text-center text-gray-500 py-10">No parts available for this category.</p>`;
            return;
        }

        // --- Apply compatibility filter if showOnlyCompatible is true ---
        const filteredProducts = showOnlyCompatible ?
            availableProducts.filter(p => getCompatibilityInfo(p, type, currentSlotId, selectedComponents).compatible) :
            availableProducts;

        // --- Handle case where no compatible parts are found after compatibility filtering ---
        if (filteredProducts.length === 0) {
            productListContainer.innerHTML = `<p class="text-center text-gray-500 py-10">No compatible parts found for your current selection.</p>`;
            return;
        }

        // Now render the filteredProducts
        filteredProducts.forEach(product => {
            const { compatible, reason } = getCompatibilityInfo(product, type, currentSlotId, selectedComponents);
            // Note: With the new filtering, if showOnlyCompatible is true, 'compatible' will always be true here.
            // If showOnlyCompatible is false, 'compatible' can still be false for some items, which will be styled differently.

            const isSelected = selectedComponents[slotId]?.id === product.id;
            const itemDiv = document.createElement('div');
            itemDiv.className = `component-item flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border rounded-xl transition-all duration-200
                                ${!compatible ? 'border-orange-300 bg-orange-50' : 'border-gray-200 hover:border-blue-700 hover:bg-blue-50'}
                                ${isSelected ? 'selected' : ''}`;

            const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : 'https://via.placeholder.com/150/f1f5f9/94a3b8?text=No+Image';

            let compatibilityHTML = '';
            if (!compatible) {
                compatibilityHTML = `<p class="text-xs text-orange-600 mt-2 font-bold"><i class="fas fa-exclamation-triangle mr-1"></i> Incompatible: ${reason}</p>`;
            }

            itemDiv.innerHTML = `
                <div class="flex items-center gap-4 min-w-0">
                    <img src="${imageUrl}" alt="${product.name}" class="w-20 h-20 object-contain rounded-lg flex-shrink-0 bg-white p-1 border border-gray-200">
                    <div class="min-w-0">
                        <h5 class="font-bold text-gray-800">${product.name}</h5>
                        <p class="text-sm text-gray-500 mt-1">${product.description || ''}</p>
                        ${compatibilityHTML}
                    </div>
                </div>
                <div class="text-left sm:text-right flex-shrink-0 ml-0 sm:ml-4 mt-4 sm:mt-0">
                    <p class="font-bold text-xl text-blue-700">${formatPrice(product.price)}</p>
                    <button class="select-btn w-full sm:w-auto mt-2 font-bold py-2 px-5 rounded-lg transition-colors
                    ${compatible ? 'BG-gradient text-white hover:opacity-90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}"
                    data-product-id="${product.id}" ${!compatible ? 'disabled' : ''}>Select</button>
                </div>
            `;
            if (compatible) {
                itemDiv.querySelector('.select-btn').addEventListener('click', () => selectComponent(product.id));
            }
            productListContainer.appendChild(itemDiv);
        });
    };
        compatToggle.addEventListener('change', renderProductsInModal);
        renderProductsInModal(); // Initial render

        modal.classList.remove('hidden', 'opacity-0');
        modal.classList.add('flex', 'opacity-100');
        modal.querySelector('.transform').classList.remove('scale-95');
        modal.querySelector('.transform').classList.add('scale-100');
        document.body.classList.add('overflow-hidden');
    };

    const closeModal = () => {
        modal.classList.remove('flex', 'opacity-100');
        modal.classList.add('hidden', 'opacity-0');
        modal.querySelector('.transform').classList.remove('scale-100');
        modal.querySelector('.transform').classList.add('scale-95');
        document.body.classList.remove('overflow-hidden');
    };

    // --- Confirmation Modal Handlers ---
    const openConfirmationModal = (title, message, iconClass, iconColorClass, onConfirmCallback) => {
        confirmModalTitle.textContent = title;
        confirmModalMessage.textContent = message;
        confirmModalIcon.className = `${iconClass} ${iconColorClass} text-4xl mb-4`;
        activeConfirmCallback = onConfirmCallback;

        confirmationModal.classList.remove('hidden', 'opacity-0');
        confirmationModal.classList.add('flex', 'opacity-100');
        confirmationModal.querySelector('.transform').classList.remove('scale-95');
        confirmationModal.querySelector('.transform').classList.add('scale-100');
        document.body.classList.add('overflow-hidden');
    };

    const closeConfirmationModal = () => {
        confirmationModal.classList.remove('flex', 'opacity-100');
        confirmationModal.classList.add('hidden', 'opacity-0');
        confirmationModal.querySelector('.transform').classList.remove('scale-100');
        confirmationModal.querySelector('.transform').classList.add('scale-95');
        document.body.classList.remove('overflow-hidden');
        activeConfirmCallback = null; // Clear the callback
    };

    confirmActionBtn.addEventListener('click', () => {
        if (activeConfirmCallback) {
            activeConfirmCallback();
        }
        closeConfirmationModal();
    });

    cancelActionBtn.addEventListener('click', closeConfirmationModal);
    
    // Close confirmation modal if clicked outside content
    confirmationModal.addEventListener('click', (event) => {
        if (event.target === confirmationModal) {
            closeConfirmationModal();
        }
    });

    // --- Toast Notification Handlers ---
    const showToast = (element, messageElement, message, isError = false) => {
        messageElement.textContent = message;
        element.classList.remove('hidden', 'opacity-0');
        element.classList.add('opacity-100');

        setTimeout(() => {
            element.classList.remove('opacity-100');
            element.classList.add('opacity-0');
            // Give time for fade out before hiding
            setTimeout(() => {
                element.classList.add('hidden');
            }, 300); // Must match transition duration
        }, 3000); // Display for 3 seconds
    };

    // --- Download Build Function ---
    const downloadBuild = () => {
        let buildText = '--- PC Build Summary ---\n\n';
        let totalPrice = 0;

        if (Object.keys(selectedComponents).length === 0) {
            showToast(errorToast, errorToastMessage, "Your build is empty. Nothing to download.");
            return;
        }

        componentStructure.forEach(slot => {
            const product = selectedComponents[slot.id];
            if (product) {
                buildText += `${slot.name}: ${product.name} - ${formatPrice(product.price)}\n`;
                totalPrice += parseFloat(product.price);
            } else {
                buildText += `${slot.name}: Not Selected\n`;
            }
        });

        buildText += `\nTotal Price: ${formatPrice(totalPrice)}\n\n`;

        const { status, message, details } = checkOverallBuildCompatibility();
        buildText += `Compatibility Status: ${message}\n`;
        if (details.length > 0) {
            buildText += 'Compatibility Details:\n';
            details.forEach(issue => {
                buildText += `- ${issue}\n`;
            });
        }

        const blob = new Blob([buildText], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'pc-build-summary.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        showToast(successToast, toastMessage, "Build summary downloaded successfully!");
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
        showToast(successToast, toastMessage, "Component removed successfully!");
    };
    
    // --- Main Action Button Handlers ---
    clearBuildBtn.addEventListener('click', () => {
        openConfirmationModal(
            "Clear Build?",
            "Are you sure you want to clear your entire build? This action cannot be undone.",
            "fas fa-trash-alt",
            "text-red-500",
            () => {
                selectedComponents = {};
                renderComponentSlots();
                updateBuildSummary();
                showToast(successToast, toastMessage, "Build cleared successfully!");
            }
        );
    });

    saveBuildBtn.addEventListener('click', () => {
        const { compatible, status, details } = checkOverallBuildCompatibility();

        if (Object.keys(selectedComponents).length === 0) {
            showToast(errorToast, errorToastMessage, "Your build is empty. Add components before saving.");
            return;
        }

        if (status === 'issues') {
            openConfirmationModal(
                "Save Incompatible Build?",
                "Your current build has compatibility issues. Saving it as is might result in a non-functional PC. Do you wish to continue saving?",
                "fas fa-exclamation-triangle",
                "text-orange-500",
                () => {
                    localStorage.setItem('savedPcBuild', JSON.stringify(selectedComponents));
                    downloadBuild(); // Call download here after saving to local storage
                    showToast(successToast, toastMessage, "Build saved successfully (with warnings)!");
                }
            );
        } else {
            localStorage.setItem('savedPcBuild', JSON.stringify(selectedComponents));
            downloadBuild(); // Call download here after saving to local storage
            showToast(successToast, toastMessage, "Build saved successfully!");
        }
    });

    loadBuildBtn.addEventListener('click', () => {
        const savedBuild = localStorage.getItem('savedPcBuild');
        if (!savedBuild) {
            showToast(errorToast, errorToastMessage, "No saved build found.");
            return;
        }

        openConfirmationModal(
            "Load Saved Build?",
            "Loading a saved build will replace your current build. Are you sure you want to proceed?",
            "fas fa-folder-open",
            "text-blue-500",
            () => {
                selectedComponents = JSON.parse(savedBuild);
                renderComponentSlots();
                updateBuildSummary();
                showToast(successToast, toastMessage, "Build loaded successfully!");
            }
        );
    });

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
                openModal(chooseBtn.dataset.slotId, chooseBtn.dataset.type, chooseBtn.dataset.subtype);
            } else if (removeBtn) {
                removeComponent(removeBtn.dataset.slotId);
            }
        });
    }

    // --- DATA FETCHING ---
    // Assuming Item.json is in the same directory or a known path like '../data/Item.json'
    fetch('/src/data/Item.json') // Adjust path if necessary
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
            componentSlotsContainer.innerHTML = `<div class="text-center text-red-500 py-10 bg-red-50 rounded-xl">
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