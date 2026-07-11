/**
 * home.js
 *
 * Handles rendering the landing Home page with a hero section,
 * beautiful text overlay, and call-to-action buttons.
 */

export function mountHome() {
    const landingView = document.getElementById("landing-view");
    if (!landingView) return;

    // Show landing view and hide all others
    landingView.style.display = "block";
    
    const viewIds = ["browse-view", "details-view", "registration-view", "my-registrations-view", "login-view"];
    viewIds.forEach(id => {
        const view = document.getElementById(id);
        if (view) {
            view.style.display = "none";
        }
    });

    landingView.innerHTML = `
        <section class="hero-section">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1 class="hero-title">ALL EVENTS AT ONE PLACE</h1>
                <p class="hero-subtitle">
                    Discover, join, and relive every moment. <br>
                    From hackathon to fest, never miss what matters.
                </p>
                <div class="hero-actions">
                    <a href="#/browse" class="hero-btn hero-btn-primary">
                        <i class="fa-solid fa-compass"></i> Explore Events
                    </a>
                    <a href="#/login" class="hero-btn hero-btn-secondary">
                        <i class="fa-solid fa-user"></i> Login / Signup
                    </a>
                </div>
            </div>
        </section>
    `;
}
