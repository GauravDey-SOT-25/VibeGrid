/**
 * footer.js
 *
 * Self-contained Footer component that mounts statically on application init.
 */

function Footer() {
    return `
        <footer class="main-footer">
            <div class="footer-container">
                <!-- Brand Info Section -->
                <div class="footer-section brand-info">
                    <div class="footer-logo" style="display: flex; align-items: center; gap: 10px;">
                        <img src="./logo.jpg" alt="Logo" style="width: 32px; height: 32px; object-fit: cover; border-radius: var(--radius-xs); border: 1px solid var(--border-light);" />
                        <span>VibeGrid</span>
                    </div>
                    <p class="brand-description">
                        Connecting people, creating memories. Discover, join, and relive every moment. From hackathons to festivals, never miss what matters.
                    </p>
                    <div class="social-links">
                        <a href="https://facebook.com" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                        <a href="https://twitter.com" target="_blank" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
                        <a href="https://instagram.com" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                        <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
                        <a href="https://youtube.com" target="_blank" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
                    </div>
                </div>

                <!-- Quick Navigation Links -->
                <div class="footer-section footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#/">Home</a></li>
                        <li><a href="#/browse">Browse Events</a></li>
                        <li><a href="#/my-registrations">My Registrations</a></li>
                        <li><a href="#/login">Login / Signup</a></li>
                    </ul>
                </div>

                <!-- Contact Details -->
                <div class="footer-section contact-info" id="footer-contact">
                    <h3>Contact Us</h3>
                    <ul class="contact-list">
                        <li>
                            <i class="fa-solid fa-phone"></i>
                            <div>
                                <span>+1 (555) 019-2834</span>
                                <span>+1 (555) 019-5678</span>
                            </div>
                        </li>
                        <li>
                            <i class="fa-solid fa-envelope"></i>
                            <div>
                                <a href="mailto:support@vibegrid.com">support@vibegrid.com</a>
                            </div>
                        </li>
                        <li>
                            <i class="fa-solid fa-location-dot"></i>
                            <div>
                                <span>100 Innovation Way, Suite 400</span>
                                <span>Tech City, TC 94016</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Footer Bottom bar -->
            <div class="footer-bottom">
                <div class="bottom-container">
                    <p>&copy; ${new Date().getFullYear()} VibeGrid. All rights reserved.</p>
                    <div class="bottom-links">
                        <a href="#/">Privacy Policy</a>
                        <a href="#/">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    `;
}

export function mountFooter() {
    const root = document.getElementById("footer-root");
    if (!root) {
        console.error('[Footer] Mount point "#footer-root" not found in the DOM.');
        return;
    }

    root.innerHTML = Footer();
}
