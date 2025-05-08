document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
    
    // --- PC Builder Logic ---
    const componentsData = {
        cpu: [
            { id: "cpu1", name: "Intel Core i5-13600K", price: 18000, socket: "LGA1700" },
            { id: "cpu2", name: "Intel Core i7-13700K", price: 25000, socket: "LGA1700" },
            { id: "cpu3", name: "AMD Ryzen 5 7600X", price: 15000, socket: "AM5" },
            { id: "cpu4", name: "AMD Ryzen 7 7700X", price: 22000, socket: "AM5" },
            { id: "cpu5", name: "Intel Core i9-13900K", price: 35000, socket: "LGA1700" },
            { id: "cpu6", name: "AMD Ryzen 9 7950X", price: 38000, socket: "AM5" },
        ],
        gpu: [
            { id: "gpu1", name: "NVIDIA GeForce RTX 3060 12GB", price: 20000 },
            { id: "gpu2", name: "NVIDIA GeForce RTX 4070 12GB", price: 38000 },
            { id: "gpu3", name: "AMD Radeon RX 6700 XT 12GB", price: 25000 },
            { id: "gpu4", name: "AMD Radeon RX 7800 XT 16GB", price: 35000 },
            { id: "gpu5", name: "NVIDIA GeForce RTX 4080 16GB", price: 70000 },
            { id: "gpu6", name: "AMD Radeon RX 7900 XTX 24GB", price: 65000 },
        ],
        ram: [
            { id: "ram1", name: "16GB (2x8GB) DDR4 3200MHz", price: 3500, type: "DDR4" },
            { id: "ram2", name: "32GB (2x16GB) DDR4 3600MHz", price: 6500, type: "DDR4" },
            { id: "ram3", name: "16GB (2x8GB) DDR5 5200MHz", price: 5000, type: "DDR5" },
            { id: "ram4", name: "32GB (2x16GB) DDR5 6000MHz", price: 9000, type: "DDR5" },
            { id: "ram5", name: "64GB (2x32GB) DDR5 5600MHz", price: 17000, type: "DDR5" },
        ],
        motherboard: [
            { id: "mobo1", name: "B660 Motherboard (LGA1700, DDR4)", price: 7000, socket: "LGA1700", ram_type: "DDR4" },
            { id: "mobo2", name: "Z790 Motherboard (LGA1700, DDR5)", price: 12000, socket: "LGA1700", ram_type: "DDR5" },
            { id: "mobo3", name: "B650 Motherboard (AM5, DDR5)", price: 9000, socket: "AM5", ram_type: "DDR5" },
            { id: "mobo4", name: "X670E Motherboard (AM5, DDR5)", price: 15000, socket: "AM5", ram_type: "DDR5" },
        ],
        storage: [
            { id: "ssd1", name: "500GB NVMe PCIe 3.0 SSD", price: 3000 },
            { id: "ssd2", name: "1TB NVMe PCIe 4.0 SSD", price: 5500 },
            { id: "ssd3", name: "2TB NVMe PCIe 4.0 SSD", price: 9000 },
            { id: "hdd1", name: "2TB HDD 7200RPM", price: 3200 },
            { id: "hdd2", name: "4TB HDD 7200RPM", price: 5000 },
        ],
        psu: [
            { id: "psu1", name: "650W 80+ Bronze PSU", price: 3500 },
            { id: "psu2", name: "750W 80+ Gold PSU", price: 5500 },
            { id: "psu3", name: "850W 80+ Gold PSU", price: 7000 },
            { id: "psu4", name: "1000W 80+ Platinum PSU", price: 10000 },
        ],
        case: [
            { id: "case1", name: "Compact Mid-Tower ATX Case (Black)", price: 2500 },
            { id: "case2", name: "Mid-Tower ATX Case (White, ARGB Fans)", price: 4500 },
            { id: "case3", name: "Premium Full-Tower ATX Case (Black, Tempered Glass)", price: 7000 },
            { id: "case4", name: "Minimalist Mid-Tower (Silver/Grey)", price: 3500}
        ]
    };

    const componentSelectors = {
        cpu: document.getElementById('cpu'),
        gpu: document.getElementById('gpu'),
        ram: document.getElementById('ram'),
        motherboard: document.getElementById('motherboard'),
        storage: document.getElementById('storage'),
        psu: document.getElementById('psu'),
        case: document.getElementById('case'),
    };

    const currentBuildSummaryEl = document.getElementById('currentBuildSummary');
    const totalPriceEl = document.getElementById('totalPrice');
    const resetBuildButton = document.getElementById('resetBuild');
    const getQuoteButton = document.getElementById('getQuote');

    let currentBuild = {}; // To store selected component objects and their details

    function populateDropdowns() {
        for (const type in componentsData) {
            const selectEl = componentSelectors[type];
            if (selectEl) {
                // Clear existing options except the first one (-- Select --)
                while (selectEl.options.length > 1) {
                    selectEl.remove(1);
                }
                componentsData[type].forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = `${item.name} (₱${item.price.toLocaleString()})`;
                    option.dataset.price = item.price;
                    option.dataset.name = item.name;
                    if (item.socket) option.dataset.socket = item.socket;
                    if (item.ram_type) option.dataset.ramType = item.ram_type; // For Motherboard RAM type
                    if (item.type) option.dataset.type = item.type; // For RAM module type (DDR4/DDR5)
                    selectEl.appendChild(option);
                });
            }
        }
    }

    function updateSummaryAndPrice() {
        let total = 0;
        currentBuildSummaryEl.innerHTML = ''; 
        currentBuild = {}; // Reset current build for fresh calculation

        let hasSelection = false;
        for (const type in componentSelectors) {
            const selectEl = componentSelectors[type];
            const selectedOption = selectEl.options[selectEl.selectedIndex];

            if (selectEl.value && selectEl.value !== "0") {
                hasSelection = true;
                const price = parseFloat(selectedOption.dataset.price);
                const name = selectedOption.dataset.name;
                
                currentBuild[type] = {
                    id: selectedOption.value,
                    name: name,
                    price: price,
                    socket: selectedOption.dataset.socket, // Store for compatibility checks
                    ramType: selectedOption.dataset.ramType, // Store for compatibility checks
                    moduleType: selectedOption.dataset.type // Store RAM module type
                };

                total += price;

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('selected-component-item', 'flex', 'justify-between', 'items-center');
                
                const itemNameSpan = document.createElement('span');
                itemNameSpan.classList.add('text-sm', 'text-gray-200'); // Text color for dark summary bg
                itemNameSpan.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${name}`;
                
                const itemPriceSpan = document.createElement('span');
                itemPriceSpan.classList.add('text-sm', 'font-semibold', 'text-brand-red-light'); // Accent color for price
                itemPriceSpan.textContent = `₱${price.toLocaleString()}`;

                itemDiv.appendChild(itemNameSpan);
                itemDiv.appendChild(itemPriceSpan);
                currentBuildSummaryEl.appendChild(itemDiv);
            }
        }
        
        if (!hasSelection) {
            currentBuildSummaryEl.innerHTML = '<p class="text-gray-400 italic">Select components to see them here.</p>';
        }

        totalPriceEl.textContent = `₱${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        checkCompatibility(); // Call compatibility check after each update
    }

    function checkCompatibility() {
        // Basic Compatibility Check Example: CPU Socket vs Motherboard Socket & RAM Type
        const selectedCpu = currentBuild.cpu;
        const selectedMobo = currentBuild.motherboard;
        const selectedRam = currentBuild.ram;

        let compatibilityIssues = [];

        if (selectedCpu && selectedMobo) {
            if (selectedCpu.socket !== selectedMobo.socket) {
                compatibilityIssues.push(`CPU (${selectedCpu.name}) socket (${selectedCpu.socket}) does not match Motherboard (${selectedMobo.name}) socket (${selectedMobo.socket}).`);
            }
        }

        if (selectedRam && selectedMobo) {
            if (selectedRam.moduleType !== selectedMobo.ramType) {
                 compatibilityIssues.push(`RAM (${selectedRam.name}) type (${selectedRam.moduleType}) is not compatible with Motherboard (${selectedMobo.name}) supported RAM type (${selectedMobo.ramType}).`);
            }
        }
        
        // Display compatibility issues (simple alert for now, can be improved)
        const existingWarning = document.getElementById('compatibilityWarning');
        if (existingWarning) {
            existingWarning.remove();
        }

        if (compatibilityIssues.length > 0) {
            const warningDiv = document.createElement('div');
            warningDiv.id = 'compatibilityWarning';
            warningDiv.classList.add('mt-4', 'p-3', 'bg-yellow-500', 'text-black', 'rounded-md', 'text-sm');
            warningDiv.innerHTML = '<strong>Compatibility Alert:</strong><ul>' + 
                                   compatibilityIssues.map(issue => `<li>- ${issue}</li>`).join('') +
                                   '</ul><p class="mt-2 text-xs">Our experts will verify all compatibilities upon quote request.</p>';
            // Append to component selection box or summary box
            const builderSelectionBox = document.querySelector('#builder .lg\\:w-2\\/3'); // More specific selector
            if (builderSelectionBox) {
                 builderSelectionBox.appendChild(warningDiv);
            }
        }
    }


    // Event Listeners for component dropdowns
    document.querySelectorAll('.pc-component').forEach(select => {
        select.addEventListener('change', updateSummaryAndPrice);
    });

    // Reset Build
    if (resetBuildButton) {
        resetBuildButton.addEventListener('click', () => {
            for (const type in componentSelectors) {
                componentSelectors[type].value = "0";
            }
            // currentBuild = {}; // Will be reset by updateSummaryAndPrice
            updateSummaryAndPrice();
            const existingWarning = document.getElementById('compatibilityWarning');
            if (existingWarning) existingWarning.remove();
        });
    }

    // Get Quote
    if (getQuoteButton) {
        getQuoteButton.addEventListener('click', () => {
            if (Object.keys(currentBuild).length === 0) {
                alert("Please select at least one component for your build.");
                return;
            }

            let buildDetails = "Your Custom PC Build Configuration:\n\n";
            let finalPrice = 0;
            for (const type in currentBuild) {
                if (currentBuild[type]) { // Ensure component exists
                    buildDetails += `${type.charAt(0).toUpperCase() + type.slice(1)}: ${currentBuild[type].name} (₱${currentBuild[type].price.toLocaleString()})\n`;
                    finalPrice += currentBuild[type].price;
                }
            }
            buildDetails += `\nEstimated Total: ₱${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            
            const compatibilityWarning = document.getElementById('compatibilityWarning');
            if (compatibilityWarning && compatibilityWarning.innerText.includes("Compatibility Alert")) {
                 buildDetails += "\n\nNote: Potential compatibility issues were detected. Our team will double-check everything.";
            }

            buildDetails += "\n\nThank you for configuring your PC with PC REX SHOP! Please copy these details into the contact form message field or mention your Build ID (if we implement saving) when you inquire. We will contact you shortly to confirm details, compatibility, and provide a final quote.";
            
            alert(buildDetails);
            
            // Optionally, smooth scroll to contact form and pre-fill message
            const contactFormMessage = document.getElementById('message');
            if(contactFormMessage) {
                contactFormMessage.value = buildDetails.substring(0, buildDetails.indexOf("\n\nThank you")) + // prefill with components list
                                           `\nEstimated Total: ₱${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nMy Inquiry: `;
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                contactFormMessage.focus();
            }
        });
    }

    // Contact Form Submission (Placeholder)
    const contactForm = document.getElementById('contactForm');
    if(contactForm){
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real application, you would send this data to a server
            // For example, using fetch() API
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Set current year in footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Initial Population
    populateDropdowns();
    updateSummaryAndPrice(); // Initialize summary and price
});