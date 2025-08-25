 document.addEventListener('DOMContentLoaded', () => {
            const offlineToast = document.getElementById('network-status-toast-offline');
            const closeOfflineBtn = document.getElementById('close-toast-btn-offline');
            
            const onlineToast = document.getElementById('network-status-toast-online');
            const closeOnlineBtn = document.getElementById('close-toast-btn-online');

            // --- Mga Functions ---

            // Function para ipakita ang OFFLINE notification
            const showOfflineToast = () => {
                if (onlineToast) onlineToast.classList.add('hidden'); // Itago ang online toast kung sakaling nakabukas
                if (offlineToast) offlineToast.classList.remove('hidden');
            };

            // Function para itago ang OFFLINE notification
            const hideOfflineToast = () => {
                if (offlineToast) offlineToast.classList.add('hidden');
            };

            // Function para ipakita ang ONLINE notification at itago pagkatapos ng ilang segundo
            const showOnlineToast = () => {
                if (offlineToast) offlineToast.classList.add('hidden'); // Itago ang offline toast
                if (onlineToast) {
                    onlineToast.classList.remove('hidden');
                    // Awtomatikong itago pagkatapos ng 3 segundo
                    setTimeout(() => {
                        onlineToast.classList.add('hidden');
                    }, 3000);
                }
            };

            // Function para itago ang ONLINE notification
            const hideOnlineToast = () => {
                if (onlineToast) onlineToast.classList.add('hidden');
            };

            // --- Mga Event Listeners ---

            // Makinig kapag nawalan ng internet
            window.addEventListener('offline', showOfflineToast);

            // Makinig kapag nagka-internet ulit
            window.addEventListener('online', showOnlineToast);

            // Suriin ang koneksyon sa unang pag-load ng page
            if (!navigator.onLine) {
                showOfflineToast();
            }

            // Payagan ang user na i-close nang manu-mano ang mga toast
            if (closeOfflineBtn) {
                closeOfflineBtn.addEventListener('click', hideOfflineToast);
            }
             if (closeOnlineBtn) {
                closeOnlineBtn.addEventListener('click', hideOnlineToast);
            }
        });