// const burger = document.getElementById('burger');
//     const sidebar = document.getElementById('mobileSidebar');
//     const closeSidebar = document.getElementById('closeSidebar');
//     const backdrop = document.getElementById('sidebarBackdrop');
  
//     burger.addEventListener('click', () => {
//       sidebar.classList.remove('-translate-x-full');
//       backdrop.classList.remove('hidden');
//     });
  
//     closeSidebar.addEventListener('click', () => {
//       sidebar.classList.add('-translate-x-full');
//       backdrop.classList.add('hidden');
//     });
  
//     backdrop.addEventListener('click', () => {
//       sidebar.classList.add('-translate-x-full');
//       backdrop.classList.add('hidden');
//     });

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

    