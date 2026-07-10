/**
 * registration.js
 *
 * Handles event registration forms, data persistence in localStorage,
 * toast notifications, and rendering the user's registrations dashboard.
 */

// ==========================
// DATA PERSISTENCE
// ==========================

export function loadRegistrations() {
    try {
        const data = localStorage.getItem('registered_event_ids');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to load registrations from localStorage:', error);
        return [];
    }
}

export function saveRegistrations(registrations) {
    try {
        localStorage.setItem('registered_event_ids', JSON.stringify(registrations));
    } catch (error) {
        console.error('Failed to save registrations to localStorage:', error);
    }
}

export function loadAttendeeCounts() {
    try {
        const data = localStorage.getItem('event_attendee_counts');
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Failed to load attendee counts from localStorage:', error);
        return {};
    }
}

export function saveAttendeeCounts(counts) {
    try {
        localStorage.setItem('event_attendee_counts', JSON.stringify(counts));
    } catch (error) {
        console.error('Failed to save attendee counts from localStorage:', error);
    }
}

// ==========================
// TOAST NOTIFICATIONS
// ==========================

export function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        toast.addEventListener('transitionend', () => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, { once: true });
    }, 1500);
}

// ==========================
// VIEW: REGISTRATION FORM
// ==========================

export function mountRegistrationForm(eventId, eventsList) {
    const regView = document.getElementById("registration-view");
    if (!regView) return;

    // Show registration view and hide others
    document.getElementById("browse-view").style.display = "none";
    document.getElementById("details-view").style.display = "none";
    document.getElementById("registration-view").style.display = "block";
    document.getElementById("my-registrations-view").style.display = "none";
    if (document.getElementById("landing-view")) document.getElementById("landing-view").style.display = "none";
    if (document.getElementById("login-view")) document.getElementById("login-view").style.display = "none";

    const event = eventsList.find(e => e.id === eventId);
    if (!event) {
        regView.innerHTML = `
            <div style="text-align:center; padding:70px 20px; font-family:'Outfit',sans-serif;">
                <h2>Event Not Found</h2>
                <p>Sorry, the event you are trying to register for does not exist.</p>
                <a href="#/" style="color:var(--primary); font-weight:600; text-decoration:underline;">Go Back Home</a>
            </div>
        `;
        return;
    }

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    regView.innerHTML = `
        <div class="registration-container" style="max-width: 600px; margin: 40px auto; background: white; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-md); font-family: 'Outfit', sans-serif;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="font-size: 26px; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Event Registration</h2>
                <p style="color: var(--text-secondary); margin-top: 5px;">Secure your ticket for <strong>${event.title}</strong></p>
            </div>
            
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px; padding: 15px; background: var(--background-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                <img src="${event.bannerImage}" alt="${event.title}" style="width: 80px; height: 60px; object-fit: cover; border-radius: var(--radius-xs);">
                <div>
                    <h4 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--text-primary);">${event.title}</h4>
                    <span style="font-size: 13px; color: var(--text-secondary); display: block; margin-top: 2px;">📍 ${event.venue}</span>
                    <span style="font-size: 13px; color: var(--text-secondary); display: block;">📅 ${formatDate(event.date)} at ${event.time}</span>
                </div>
            </div>
            
            <form id="event-reg-form" style="display: flex; flex-direction: column; gap: 18px;">
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-weight: 600; font-size: 14px; color: var(--text-primary);">Full Name</label>
                    <input type="text" id="reg-name" required placeholder="John Doe" style="padding: 12px; border: 1px solid var(--input-border); border-radius: var(--radius-xs); font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s;">
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-weight: 600; font-size: 14px; color: var(--text-primary);">Email Address</label>
                    <input type="email" id="reg-email" required placeholder="john@example.com" style="padding: 12px; border: 1px solid var(--input-border); border-radius: var(--radius-xs); font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s;">
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-weight: 600; font-size: 14px; color: var(--text-primary);">Phone Number</label>
                    <input type="tel" id="reg-phone" required placeholder="+1 (555) 000-0000" style="padding: 12px; border: 1px solid var(--input-border); border-radius: var(--radius-xs); font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s;">
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-weight: 600; font-size: 14px; color: var(--text-primary);">Number of Tickets</label>
                    <select id="reg-tickets" style="padding: 12px; border: 1px solid var(--input-border); border-radius: var(--radius-xs); font-size: 14px; font-family: inherit; outline: none; background: white;" required>
                        <option value="1">1 Ticket</option>
                        <option value="2">2 Tickets</option>
                        <option value="3">3 Tickets</option>
                        <option value="4">4 Tickets</option>
                        <option value="5">5 Tickets</option>
                    </select>
                </div>
                
                <div style="margin-top: 10px; display: flex; gap: 12px;">
                    <button type="button" id="reg-cancel-btn" style="flex: 1; padding: 12px; background: #e5e7eb; color: #1f2937; border: 1px solid #d1d5db; border-radius: var(--radius-xs); font-weight: 600; cursor: pointer; transition: background 0.2s;">Cancel</button>
                    <button type="submit" style="flex: 2; padding: 12px; background: var(--btn-primary-bg); color: var(--btn-primary-text); border: none; border-radius: var(--radius-xs); font-weight: 600; cursor: pointer; transition: background 0.2s;">Confirm Registration</button>
                </div>
            </form>
        </div>
    `;

    // Apply basic focus transitions programmatically to match design
    const inputs = regView.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => input.style.borderColor = 'var(--primary)');
        input.addEventListener('blur', () => input.style.borderColor = 'var(--input-border)');
    });

    // Form submission listener
    const form = document.getElementById("event-reg-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("reg-name").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const phone = document.getElementById("reg-phone").value.trim();
        const tickets = parseInt(document.getElementById("reg-tickets").value, 10);

        if (!name || !email || !phone) {
            showToast("Please fill in all details.", "error");
            return;
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast("Please enter a valid email address.", "error");
            return;
        }

        // Phone Validation
        const phoneRegex = /^\+?[0-9\s\-()]{10,18}$/;
        if (!phoneRegex.test(phone)) {
            showToast("Please enter a valid phone number (at least 10 digits).", "error");
            return;
        }

        // Register the event
        const registrations = loadRegistrations();
        if (registrations.includes(eventId)) {
            showToast("You are already registered for this event.", "info");
            window.location.hash = "#/my-registrations";
            return;
        }

        // Save registration details in localStorage
        registrations.push(eventId);
        saveRegistrations(registrations);

        // Update attendee count
        const counts = loadAttendeeCounts();
        const currentCount = counts[eventId] !== undefined ? counts[eventId] : event.registeredCount;
        counts[eventId] = currentCount + tickets;
        saveAttendeeCounts(counts);

        showToast("Registration Successful!", "success");
        window.location.hash = "#/my-registrations";
    });

    // Cancel registration
    document.getElementById("reg-cancel-btn").addEventListener("click", () => {
        window.location.hash = `#/event-details/${eventId}`;
    });
}

