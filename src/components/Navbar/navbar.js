/**
 * navbar.js
 *
 * Self-contained Navbar component.
 *   1. Navbar()        — returns the full HTML as a template literal
 *   2. initNavbar()    — attaches all event listeners
 *   3. mount()         — injects the CSS + HTML, then calls initNavbar()
 *
 * The mount() call at the bottom of this file renders the Navbar
 * automatically when the script is loaded.
 */

/* =====================================================
   COMPONENT — HTML template
 ===================================================== */

function Navbar() {
    return `
        <!--================== NAVBAR ==================-->

        <header class="navbar">

            <div class="container">

                <!-- Logo -->

                <a href="#/" class="logo">

                    <div class="logo-icon">
                        <i class="fa-solid fa-calendar-days"></i>
                    </div>

                    <span>EventHub</span>

                </a>

                <!-- Navigation -->

                <nav class="nav-menu">

                    <ul class="nav-links">

                        <li>
                            <a href="#/" class="active">Home</a>
                        </li>

                        <li>
                            <a href="#/browse">Browse Events</a>
                        </li>

                        <li>
                            <a href="#/my-registrations">My Registrations</a>
                        </li>

                        <li>
                            <a href="#contact">Contact</a>
                        </li>

                    </ul>

                </nav>

                <!-- Right -->

                <div class="nav-right">

                    <button class="notification">

                        <i class="fa-regular fa-bell"></i>

                        <span class="notification-dot"></span>

                    </button>

                    <div class="profile">

                        <img src="https://i.pravatar.cc/100?img=32">

                        <span>Hi, User</span>

                        <i class="fa-solid fa-chevron-down"></i>

                    </div>

                    <a href="#/" class="create-btn" style="display: inline-flex; align-items: center; justify-content: center; text-decoration: none;">

                        <i class="fa-solid fa-plus" style="margin-right: 8px;"></i>

                        Create Event

                    </a>

                    <!-- Hamburger -->

                    <div class="hamburger">

                        <span></span>

                        <span></span>

                        <span></span>

                    </div>

                </div>

            </div>

        </header>

        <!--================ MOBILE MENU =================-->

        <div class="mobile-menu">

            <a href="#/" class="active">Home</a>

            <a href="#/browse">Browse Events</a>

            <a href="#/my-registrations">My Registrations</a>

            <a href="#contact">Contact</a>

            <a href="#/" class="mobile-btn" style="display: block; text-align: center; text-decoration: none; margin-top: 15px;">

                <i class="fa-solid fa-plus"></i>

                Create Event

            </a>

        </div>
    `;
}

/* =====================================================
   INITIALISER — event listeners
 ===================================================== */

function initNavbar() {

    const hamburger   = document.querySelector('.hamburger');
    const mobileMenu  = document.querySelector('.mobile-menu');
    const navLinks    = document.querySelectorAll('.nav-links a');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    /* Hamburger toggle */

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    /* Close mobile menu when a mobile link is clicked */

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    /* Contact link smooth scroll */
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Close mobile menu if open
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');

            const footerContact = document.getElementById('footer-contact');
            if (footerContact) {
                footerContact.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* =====================================================
   MOUNT — inject CSS + HTML, then initialise
 ===================================================== */

export function mountNavbar() {

    /* Render HTML into mount point */
    const root = document.querySelector('#navbar-root');

    if (!root) {
        console.error('[Navbar] Mount point "#navbar-root" not found in the DOM.');
        return;
    }

    root.innerHTML = Navbar();

    /* Attach event listeners */
    initNavbar();

}

/* Active link — keep desktop & mobile in sync and update based on current hash */
export function updateNavbarActive(hash) {
    const navLinks    = document.querySelectorAll('.nav-links a');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    
    let activeText = 'Home';
    if (hash === '#/browse') {
        activeText = 'Browse Events';
    } else if (hash.includes('/my-registrations')) {
        activeText = 'My Registrations';
    } else if (hash.includes('/event-details') || hash.includes('/register') || hash.includes('/login') || hash.includes('/signup')) {
        activeText = ''; // Detail views or auth views don't have an active top tab
    } else if (hash === '#/' || hash === '' || hash === '#') {
        activeText = 'Home';
    }

    navLinks.forEach(link => {
        link.classList.toggle(
            'active',
            link.textContent.trim() === activeText
        );
    });

    mobileLinks.forEach(link => {
        link.classList.toggle(
            'active',
            link.textContent.trim() === activeText
        );
    });
}
/* Auto-mount when the script is loaded */
mountNavbar();
