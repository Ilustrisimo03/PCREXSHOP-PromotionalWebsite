document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    let componentData = []; // Initialize as empty, will be fetched
    
    const componentCategories = [
        { key: 'cpu', name: 'Processor', icon: 'fa-microchip' },
        { key: 'motherboard', name: 'Motherboard', icon: 'fa-server' },
        { key: 'ram', name: 'Memory', icon: 'fa-memory' },
        { key: 'gpu', name: 'Graphics Card', icon: 'fa-desktop' },
        { key: 'storage', name: 'Storage', icon: 'fa-hdd' },
        { key: 'psu', name: 'Power Supply', icon: 'fa-plug' },
    ];
    
    let currentBuild = {};
    let currentModalCategory = null;
    
    // --- DOM Elements ---
    const componentSlotsContainer = document.getElementById('component-slots');
    const totalPriceEl = document.getElementById('total-price');
    const overallCompatibilityStatusEl = document.getElementById('overall-compatibility-status');
    const selectedComponentsSummaryEl = document.getElementById('selected-components-summary');
    const clearBuildBtn = document.getElementById('clear-build-btn');
    
    const modal = document.getElementById('component-modal');
    const modalTitleEl = document.getElementById('modal-title');
    const modalBodyEl = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    // --- INITIALIZATION ---
    async function initializeBuilder() {
        try {
            const response = await fetch('../js/Products.json'); // Ensure this path is correct
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, while fetching Products.json`);
            }
            let rawData = await response.json();
    
            if (!Array.isArray(rawData)) {
                throw new Error("Products.json did not return a valid array.");
            }
    
            componentData = rawData.map(item => {
                const price = typeof item.price === 'string' ? parseFloat(item.price) : (typeof item.price === 'number' ? item.price : 0);
                const categoryName = (item.category && typeof item.category.name === 'string')
                                      ? item.category.name
                                      : (typeof item.category === 'string' ? item.category : 'Unknown');
                
                const powerDraw = typeof item.powerDraw === 'number' ? item.powerDraw : null;
                // Ensure wattage is null if not a valid positive number
                const wattage = (typeof item.wattage === 'number' && item.wattage > 0) ? item.wattage : null; 
    
                return {
                    ...item,
                    price: price,
                    category: { name: categoryName },
                    images: Array.isArray(item.images) ? item.images : [],
                    stock: typeof item.stock === 'number' ? item.stock : 0,
                    powerDraw: powerDraw,
                    wattage: wattage
                };
            });
    
            renderComponentSlots();
            updateSummary();
            updateTotalPrice();
            checkOverallCompatibility();
    
            if (clearBuildBtn) {
                clearBuildBtn.addEventListener('click', clearBuild);
            } else { console.warn("Element 'clear-build-btn' not found."); }
    
            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', closeModal);
            } else { console.warn("Element 'close-modal-btn' not found."); }
    
            if (modal) {
                 modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal();
                });
            } else { console.warn("Element 'component-modal' not found."); }
    
        } catch (error) {
            console.error("Failed to load component data or initialize builder:", error);
            if (componentSlotsContainer) {
                 // More user-friendly error message in the UI
                componentSlotsContainer.innerHTML = `
                    <div class="text-center text-red-600 py-10 bg-red-50 p-4 rounded-lg">
                        <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                        <p class="font-semibold">Error Loading Product Data</p>
                        <p class="text-sm">${error.message}</p>
                        <p class="text-xs mt-2">Please check the console and ensure Products.json is accessible and correctly formatted.</p>
                    </div>`;
            }
            if (overallCompatibilityStatusEl) {
                 overallCompatibilityStatusEl.className = 'p-4 rounded-lg text-center font-semibold bg-red-100 text-red-700 shadow-md';
                 overallCompatibilityStatusEl.innerHTML = `<div class="flex items-center justify-center"><i class="fas fa-times-circle fa-lg mr-2"></i><strong>Error Loading Data</strong></div><p class="text-sm mt-1">Builder cannot function. Please check console.</p>`;
            }
        }
    }
    
    // --- RENDERING FUNCTIONS ---
    function renderComponentSlots() {
        if (!componentSlotsContainer) {
            console.error("Element 'component-slots' not found.");
            return;
        }
        componentSlotsContainer.innerHTML = '';
        componentCategories.forEach(categoryInfo => {
            const selectedComponent = currentBuild[categoryInfo.key] ? componentData.find(c => c.id === currentBuild[categoryInfo.key]) : null;
            const isAvailable = selectedComponent ? selectedComponent.stock > 0 : true;
    
            const slotEl = document.createElement('div');
            slotEl.className = 'p-4 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 hover:shadow-sm transition-shadow duration-150';
    
            let detailsHTML = `<p class="text-sm text-slate-500 italic">Not selected</p>`;
            if (selectedComponent) {
                detailsHTML = `
                    <p class="text-sm text-slate-800 font-medium">${selectedComponent.name}</p>
                    <p class="text-xs ${isAvailable ? 'text-emerald-600' : 'text-red-600 font-semibold'}">${isAvailable ? 'In Stock' : 'Out of Stock'}</p>
                `;
            }
            
            const priceHTML = selectedComponent ? `<p class="text-md font-semibold text-slate-900 sm:mr-3 mb-1 sm:mb-0">₱${selectedComponent.price.toFixed(2)}</p>` : '';
            let actionButtonsHTML = '';
            if (selectedComponent) {
                actionButtonsHTML = `
                    <button data-category="${categoryInfo.key}" class="unselect-component-btn bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors">Remove</button>
                    <button data-category="${categoryInfo.key}" class="select-component-btn bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors">Change</button>
                `;
            } else {
                actionButtonsHTML = `
                    <button data-category="${categoryInfo.key}" class="select-component-btn bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors">Select</button>
                `;
            }
    
            slotEl.innerHTML = `
                <div class="flex items-center gap-3 flex-grow">
                     <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-rose-50 rounded-full">
                        <i class="fas ${categoryInfo.icon} text-lg text-rose-600"></i>
                     </div>
                    <div class="flex-grow">
                        <h4 class="text-md sm:text-lg font-semibold text-slate-800">${categoryInfo.name}</h4>
                        ${detailsHTML}
                        <div id="comp-status-${categoryInfo.key}" class="text-xs mt-1 leading-tight"></div>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-x-3 gap-y-2 mt-2 sm:mt-0 shrink-0 w-full sm:w-auto">
                    ${priceHTML}
                    <div class="flex gap-2 w-full sm:w-auto justify-end sm:justify-normal">
                        ${actionButtonsHTML}
                    </div>
                </div>
            `;
            componentSlotsContainer.appendChild(slotEl);
        });
    
        document.querySelectorAll('.select-component-btn').forEach(btn => {
            btn.addEventListener('click', () => openModal(btn.dataset.category));
        });
        document.querySelectorAll('.unselect-component-btn').forEach(btn => {
            btn.addEventListener('click', () => unselectComponent(btn.dataset.category));
        });
    }
    
    function updateSummary() {
        if (!selectedComponentsSummaryEl) return;
        selectedComponentsSummaryEl.innerHTML = '';
        let hasSelection = false;
        componentCategories.forEach(cat => {
            const componentId = currentBuild[cat.key];
            if (componentId) {
                hasSelection = true;
                const component = componentData.find(c => c.id === componentId);
                if (component) {
                    const p = document.createElement('p');
                    p.className = 'flex justify-between items-center text-slate-700';
                    p.innerHTML = `
                        <span><i class="fas ${cat.icon} fa-fw mr-2 text-rose-600"></i>${component.name}</span>
                        <span class="font-medium text-slate-900">₱${component.price.toFixed(2)}</span>
                    `;
                    selectedComponentsSummaryEl.appendChild(p);
                }
            }
        });
        if (!hasSelection) {
            selectedComponentsSummaryEl.innerHTML = '<p class="text-slate-600 italic">No components selected yet.</p>';
        }
    }
    
    function updateTotalPrice() {
        if (!totalPriceEl) return;
        let total = 0;
        for (const categoryKey in currentBuild) {
            const componentId = currentBuild[categoryKey];
            const component = componentData.find(c => c.id === componentId);
            if (component) {
                total += component.price;
            }
        }
        totalPriceEl.textContent = `₱${total.toFixed(2)}`;
    }
    
    // --- MODAL FUNCTIONS ---
    function openModal(categoryKey) {
        if (!modal || !modalTitleEl || !modalBodyEl) {
             console.error("Modal elements not found.");
             return;
        }
        currentModalCategory = categoryKey;
        const categoryInfo = componentCategories.find(c => c.key === categoryKey);
        if (!categoryInfo) {
            console.error(`Category info not found for key: ${categoryKey}`);
            return;
        }
        modalTitleEl.innerHTML = `<i class="fas ${categoryInfo.icon} fa-fw mr-2 text-rose-500"></i>Select ${categoryInfo.name}`;
        modalBodyEl.innerHTML = `<div class="text-center py-4"><i class="fas fa-spinner fa-spin fa-2x text-rose-600"></i><p class="text-slate-700 mt-1">Loading components...</p></div>`;
    
        if (!componentData || componentData.length === 0) {
            modalBodyEl.innerHTML = '<p class="text-red-600 p-4 text-center">Component data is not available. Cannot load items.</p>';
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            return;
        }
    
        setTimeout(() => { 
            modalBodyEl.innerHTML = '';
            const itemsForCategory = componentData.filter(c =>
                c.category && c.category.name && c.category.name.toLowerCase() === categoryKey.toLowerCase()
            );
    
            if (itemsForCategory.length === 0) {
                modalBodyEl.innerHTML = `<p class="text-slate-700 p-4 text-center">No components available for the "${categoryInfo.name}" category.</p>`;
            } else {
                const ul = document.createElement('ul');
                ul.className = 'space-y-3 max-h-[60vh] overflow-y-auto pr-2 modal-body-custom-scrollbar'; // Ensure scrollbar style is defined in CSS
                itemsForCategory.forEach(item => {
                    let isCompatibleSuggestion = true;
                    let suggestionReason = "";
    
                    // Compatibility checks for suggestions in modal
                    if (categoryKey === 'cpu' && currentBuild.motherboard) {
                        const mobo = componentData.find(c => c.id === currentBuild.motherboard);
                        const moboSocket = mobo?.compatibility?.socket;
                        const itemSocket = item.compatibility?.socket; 
                        if (moboSocket && itemSocket && itemSocket !== moboSocket) {
                            isCompatibleSuggestion = false; suggestionReason = `Socket mismatch (Mobo: ${moboSocket})`;
                        } else if (moboSocket && !itemSocket) { suggestionReason = `CPU socket unknown (Mobo: ${moboSocket})`;
                        } else if (!moboSocket && itemSocket) { suggestionReason = `Mobo socket unknown (CPU: ${itemSocket})`;}
                    }
                    if (categoryKey === 'motherboard' && currentBuild.cpu) {
                        const cpu = componentData.find(c => c.id === currentBuild.cpu);
                        const cpuSocket = cpu?.compatibility?.socket;
                        const itemSocket = item.compatibility?.socket; 
                        if (cpuSocket && itemSocket && itemSocket !== cpuSocket) {
                            isCompatibleSuggestion = false; suggestionReason = `Socket mismatch (CPU: ${cpuSocket})`;
                        } else if (cpuSocket && !itemSocket) { suggestionReason = `Mobo socket unknown (CPU: ${cpuSocket})`;
                        } else if (!cpuSocket && itemSocket) { suggestionReason = `CPU socket unknown (Mobo: ${itemSocket})`;}
                    }
                    if (categoryKey === 'ram' && currentBuild.motherboard) {
                        const mobo = componentData.find(c => c.id === currentBuild.motherboard);
                        const moboRamType = mobo?.compatibility?.ramType;
                        const itemRamType = item.compatibility?.type; 
                        if (moboRamType && itemRamType && itemRamType !== moboRamType) {
                            isCompatibleSuggestion = false; suggestionReason = `RAM Type mismatch (Mobo: ${moboRamType})`;
                        } else if (moboRamType && !itemRamType) { suggestionReason = `RAM Type unknown (Mobo: ${moboRamType})`;
                        } else if (!moboRamType && itemRamType) { suggestionReason = `Mobo RAM Type unknown (RAM: ${itemRamType})`;}
                    }
    
                    const li = document.createElement('li');
                    const isOutOfStock = item.stock === 0;
                    let liClasses = 'p-3 border border-slate-200 rounded-md hover:shadow-lg transition-all duration-200 ease-in-out flex justify-between items-start';
    
                    if (isOutOfStock) {
                        liClasses += ' opacity-60 bg-slate-100 cursor-not-allowed pointer-events-none';
                    } else if (!isCompatibleSuggestion) {
                        liClasses += ' bg-amber-50 border-amber-200'; // Highlight not ideal, but still allow interaction
                    } else {
                        liClasses += ' hover:border-rose-400 cursor-pointer bg-white';
                    }
                    li.className = liClasses;
    
                    let imageUrl = 'https://via.placeholder.com/80x80/E2E8F0/94A3B8?text=NoImg'; // Tailwind slate colors for placeholder
                    if (item.images && item.images.length > 0 && item.images[0] && typeof item.images[0] === 'string' && item.images[0].trim() !== '') {
                        const rawImageUrl = item.images[0].trim();
                        if (rawImageUrl.includes('drive.google.com')) {
                            let fileId = null;
                            try {
                                if (rawImageUrl.includes('/uc?') && rawImageUrl.includes('id=')) {
                                    const url = new URL(rawImageUrl); fileId = url.searchParams.get('id');
                                } else if (rawImageUrl.includes('/file/d/')) {
                                    const parts = rawImageUrl.split('/'); const dIndex = parts.indexOf('d');
                                    if (dIndex !== -1 && parts.length > dIndex + 1) fileId = parts[dIndex + 1];
                                }
                                if (fileId) imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w100-h100`;
                                else console.warn("Could not extract file ID from Google Drive URL:", rawImageUrl);
                            } catch (e) { console.warn("Error parsing Google Drive URL:", rawImageUrl, e); }
                        } else { imageUrl = rawImageUrl; }
                    }
    
                    li.innerHTML = `
                        <div class="flex items-center gap-3">
                            <img src="${imageUrl}" alt="${item.name}" class="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded shrink-0 border border-slate-200 bg-white p-0.5">
                            <div class="flex-grow">
                                <h5 class="font-semibold text-slate-800">${item.name}</h5>
                                <p class="text-sm text-slate-600">Price: ₱${item.price.toFixed(2)}</p>
                                <p class="text-xs ${item.stock > 0 ? 'text-emerald-600' : 'text-red-600 font-semibold'}">
                                    ${item.stock > 0 ? `In Stock (${item.stock} available)` : 'Out of Stock'}
                                </p>
                                ${suggestionReason ? `<p class="text-xs ${isCompatibleSuggestion ? 'text-sky-600' : 'text-amber-700'} font-medium mt-0.5"><i class="fas ${isCompatibleSuggestion ? 'fa-info-circle' : 'fa-exclamation-triangle'} mr-1"></i>${suggestionReason}</p>` : ''}
                            </div>
                        </div>
                        <button class="select-item-btn ${isOutOfStock ? 'bg-slate-400 cursor-not-allowed' : (isCompatibleSuggestion ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-500 hover:bg-amber-600')} text-white px-3 py-1.5 rounded text-sm shrink-0 ml-2 self-center" data-id="${item.id}" ${isOutOfStock ? 'disabled' : ''}>
                            ${isOutOfStock ? 'Out of Stock' : (isCompatibleSuggestion ? 'Select' : 'Select Anyway')}
                        </button>
                    `;
    
                    if (!isOutOfStock) {
                        const selectBtn = li.querySelector('.select-item-btn');
                        if (selectBtn) {
                            selectBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                selectComponent(item.id, currentModalCategory);
                                closeModal();
                            });
                        }
                        // Make entire LI clickable if it's a "good" suggestion
                        if (isCompatibleSuggestion) {
                            li.addEventListener('click', () => { 
                                if (selectBtn && !selectBtn.disabled) { // Double check button not disabled
                                    selectComponent(item.id, currentModalCategory);
                                    closeModal();
                                }
                            });
                        } else {
                            li.title = suggestionReason ? suggestionReason + ". Click button to select anyway." : "This component might have compatibility issues with your current selection. Click button to select anyway.";
                        }
                    }
                    ul.appendChild(li);
                });
                modalBodyEl.appendChild(ul);
            }
        }, 50); 
    
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
    
    function closeModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        currentModalCategory = null;
        document.body.classList.remove('overflow-hidden');
    }
    
    // --- CORE LOGIC ---
    function selectComponent(componentId, categoryKey) {
        const component = componentData.find(c => c.id === componentId);
        if (!component) {
            alert('Error: Component not found in dataset.'); return;
        }
        currentBuild[categoryKey] = componentId;
        renderComponentSlots();
        updateTotalPrice();
        checkOverallCompatibility();
        updateSummary();
    }
    
    function unselectComponent(categoryKey) {
        if (currentBuild[categoryKey]) {
            delete currentBuild[categoryKey];
            renderComponentSlots();
            updateTotalPrice();
            checkOverallCompatibility();
            updateSummary();
        }
    }
    
    function clearBuild() {
        currentBuild = {};
        renderComponentSlots();
        updateTotalPrice();
        checkOverallCompatibility();
        updateSummary();
    }
    
    function checkOverallCompatibility() {
        if (!overallCompatibilityStatusEl) return;
    
        let issues = [];
        let warnings = [];
    
        componentCategories.forEach(cat => {
            const component = currentBuild[cat.key] ? componentData.find(c => c.id === currentBuild[cat.key]) : null;
            let baseMessage = "";
            let baseStatus = 'info';
            if (component) {
                if (cat.key !== 'psu') {
                    if (typeof component.powerDraw === 'number') {
                        baseMessage = `Est. Draw: ${component.powerDraw}W`;
                    } else if (component.powerDraw === null && cat.key !== 'storage') {
                         baseMessage = `Power draw info missing.`;
                         baseStatus = 'warning';
                    }
                }
                 if (component.stock === 0) { // Add out of stock as a warning for this slot initially
                    let stockMsg = `${component.name} is Out of Stock.`;
                    baseMessage = baseMessage ? `${stockMsg} ${baseMessage}` : stockMsg;
                    baseStatus = 'warning'; // Prioritize out of stock warning for the slot
                    if (!warnings.some(w => w.includes(component.name) && w.includes("OUT OF STOCK"))) {
                        warnings.push(`${component.name} (${componentCategories.find(c=>c.key===cat.key).name}) is OUT OF STOCK.`);
                    }
                }
            } else {
                if (cat.key === 'psu') baseMessage = "Select a PSU.";
            }
            updateSlotCompatibilityStatus(cat.key, baseMessage, baseStatus);
        });
        
        // Re-check stock for already processed slots if base message was different
        for (const categoryKey in currentBuild) {
            const componentId = currentBuild[categoryKey];
            const component = componentData.find(c => c.id === componentId);
            if (component && component.stock === 0) {
                const catInfo = componentCategories.find(c => c.key === categoryKey);
                const catName = catInfo ? catInfo.name : (component.category?.name || categoryKey);
                if (!warnings.some(w => w.includes(component.name) && w.includes("OUT OF STOCK"))) {
                     warnings.push(`${component.name} (${catName}) is OUT OF STOCK.`);
                }
                // Ensure slot status reflects out of stock if not already covered by base message
                const statusEl = document.getElementById(`comp-status-${categoryKey}`);
                if (statusEl && !statusEl.textContent.toLowerCase().includes("out of stock")) {
                     let currentText = statusEl.textContent;
                     updateSlotCompatibilityStatus(categoryKey, `${component.name} is Out of Stock. ${currentText}`.trim(), 'warning');
                } else if (statusEl && statusEl.textContent.toLowerCase().includes("out of stock") && !statusEl.classList.contains('text-amber-600') && !statusEl.classList.contains('text-red-600')) {
                     // If it says out of stock but not colored as warning/error, fix it
                     updateSlotCompatibilityStatus(categoryKey, statusEl.textContent, 'warning');
                }
            }
        }
    
    
        const cpu = currentBuild.cpu ? componentData.find(c => c.id === currentBuild.cpu) : null;
        const mobo = currentBuild.motherboard ? componentData.find(c => c.id === currentBuild.motherboard) : null;
        const ram = currentBuild.ram ? componentData.find(c => c.id === currentBuild.ram) : null;
    
        let moboSlotMessages = [];
        let moboOverallStatus = mobo?.stock === 0 ? 'warning' : 'info'; 
    
        if (cpu && mobo) {
            const cpuSocket = cpu.compatibility?.socket;
            const moboSocket = mobo.compatibility?.socket;
            let cpuStatus = cpu.stock === 0 ? 'warning' : 'info';
    
            if (cpuSocket && moboSocket) {
                if (cpuSocket !== moboSocket) {
                    issues.push(`CPU socket (${cpuSocket}) incompatible with Motherboard socket (${moboSocket}).`);
                    updateSlotCompatibilityStatus('cpu', `Socket: ${cpuSocket}. Incompatible with Mobo (Socket: ${moboSocket})`, 'incompatible');
                    moboSlotMessages.push(`Socket: ${moboSocket}. Incompatible with CPU (Socket: ${cpuSocket})`);
                    moboOverallStatus = 'incompatible';
                } else {
                    updateSlotCompatibilityStatus('cpu', `Socket: ${cpuSocket}. Compatible with Mobo.`, cpu.stock === 0 ? 'warning' : 'compatible');
                    moboSlotMessages.push(`Socket: ${moboSocket}. Compatible with CPU.`);
                    if (moboOverallStatus !== 'incompatible') moboOverallStatus = (cpu.stock === 0 || mobo.stock === 0) ? 'warning' : 'compatible';
                }
            } else { 
                let cpuMsg = `Socket: ${cpuSocket || 'Info Missing'}.`;
                let moboMsgPart = `Socket: ${moboSocket || 'Info Missing'}.`;
                if (!cpuSocket) { warnings.push(`CPU (${cpu.name}) missing socket info.`); cpuStatus = 'warning'; }
                if (!moboSocket) { warnings.push(`Motherboard (${mobo.name}) missing socket info.`); if(moboOverallStatus !== 'incompatible') moboOverallStatus = 'warning'; }
                
                cpuMsg += ` (Mobo: ${moboSocket || 'Info Missing'})`;
                moboMsgPart += ` (CPU: ${cpuSocket || 'Info Missing'})`;
                
                updateSlotCompatibilityStatus('cpu', cpuMsg, cpuStatus);
                moboSlotMessages.push(moboMsgPart);
                if (moboOverallStatus !== 'incompatible') moboOverallStatus = 'warning';
            }
        } else if (cpu) { 
            updateSlotCompatibilityStatus('cpu', `Socket: ${cpu.compatibility?.socket || 'Info Missing'}. Requires Motherboard for full check.`, cpu.stock === 0 || !cpu.compatibility?.socket ? 'warning' : 'info');
            if (!cpu.compatibility?.socket) warnings.push(`CPU (${cpu.name}) missing socket info.`);
        }
    
    
        if (mobo && ram) {
            const moboRamType = mobo.compatibility?.ramType;
            const ramItemType = ram.compatibility?.type;
            let ramStatus = ram.stock === 0 ? 'warning' : 'info';
    
            if (moboRamType && ramItemType) {
                if (moboRamType !== ramItemType) {
                    issues.push(`RAM type (${ramItemType}) incompatible with Motherboard (needs ${moboRamType}).`);
                    updateSlotCompatibilityStatus('ram', `Type: ${ramItemType}. Incompatible with Mobo (Needs: ${moboRamType})`, 'incompatible');
                    moboSlotMessages.push(`RAM Type: ${moboRamType}. Incompatible with RAM (Type: ${ramItemType})`);
                    if (moboOverallStatus !== 'incompatible') moboOverallStatus = 'incompatible'; //This ensures mobo status reflects this critical issue
                } else {
                    updateSlotCompatibilityStatus('ram', `Type: ${ramItemType}. Compatible with Mobo.`, ram.stock === 0 ? 'warning' : 'compatible');
                    moboSlotMessages.push(`RAM Type: ${moboRamType}. Compatible with RAM.`);
                     if (moboOverallStatus !== 'incompatible') moboOverallStatus = (ram.stock === 0 || mobo.stock === 0 || moboOverallStatus === 'warning') ? 'warning' : 'compatible';
                }
            } else {
                let ramMsg = `Type: ${ramItemType || 'Info Missing'}.`;
                let moboMsgPart = `RAM Type: ${moboRamType || 'Info Missing'}.`;
                if (!ramItemType) { warnings.push(`RAM (${ram.name}) missing type info.`); ramStatus = 'warning';}
                if (!moboRamType) { warnings.push(`Motherboard (${mobo.name}) missing RAM type info.`); if(moboOverallStatus !== 'incompatible') moboOverallStatus = 'warning'; }
                
                ramMsg += ` (Mobo RAM Type: ${moboRamType || 'Info Missing'})`;
                moboMsgPart += ` (RAM Type: ${ramItemType || 'Info Missing'})`;
    
                updateSlotCompatibilityStatus('ram', ramMsg, ramStatus);
                moboSlotMessages.push(moboMsgPart);
                if (moboOverallStatus !== 'incompatible') moboOverallStatus = 'warning';
            }
        } else if (ram) { 
            updateSlotCompatibilityStatus('ram', `Type: ${ram.compatibility?.type || 'Info Missing'}. Requires Motherboard for full check.`, ram.stock === 0 || !ram.compatibility?.type ? 'warning' : 'info');
            if (!ram.compatibility?.type) warnings.push(`RAM (${ram.name}) missing type info.`);
        }
    
        if (mobo) {
            let moboFinalMessages = [];
            if (mobo.stock === 0) moboFinalMessages.push(`${mobo.name} is Out of Stock.`);
            
            // Add specific compatibility messages first
            moboFinalMessages.push(...moboSlotMessages.filter(m => m.toLowerCase().includes('incompatible') || m.toLowerCase().includes('compatible')));
            // Add info missing messages if not already covered by compatibility
            moboSlotMessages.filter(m => m.toLowerCase().includes('info missing') && !moboFinalMessages.some(fm => fm.includes(m.split(':')[0])))
                .forEach(m => moboFinalMessages.push(m));
    
            // Add base socket/RAM type if not mentioned
            if (!moboFinalMessages.some(m => m.toLowerCase().includes('socket:'))) {
                moboFinalMessages.push(mobo.compatibility?.socket ? `Socket: ${mobo.compatibility.socket}` : 'Socket info missing');
                if(!mobo.compatibility?.socket && moboOverallStatus !== 'incompatible') moboOverallStatus = 'warning';
            }
            if (!moboFinalMessages.some(m => m.toLowerCase().includes('ram type:'))) {
                moboFinalMessages.push(mobo.compatibility?.ramType ? `RAM Type: ${mobo.compatibility.ramType}` : 'RAM type info missing');
                if(!mobo.compatibility?.ramType && moboOverallStatus !== 'incompatible') moboOverallStatus = 'warning';
            }
            
            let finalMoboMessage = moboFinalMessages.filter(Boolean).join('; ').trim();
            if (moboOverallStatus !== 'incompatible' && finalMoboMessage.toLowerCase().includes('info missing')) moboOverallStatus = 'warning';
            if (mobo.stock === 0 && moboOverallStatus !== 'incompatible') moboOverallStatus = 'warning';
    
            updateSlotCompatibilityStatus('motherboard', finalMoboMessage, moboOverallStatus);
        }
    
        let totalPowerDraw = 0;
        let powerDrawInfoMissingForComponents = false;
        componentCategories.forEach(cat => {
            if (cat.key !== 'psu' && currentBuild[cat.key]) {
                const comp = componentData.find(c => c.id === currentBuild[cat.key]);
                if (comp) {
                    if (typeof comp.powerDraw === 'number') {
                        totalPowerDraw += comp.powerDraw;
                    } else if (comp.powerDraw === null && cat.key !== 'storage') {
                        if (!warnings.some(w => w.includes(comp.name) && w.includes("missing power draw"))) {
                           warnings.push(`${comp.name} (${catInfoForLog(cat.key).name}) missing power draw. Total power est. may be inaccurate.`);
                        }
                        powerDrawInfoMissingForComponents = true;
                    }
                }
            }
        });
        function catInfoForLog(categoryKey) { // Helper for logging
            return componentCategories.find(c => c.key === categoryKey) || {name: categoryKey};
        }
    
        const psu = currentBuild.psu ? componentData.find(c => c.id === currentBuild.psu) : null;
        if (psu) {
            let psuStockWarning = psu.stock === 0 ? `${psu.name} is Out of Stock. ` : "";
            let psuStatus = psu.stock === 0 ? 'warning' : 'info';
    
            if (psu.wattage) { // psu.wattage is null if not a valid positive number
                const headroom = psu.wattage - totalPowerDraw;
                const usagePercentage = totalPowerDraw > 0 ? (totalPowerDraw / psu.wattage) * 100 : 0;
                let psuMessageParts = [psuStockWarning];
                psuMessageParts.push(`Capacity: ${psu.wattage}W.`);
                psuMessageParts.push(`Est. Load: ${totalPowerDraw}W (${usagePercentage.toFixed(0)}% used).`);
                psuMessageParts.push(`Headroom: ${headroom}W.`);
                
                if (powerDrawInfoMissingForComponents) psuMessageParts.push("(Note: Load is an estimate due to some missing component power data)");
    
                if (totalPowerDraw > psu.wattage) {
                    issues.push(`PSU Wattage Insufficient: ${psu.name} (${psu.wattage}W) may not cover est. load (${totalPowerDraw}W).`);
                    psuStatus = 'incompatible';
                    psuMessageParts.push(`INSUFFICIENT!`);
                } else if (totalPowerDraw > (psu.wattage * 0.85)) {
                    if (!warnings.some(w => w.includes("PSU load high"))) {
                        warnings.push(`PSU load high: Est. load (${totalPowerDraw}W) is ${usagePercentage.toFixed(0)}% of PSU capacity (${psu.wattage}W). Consider a higher wattage PSU.`);
                    }
                    if (psuStatus !== 'incompatible') psuStatus = 'warning';
                    psuMessageParts.push(`Load is high. Consider a higher capacity PSU.`);
                } else {
                    if (psuStatus !== 'incompatible' && psuStatus !== 'warning') psuStatus = 'compatible';
                }
                updateSlotCompatibilityStatus('psu', psuMessageParts.filter(Boolean).join(' ').trim(), psuStatus);
            } else {
                if (!warnings.some(w => w.includes(psu.name) && w.includes("wattage information missing"))) {
                    warnings.push(`Selected PSU (${psu.name}) has wattage information missing or invalid. Cannot verify power requirements.`);
                }
                updateSlotCompatibilityStatus('psu', `${psuStockWarning}Wattage information missing or invalid. Cannot check capacity.`.trim(), 'warning');
            }
        } else if (totalPowerDraw > 0) { 
            if (!warnings.some(w => w.includes("No PSU selected"))) {
                 warnings.push(`No PSU selected. Estimated system draw is ${totalPowerDraw}W. A PSU is required.`);
            }
            updateSlotCompatibilityStatus('psu', `Est. system draw: ${totalPowerDraw}W. PSU required. Select a PSU.`, 'warning');
        } else if (!psu) { 
            const psuStatusEl = document.getElementById(`comp-status-psu`);
            if (psuStatusEl && !psuStatusEl.textContent?.trim()) {
                updateSlotCompatibilityStatus('psu', 'Select a PSU.', 'info');
            }
        }
    
        const numSelected = Object.keys(currentBuild).length;
        const allCategoriesSelected = numSelected === componentCategories.length;
    
        if (issues.length > 0) {
            overallCompatibilityStatusEl.className = 'p-4 rounded-lg text-center font-semibold bg-red-100 text-red-700 shadow-md';
            overallCompatibilityStatusEl.innerHTML = `<div class="flex items-center justify-center mb-1"><i class="fas fa-times-circle fa-lg mr-2"></i><strong class="text-lg">Incompatible Build!</strong></div><ul class="text-sm list-disc list-inside text-left mt-1 space-y-0.5">${issues.map(i => `<li>${i}</li>`).join('')}</ul>`;
        } else if (numSelected === 0) {
            overallCompatibilityStatusEl.className = 'p-4 rounded-lg text-center font-semibold bg-slate-100 text-slate-700 shadow';
            overallCompatibilityStatusEl.textContent = 'Select components to start building and check compatibility.';
        } else if (!allCategoriesSelected) {
             overallCompatibilityStatusEl.className = 'p-4 rounded-lg text-center font-semibold bg-sky-100 text-sky-700 shadow';
             overallCompatibilityStatusEl.innerHTML = `<div class="flex items-center justify-center"><i class="fas fa-tools fa-lg mr-2"></i><strong class="text-lg">Partially Configured</strong></div><p class="text-sm mt-1">Selected components are compatible so far. Add remaining parts to complete your build.</p>`;
        } else { // All categories selected, no hard issues
            if (warnings.length > 0) {
                overallCompatibilityStatusEl.className = 'p-4 rounded-lg text-center font-semibold bg-amber-100 text-amber-700 shadow-md';
                overallCompatibilityStatusEl.innerHTML = `<div class="flex items-center justify-center mb-1"><i class="fas fa-exclamation-triangle fa-lg mr-2"></i><strong class="text-lg">Build Compatible with Advisories</strong></div><p class="text-sm mt-1">Your build is compatible, but please review individual component details above for advisories (e.g., stock, power, or missing information).</p>`;
            } else {
                overallCompatibilityStatusEl.className = 'p-4 rounded-lg text-center font-semibold bg-emerald-100 text-emerald-700 shadow-md';
                overallCompatibilityStatusEl.innerHTML = `<div class="flex items-center justify-center"><i class="fas fa-check-circle fa-lg mr-2"></i><strong class="text-lg">Excellent Build!</strong></div><p class="text-sm mt-1">All selected components are compatible and ready.</p>`;
            }
        }
    }
    
    function updateSlotCompatibilityStatus(categoryKey, message, statusType = 'info') {
        const statusEl = document.getElementById(`comp-status-${categoryKey}`);
        if (statusEl) {
            statusEl.innerHTML = ''; 
            let iconHTML = '';
            let textColorClass = 'text-slate-500'; 
    
            switch (statusType) {
                case 'compatible':
                    iconHTML = '<i class="fas fa-check-circle text-emerald-500 mr-1"></i>';
                    textColorClass = 'text-emerald-600';
                    break;
                case 'incompatible':
                    iconHTML = '<i class="fas fa-times-circle text-red-500 mr-1"></i>';
                    textColorClass = 'text-red-600 font-semibold';
                    break;
                case 'warning':
                    iconHTML = '<i class="fas fa-exclamation-triangle text-amber-500 mr-1"></i>';
                    textColorClass = 'text-amber-600';
                    break;
                case 'info':
                default:
                    // iconHTML = '<i class="fas fa-info-circle text-sky-500 mr-1"></i>'; // Optional for info
                    textColorClass = 'text-slate-500';
                    break;
            }
            statusEl.className = 'text-xs mt-1 leading-tight flex items-center ' + textColorClass;
            if (message && message.trim() !== '') {
                statusEl.innerHTML = iconHTML + message;
            } else {
                statusEl.innerHTML = ''; // Keep it empty if no message (or only icon if desired)
            }
        }
    }
    
    // --- START THE APP ---
    initializeBuilder();
    });