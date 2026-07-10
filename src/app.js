import { mountNavbar, updateNavbarActive } from './components/Navbar/navbar.js';
import { loadEvents, showBrowseView, events } from './components/SearchPanel/search.js';
import { mountEventDetails } from './pages/EventDetails/eventDetails.js';
import { mountRegistrationForm, mountMyRegistrations } from './pages/Registration/registration.js';
import { mountHome } from './pages/Home/home.js';
import { mountLogin } from './pages/Login/login.js';
import { mountFooter } from './components/Footer/footer.js';

// Central SPA Router
async function router() {
    const hash = window.location.hash || '#/';
    
    // Ensure events are loaded before routing
    if (events.length === 0) {
        await loadEvents();
    }

    // Route matching
    if (hash === '#/' || hash === '' || hash === '#') {
        mountHome();
    } else if (hash === '#/browse') {
        showBrowseView();
    } else if (hash.startsWith('#/event-details/')) {
        const eventId = hash.replace('#/event-details/', '');
        mountEventDetails(eventId, events);
    } else if (hash.startsWith('#/register/')) {
        const eventId = hash.replace('#/register/', '');
        mountRegistrationForm(eventId, events);
    } else if (hash === '#/my-registrations') {
        mountMyRegistrations(events);
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
