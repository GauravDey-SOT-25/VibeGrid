/**
 * eventDetails.js
 *
 * Exportable view for showing Event Details dynamically inside the SPA.
 */

export function mountEventDetails(eventId, eventsList) {
    const detailsView = document.getElementById("details-view");
    if (!detailsView) return;
    
    // Hide other views and show details view
    document.getElementById("browse-view").style.display = "none";
    document.getElementById("details-view").style.display = "block";
    document.getElementById("registration-view").style.display = "none";
    document.getElementById("my-registrations-view").style.display = "none";
    if (document.getElementById("landing-view")) document.getElementById("landing-view").style.display = "none";
    if (document.getElementById("login-view")) document.getElementById("login-view").style.display = "none";

    const event = eventsList.find(e => e.id === eventId);
    if (!event) {
        detailsView.innerHTML = `
            <div style="text-align:center; padding:70px 20px; font-family:'Outfit',sans-serif;">
                <h2>Event Not Found</h2>
                <p>Sorry, the event you are looking for does not exist.</p>
                <a href="#/" style="color:var(--primary); font-weight:600; text-decoration:underline; display:inline-block; margin-top:20px;">Go Back Home</a>
            </div>
        `;
        return;
    }

    // Helper functions
    const isRegistered = (id) => {
        try {
            const regs = JSON.parse(localStorage.getItem("registered_event_ids") || "[]");
            return regs.includes(id);
        } catch { return false; }
    };
    
    const getAttendeeCount = (id, defaultCount) => {
        try {
            const counts = JSON.parse(localStorage.getItem("event_attendee_counts") || "{}");
            return counts[id] !== undefined ? counts[id] : defaultCount;
        } catch { return defaultCount; }
    };

    const isUserRegistered = isRegistered(event.id);
    const currentAttendeeCount = getAttendeeCount(event.id, event.registeredCount);
    const seatsLeft = Math.max(0, event.maxAttendees - currentAttendeeCount);

    // Format date helper
    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    detailsView.innerHTML = `
        <div class="event-container">
            <img id="eventImage" class="event-banner" src="${event.bannerImage}" alt="${event.title}">

            <div class="event-content">
                <h1 id="eventTitle">${event.title}</h1>

                <p id="eventDescription" class="description">${event.description}</p>

                <div class="details-grid">
                    <div class="detail-card">
                        <span>Date</span>
                        <strong id="eventDate">${formatDate(event.date)}</strong>
                    </div>

                    <div class="detail-card">
                        <span>Time</span>
                        <strong id="eventTime">${event.time}</strong>
                    </div>

                    <div class="detail-card">
                        <span>Venue</span>
                        <strong id="eventVenue">${event.venue}</strong>
                    </div>

                    <div class="detail-card">
                        <span>Organizer</span>
                        <strong id="eventOrganizer">${event.organizer || "EventHub Partner"}</strong>
                    </div>
                </div>

                <div class="seats-box">
                    <span>Available Seats</span>
                    <h2 id="eventSeats">${seatsLeft} / ${event.maxAttendees} Seats Left</h2>
                </div>

                <div class="button-group">
                    <button id="registerBtn" class="register-btn" style="
                        background: ${isUserRegistered ? 'var(--success-bg)' : 'var(--btn-primary-bg)'};
                        color: ${isUserRegistered ? 'var(--success)' : 'var(--btn-primary-text)'};
                        border: 1px solid ${isUserRegistered ? 'var(--success)' : 'var(--btn-primary-bg)'};
                        cursor: ${isUserRegistered ? 'not-allowed' : 'pointer'};
                        font-family: inherit;
                        font-weight: 600;
                        border-radius: var(--radius-sm);
                        transition: all var(--transition-fast);
                    " ${isUserRegistered ? 'disabled' : ''}>
                        ${isUserRegistered ? 'Registered ✓' : 'Register Now'}
                    </button>

                    <button id="backBtn" class="back-btn" style="
                        background: #e5e7eb;
                        color: #1f2937;
                        border: 1px solid #d1d5db;
                        cursor: pointer;
                        font-family: inherit;
                        font-weight: 600;
                        border-radius: var(--radius-sm);
                        transition: all var(--transition-fast);
                    " onmouseover="this.style.background='#d1d5db'" onmouseout="this.style.background='#e5e7eb'">
                        Back
                    </button>
                </div>
            </div>
        </div>
    `;

    // Event listeners
    const registerBtn = document.getElementById("registerBtn");
    if (!isUserRegistered) {
        registerBtn.addEventListener("click", () => {
            window.location.hash = `#/register/${event.id}`;
        });
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        window.location.hash = "#/browse";
    });
}