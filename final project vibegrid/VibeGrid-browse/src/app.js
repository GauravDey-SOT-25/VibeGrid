import { mountNavbar, updateNavbarActive } from './components/Navbar/navbar.js';
import { loadEvents, showBrowseView, events } from './components/SearchPanel/search.js';
import { mountEventDetails } from './pages/EventDetails/eventDetails.js';
import { mountRegistrationForm, mountMyRegistrations } from './pages/Registration/registration.js';
import { mountHome } from './pages/Home/home.js';
import { mountLogin } from './pages/Login/login.js';
import { mountFooter } from './components/Footer/footer.js';
import { bootstrapChatWidget } from './components/Chat/chatWidget.js';
import { getAllEvents } from './services/eventsService.js';

// Function to read and apply admin dashboard settings dynamically to the frontend
function applyGlobalSettings() {
    try {
        const stored = localStorage.getItem("eventPlatform.settings");
        if (stored) {
            const settings = JSON.parse(stored);
            
            // Apply Brand Name
            const brandName = settings.platformName || "VibeGrid";
            document.title = brandName;
            
            // Apply Navbar Brand Name
            const logoSpan = document.querySelector(".logo span");
            if (logoSpan) {
                logoSpan.textContent = brandName;
            }

            // Apply Accent Color
            const accentColor = settings.accentColor || "#E43D12";
            document.documentElement.style.setProperty('--primary', accentColor);
            
            const colorHovers = {
                "#E43D12": "#CC3610",
                "#3FA34D": "#2E7D32",
                "#2563EB": "#1D4ED8",
                "#7C3AED": "#6D28D9",
                "#DB2777": "#BE185D"
            };
            const hoverColor = colorHovers[accentColor] || accentColor;
            document.documentElement.style.setProperty('--primary-hover', hoverColor);

            // Apply Theme Mode (Dark/Light)
            if (settings.theme === "dark") {
                document.body.classList.add("dark-mode");
            } else {
                document.body.classList.remove("dark-mode");
            }
        }
    } catch (err) {
        console.error("Error applying global settings:", err);
    }
}

// Central SPA Router
async function router() {
    const hash = window.location.hash || '#/';
    
    // Always re-mount navbar to keep state in sync
    mountNavbar();
    
    // Apply dynamic settings
    applyGlobalSettings();
    
    // Ensure events are loaded before routing
    if (events.length === 0) {
        await loadEvents();
    }

    const currentEvents = getAllEvents();

    // Route matching
    if (hash === '#/' || hash === '' || hash === '#') {
        mountHome();
    } else if (hash === '#/browse') {
        showBrowseView();
    } else if (hash.startsWith('#/event-details/')) {
        const eventId = hash.replace('#/event-details/', '');
        mountEventDetails(eventId, currentEvents);
    } else if (hash.startsWith('#/register/')) {
        const eventId = hash.replace('#/register/', '');
        mountRegistrationForm(eventId, currentEvents);
    } else if (hash === '#/my-registrations') {
        mountMyRegistrations(currentEvents);
    } else if (hash === '#/login' || hash === '#/signup') {
        mountLogin();
    } else {
        // Fallback to home
        window.location.hash = '#/';
    }

    // Update navbar active state
    updateNavbarActive(hash);
}

// Initialise the application
async function initApp() {
    // Mount Navbar statically first
    mountNavbar();

    // Mount Footer statically
    mountFooter();

    // Bootstrap Chat Widget statically
    bootstrapChatWidget();
    
    // Apply dynamic settings
    applyGlobalSettings();
    
    // Listen to hash change
    window.addEventListener('hashchange', router);
    
    // Run router on initial load
    await router();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
