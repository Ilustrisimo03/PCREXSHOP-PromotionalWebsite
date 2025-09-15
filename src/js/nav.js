
  // --- Mobile Sidebar Logic (Existing) ---
    const burger = document.getElementById('burger');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    const openSidebar = () => {
        mobileSidebar.classList.remove('-translate-x-full');
        backdrop.classList.remove('hidden');
    };

    const closeMobileMenu = () => {
        mobileSidebar.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
    };

    burger.addEventListener('click', openSidebar);
    closeSidebar.addEventListener('click', closeMobileMenu);
    backdrop.addEventListener('click', closeMobileMenu);
    sidebarLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // --- Desktop Dropdown Logic (New & Improved) ---
    const aboutUsWrapper = document.getElementById('about-us-wrapper');
    const aboutUsDropdown = document.getElementById('aboutUsDropdown');
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    let timeoutId;

    // Show dropdown on mouse enter
    aboutUsWrapper.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
        aboutUsDropdown.classList.remove('hidden');
    });

    // Hide dropdown on mouse leave with a delay
    aboutUsWrapper.addEventListener('mouseleave', () => {
        timeoutId = setTimeout(() => {
            aboutUsDropdown.classList.add('hidden');
        }, 200); // 200ms delay
    });

    // Close dropdown when a link inside it is clicked
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            aboutUsDropdown.classList.add('hidden');
        });
    });

    // --- Underline on Hover Logic (New) ---
    // For desktop nav links (excluding the About Us button itself as it has a dropdown)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.setProperty('--underline-width', '100%');
        });
        link.addEventListener('mouseleave', () => {
            link.style.setProperty('--underline-width', '0%');
        });
    });

    // For sidebar links
    const sidebarNavLink = document.querySelectorAll('#mobileSidebar .sidebar-link');
    sidebarNavLink.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.setProperty('--underline-width', '100%');
        });
        link.addEventListener('mouseleave', () => {
            link.style.setProperty('--underline-width', '0%');
        });
    });

    // Add this CSS to your stylesheet (or in a style tag for quick testing)
    const style = document.createElement('style');
    style.innerHTML = `
        .nav-link::after, .sidebar-link::after {
            content: '';
            position: absolute;
            width: var(--underline-width, 0%);
            height: 3px;
            background-color: #074ec2; /* Your hover color */
            bottom: -5px; /* Adjust as needed */
            left: 0;
            transition: width 0.3s ease-in-out;
        }
        .nav-link, .sidebar-link {
            position: relative;
        }
    `;
    document.head.appendChild(style);