// ==========================
// VIEW: MY REGISTRATIONS DASHBOARD
// ==========================

export function mountMyRegistrations(eventsList) {
    const view = document.getElementById("my-registrations-view");
    if (!view) return;

    // Show registrations view and hide others
    document.getElementById("browse-view").style.display = "none";
    document.getElementById("details-view").style.display = "none";
    document.getElementById("registration-view").style.display = "none";
    document.getElementById("my-registrations-view").style.display = "block";
    if (document.getElementById("landing-view")) document.getElementById("landing-view").style.display = "none";
    if (document.getElementById("login-view")) document.getElementById("login-view").style.display = "none";

    const registrations = loadRegistrations();
    const registeredEvents = eventsList.filter(e => registrations.includes(e.id));

    view.innerHTML = "";

    const container = createElement('div', { className: 'container' });
    
    // Header
    const header = createElement('header');
    const headerInfo = createElement('div', { className: 'header-info' });
    headerInfo.append(
        createElement('h1', { text: 'My Registrations' }),
        createElement('p', { text: `You are currently registered for ${registeredEvents.length} event(s).` })
    );

    const clearButton = createElement('button', {
        className: 'reset-btn',
        text: 'Clear Registrations',
        attrs: {
            id: 'clear-storage-btn',
            'aria-label': 'Reset all registrations and attendee counts',
            type: 'button',
        },
    });
    header.append(headerInfo, clearButton);
    container.append(header);

    if (registeredEvents.length === 0) {
        const emptyState = createElement('div', {
            styles: {
                textAlign: 'center',
                padding: '80px 20px',
                fontFamily: 'Outfit, sans-serif',
                background: 'white',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                marginTop: '20px'
            },
            html: `
                <i class="fa-solid fa-calendar-xmark" style="font-size: 50px; color: var(--text-muted); margin-bottom: 20px;"></i>
                <h3 style="font-size: 20px; font-weight: 700; color: var(--text-primary);">No Registered Events</h3>
                <p style="color: var(--text-secondary); margin-top: 6px; font-size: 14px;">You haven't registered for any events yet. Explore our featured events list!</p>
                <a href="#/browse" style="margin-top: 20px; display: inline-block; padding: 10px 20px; background: var(--btn-primary-bg); color: var(--btn-primary-text); text-decoration: none; border-radius: var(--radius-sm); font-weight: 600; font-size: 14px; transition: background 0.2s;">Explore Events</a>
            `
        });
        container.append(emptyState);
    } else {
        const eventsGrid = createElement('main', { className: 'events-grid' });
        registeredEvents.forEach((event) => {
            eventsGrid.append(buildEventCard(event));
        });
        container.append(eventsGrid);
    }

    view.append(container);

    // Event listener for Clear Storage
    const clearBtn = document.getElementById('clear-storage-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem('registered_event_ids');
            localStorage.removeItem('event_attendee_counts');
            showToast('Registrations cleared successfully!', 'info');
            mountMyRegistrations(eventsList);
        });
    }
}

