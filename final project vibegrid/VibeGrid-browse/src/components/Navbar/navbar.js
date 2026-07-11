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
                            <a href="admin.html">Admin Dashboard</a>
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

                    <div class="profile" id="profile-container" style="position: relative;">

                        <img src="https://i.pravatar.cc/100?img=32">

                        <span>Hi, User</span>

                        <i class="fa-solid fa-chevron-down"></i>

                        <!-- Profile Dropdown Menu -->
                        <div id="profile-dropdown-menu" style="
                            position: absolute;
                            top: 55px;
                            right: 0;
                            width: 200px;
                            background: white;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                            display: none;
                            flex-direction: column;
                            padding: 8px 0;
                            z-index: 1001;
                            text-align: left;
                        ">
                            <a href="#/my-registrations" style="
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                padding: 12px 18px;
                                color: #4b5563;
                                font-size: 14px;
                                font-weight: 500;
                                text-decoration: none;
                                transition: all 0.2s;
                            " onmouseover="this.style.background='#f3f4f6'; this.style.color='#e43d12';" onmouseout="this.style.background='none'; this.style.color='#4b5563';">
                                <i class="fa-solid fa-user-circle" style="font-size: 16px;"></i> My Profile
                            </a>
                            <a href="admin.html" style="
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                padding: 12px 18px;
                                color: #4b5563;
                                font-size: 14px;
                                font-weight: 500;
                                text-decoration: none;
                                transition: all 0.2s;
                            " onmouseover="this.style.background='#f3f4f6'; this.style.color='#e43d12';" onmouseout="this.style.background='none'; this.style.color='#4b5563';">
                                <i class="fa-solid fa-sliders" style="font-size: 16px;"></i> Admin Dashboard
                            </a>
                            <a href="#/login" style="
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                padding: 12px 18px;
                                color: #4b5563;
                                font-size: 14px;
                                font-weight: 500;
                                text-decoration: none;
                                transition: all 0.2s;
                            " onmouseover="this.style.background='#f3f4f6'; this.style.color='#e43d12';" onmouseout="this.style.background='none'; this.style.color='#4b5563';">
                                <i class="fa-solid fa-right-from-bracket" style="font-size: 16px;"></i> Logout
                            </a>
                        </div>

                    </div>

                    <a href="admin.html" class="create-btn" style="display: inline-flex; align-items: center; justify-content: center; text-decoration: none;">

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
            <a href="#/contact">Contact</a>
            
            <!-- Mobile User Profile & Settings Section -->
            <div style="margin: 15px 0; border-top: 1px solid #e5e7eb; padding-top: 15px; display: flex; align-items: center; gap: 12px;">
                <img src="https://i.pravatar.cc/100?img=32" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);">
                <div>
                    <strong style="display: block; font-size: 14px; color: var(--text-primary);">Hi, User</strong>
                    <span style="font-size: 12px; color: var(--text-muted);">Logged In</span>
                </div>
            </div>
            
            <a href="#/my-registrations" style="padding: 10px 0; font-size: 15px; color: var(--text-secondary); display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-user-circle"></i> My Profile
            </a>
            <a href="#/login" style="padding: 10px 0; font-size: 15px; color: var(--text-secondary); display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
            </a>
            
            <a href="admin.html" class="mobile-btn" style="display: block; text-align: center; text-decoration: none; margin-top: 15px;">
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

    // Profile Dropdown Toggle
    const profileContainer = document.getElementById('profile-container');
    const profileDropdown = document.getElementById('profile-dropdown-menu');

    if (profileContainer && profileDropdown) {
        profileContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShown = profileDropdown.style.display === 'flex';
            profileDropdown.style.display = isShown ? 'none' : 'flex';
        });

        document.addEventListener('click', () => {
            profileDropdown.style.display = 'none';
        });
    }

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
