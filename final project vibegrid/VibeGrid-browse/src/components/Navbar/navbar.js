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
    const userSession = localStorage.getItem("user_session");
    let user = null;
    if (userSession) {
        try {
            user = JSON.parse(userSession);
        } catch (e) {
            console.error(e);
        }
    }
    const isLoggedIn = !!user;
    const userName = user ? (user.name || user.email.split('@')[0]) : 'User';

    return `
        <!--================== NAVBAR ==================-->

        <header class="navbar">

            <div class="container">

                <!-- Logo -->

                <a href="#/" class="logo">

                    <div class="logo-icon" style="background: none; box-shadow: none; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-light);">
                        <img src="./logo.jpg" alt="Logo" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>

                    <span>VibeGrid</span>

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

                    <div class="notification-container" style="position: relative; display: inline-flex; align-items: center;">
                        <button class="notification" id="notification-btn" style="cursor: pointer; background: none; border: none; font-size: 20px; color: var(--text-secondary); transition: var(--transition-normal); position: relative;">
                            <i class="fa-regular fa-bell"></i>
                            <span class="notification-dot" style="position: absolute; width: 8px; height: 8px; border-radius: 50%; background: var(--secondary); right: -2px; top: 2px;"></span>
                        </button>
                        
                        <!-- Notification Dropdown Menu -->
                        <div id="notification-dropdown-menu" style="
                            position: absolute;
                            top: 55px;
                            right: 0;
                            width: 280px;
                            background: white;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                            display: none;
                            flex-direction: column;
                            padding: 12px;
                            z-index: 1001;
                            text-align: left;
                        ">
                            <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: var(--text-primary); border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">Notifications</div>
                            <div class="notification-item" style="font-size: 13px; color: #4b5563; padding: 6px 0; border-bottom: 1px solid #f3f4f6;">
                                <strong>Welcome to VibeGrid!</strong> Explore upcoming events and register today.
                            </div>
                            <div class="notification-item" style="font-size: 13px; color: #4b5563; padding: 6px 0;">
                                <strong>New Feature:</strong> Chat with our event assistant widget on the bottom right.
                            </div>
                        </div>
                    </div>

                    ${isLoggedIn ? `
                    <div class="profile" id="profile-container" style="position: relative;">

                        <img src="https://i.pravatar.cc/100?img=32">

                        <span>Hi, ${userName}</span>

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
                            <a href="#/login" id="logout-btn" style="
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
                    ` : `
                    <a href="#/login" class="login-btn" style="
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: var(--radius-round);
                        background: var(--surface);
                        border: 1px solid var(--border);
                        color: var(--text-primary);
                        font-size: 14px;
                        font-weight: 600;
                        transition: var(--transition-normal);
                    " onmouseover="this.style.background='var(--background-secondary)';" onmouseout="this.style.background='var(--surface)';">
                        <i class="fa-solid fa-user" style="margin-right: 8px;"></i>
                        Login / Signup
                    </a>
                    `}

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
            <a href="#contact">Contact</a>
            
            ${isLoggedIn ? `
            <!-- Mobile User Profile & Settings Section -->
            <a href="#/my-registrations" style="text-decoration: none; margin: 15px 0; border-top: 1px solid #e5e7eb; padding-top: 15px; display: flex; align-items: center; gap: 12px;">
                <img src="https://i.pravatar.cc/100?img=32" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);">
                <div>
                    <strong style="display: block; font-size: 14px; color: var(--text-primary);">Hi, ${userName}</strong>
                    <span style="font-size: 12px; color: var(--text-muted);">Logged In</span>
                </div>
            </a>
            
            <a href="#/my-registrations" style="padding: 10px 0; font-size: 15px; color: var(--text-secondary); display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-user-circle"></i> My Profile
            </a>
            <a href="#/login" id="mobile-logout-btn" style="padding: 10px 0; font-size: 15px; color: var(--text-secondary); display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
            </a>
            ` : `
            <a href="#/login" style="padding: 10px 0; font-size: 15px; color: var(--text-secondary); display: flex; align-items: center; gap: 10px; border-top: 1px solid #e5e7eb; margin-top: 15px; padding-top: 15px;">
                <i class="fa-solid fa-user"></i> Login / Signup
            </a>
            `}
            
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
    const notificationBtn = document.getElementById('notification-btn');
    const notificationDropdown = document.getElementById('notification-dropdown-menu');

    if (profileContainer && profileDropdown) {
        profileContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShown = profileDropdown.style.display === 'flex';
            profileDropdown.style.display = isShown ? 'none' : 'flex';
            if (notificationDropdown) notificationDropdown.style.display = 'none';
        });

        profileDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.style.display = 'none';
        });
    }

    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShown = notificationDropdown.style.display === 'flex';
            notificationDropdown.style.display = isShown ? 'none' : 'flex';
            if (profileDropdown) profileDropdown.style.display = 'none';
        });

        notificationDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    document.addEventListener('click', () => {
        if (profileDropdown) profileDropdown.style.display = 'none';
        if (notificationDropdown) notificationDropdown.style.display = 'none';
    });

    // Logout handlers
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    
    const handleLogout = (e) => {
        localStorage.removeItem("user_session");
        mountNavbar();
        window.location.hash = "#/login";
    };

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);

    /* Hamburger toggle */

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    /* Close mobile menu when a mobile link is clicked (hash links only) */

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
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