// ==========================
// UTILITY FUNCTIONS
// ==========================

function createElement(tag, options = {}) {
    const element = document.createElement(tag);

    if (options.className) {
        element.className = options.className;
    }
    if (options.text) {
        element.textContent = options.text;
    }
    if (options.html) {
        element.innerHTML = options.html;
    }
    if (options.attrs) {
        Object.entries(options.attrs).forEach(([name, value]) => {
            if (value !== undefined && value !== null) {
                element.setAttribute(name, value);
            }
        });
    }
    if (options.styles) {
        Object.assign(element.style, options.styles);
    }

    return element;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function buildEventCard(event) {
    const counts = loadAttendeeCounts();
    const attendeeCount = counts[event.id] !== undefined ? counts[event.id] : event.registeredCount;
    const card = createElement('div', { className: 'event-card', attrs: { 'data-id': event.id } });
    
    const image = createElement('img', {
        className: 'event-image',
        attrs: {
            src: event.bannerImage,
            alt: event.title,
        },
    });
    
    image.style.cursor = 'pointer';
    image.addEventListener('click', () => {
        window.location.hash = `#/event-details/${event.id}`;
    });

    const details = createElement('div', { className: 'event-details' });
    
    const categoryColors = {
        'music': 'var(--category-music)',
        'technology': 'var(--category-tech)',
        'sports': 'var(--category-cultural)',
        'art & culture': 'var(--category-cultural)',
        'business': 'var(--category-conference)',
        'food & drink': 'var(--category-workshop)',
        'health & wellness': 'var(--category-music)',
        'education': 'var(--category-tech)'
    };
    const catColor = categoryColors[event.category.toLowerCase()] || 'var(--primary)';

    const titleEl = createElement('h3', { text: event.title });
    titleEl.style.cursor = 'pointer';
    titleEl.addEventListener('click', () => {
        window.location.hash = `#/event-details/${event.id}`;
    });

    details.append(
        createElement('p', {
            className: 'event-category',
            text: event.category,
            styles: { color: catColor },
        }),
        titleEl,
        createElement('p', { className: 'event-meta', text: `📅 ${formatDate(event.date)}` }),
        createElement('p', { className: 'event-meta', text: `📍 ${event.venue}` }),
        createElement('p', { className: 'attendee-count', text: `${attendeeCount} Attendees` }),
        createElement('a', {
            className: 'register-btn',
            text: 'View Details',
            attrs: {
                href: `#/event-details/${event.id}`,
                'aria-label': `View details for ${event.title}`,
            },
        })
    );

    card.append(image, details);
    return card;
}
