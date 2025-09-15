document.addEventListener('DOMContentLoaded', () => {
    const servicesGrid = document.getElementById('services-grid');
    const whyChooseUsGrid = document.getElementById('why-choose-us-grid');
    const servicesModernSection = document.getElementById('services-modern');

    // Function to populate the grids
    const populateGrids = (data) => {
        // Populate Services Grid
        data.services.forEach((service, index) => {
            const isBlue = index % 2 === 0; // Alternating colors based on index
            const cardBgClass = isBlue ? 'bg-[#074ec2]' : 'bg-[#FFFFFF]';
            const cardTextClass = isBlue ? 'text-[#FFFFFF]' : 'text-[#1C1C1C]';
            const cardDescriptionClass = isBlue ? 'text-gray-300' : 'text-gray-700';
            const iconBgClass = isBlue ? 'bg-[#FFFFFF]' : 'bg-[#074ec2]';
            const iconTextClass = isBlue ? 'text-[#1C1C1C]' : 'text-[#FFFFFF]';

            const serviceCard = `
                <div class="group relative p-6 rounded-xl ${cardBgClass} shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-gray-200">
                    <div class="flex justify-center mb-5">
                        <span class="inline-flex items-center justify-center h-14 w-14 rounded-[15px] ${iconBgClass}">
                            <i class="${service.icon} text-2xl ${iconTextClass}"></i>
                        </span>
                    </div>
                    <h3 class="text-lg ${cardTextClass} text-center heading">${service.title}</h3>
                    <p class="mt-2 font-regular text-md ${cardDescriptionClass} text-center">
                        ${service.description}
                    </p>
                </div>
            `;
            if (servicesGrid) { // Check if element exists before adding
                servicesGrid.innerHTML += serviceCard;
            }
        });

        // Populate Why Choose Us Grid
        data.whyChooseUs.forEach(reason => {
            const reasonCard = `
                <div class="flex flex-col items-center p-6">
                    <div class="flex-shrink-0">
                         <div class="flex items-center justify-center h-12 w-12 rounded-md bg-[#074ec2] text-[#FAF5F1] shadow-md">
                             <i class="${reason.icon} text-2xl"></i>
                         </div>
                    </div>
                    <h3 class="mt-5 text-lg font-regular text-[#1C1C1C] heading">${reason.title}</h3>
                    <p class="mt-2 text-base text-gray-500">
                         ${reason.description}
                    </p>
                </div>
            `;
            if (whyChooseUsGrid) { // Check if element exists before adding
                whyChooseUsGrid.innerHTML += reasonCard;
            }
        });

        // Add opacity animation for the section after content is loaded
        if (servicesModernSection) {
            setTimeout(() => {
                servicesModernSection.classList.remove('opacity-0');
            }, 100);
        }
    };

    // Fetch the JSON data from services.json
    fetch('../data/Services.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            populateGrids(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Optionally, display a user-friendly error message on the page
            if (servicesGrid) servicesGrid.innerHTML = '<p class="text-center text-red-500">Failed to load services. Please try again later.</p>';
            if (whyChooseUsGrid) whyChooseUsGrid.innerHTML = '<p class="text-center text-red-500">Failed to load reasons. Please try again later.</p>';
        });
});