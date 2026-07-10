/**
 * login.js
 *
 * Handles rendering the Login and Signup pages statically inside the SPA.
 * Integrates dynamic tab switching and mockup submit actions with toast notifications.
 */

import { showToast } from '../Registration/registration.js';

export function mountLogin() {
    const loginView = document.getElementById("login-view");
    if (!loginView) return;

    // Show login view and hide others
    loginView.style.display = "block";

    const viewIds = ["landing-view", "home-view", "details-view", "registration-view", "my-registrations-view"];
    viewIds.forEach(id => {
        const view = document.getElementById(id);
        if (view) {
            view.style.display = "none";
        }
    });

    // Check hash to determine active tab on mount
    const isSignupMode = window.location.hash === '#/signup';

    renderLoginForm(loginView, isSignupMode);
}

function renderLoginForm(container, signupMode = false) {
    container.innerHTML = `
        <div class="login-wrapper">
            <div class="login-card">
                <div class="login-header">
                    <div class="login-tabs">
                        <button id="tab-login" class="tab-btn ${!signupMode ? 'active' : ''}">Login</button>
                        <button id="tab-signup" class="tab-btn ${signupMode ? 'active' : ''}">Sign Up</button>
                    </div>
                </div>

                <!-- LOGIN FORM -->
                <form id="login-form" class="auth-form" style="display: ${!signupMode ? 'flex' : 'none'};">
                    <h2>Welcome Back</h2>
                    <p class="auth-subtitle">Login to access your registered events and tickets</p>
                    
                    <div class="input-group">
                        <label>Email Address</label>
                        <input type="email" id="login-email" required placeholder="name@example.com">
                    </div>

                    <div class="input-group">
                        <label>Password</label>
                        <input type="password" id="login-password" required placeholder="••••••••">
                    </div>

                    <button type="submit" class="auth-submit-btn">Login</button>
                </form>

                <!-- SIGNUP FORM -->
                <form id="signup-form" class="auth-form" style="display: ${signupMode ? 'flex' : 'none'};">
                    <h2>Create Account</h2>
                    <p class="auth-subtitle">Join EventHub to discover and register for premium events</p>
                    
                    <div class="input-group">
                        <label>Full Name</label>
                        <input type="text" id="signup-name" required placeholder="John Doe">
                    </div>

                    <div class="input-group">
                        <label>Email Address</label>
                        <input type="email" id="signup-email" required placeholder="name@example.com">
                    </div>

                    <div class="input-group">
                        <label>Password</label>
                        <input type="password" id="signup-password" required placeholder="••••••••">
                    </div>

                    <div class="input-group">
                        <label>Confirm Password</label>
                        <input type="password" id="signup-confirm-password" required placeholder="••••••••">
                    </div>

                    <button type="submit" class="auth-submit-btn">Sign Up</button>
                </form>
            </div>
        </div>
    `;

    setupAuthListeners(container);
}

function setupAuthListeners(container) {
    const tabLogin = document.getElementById("tab-login");
    const tabSignup = document.getElementById("tab-signup");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    // Tab Switching logic
    tabLogin.addEventListener("click", () => {
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
        loginForm.style.display = "flex";
        signupForm.style.display = "none";
        window.location.hash = "#/login";
    });

    tabSignup.addEventListener("click", () => {
        tabSignup.classList.add("active");
        tabLogin.classList.remove("active");
        signupForm.style.display = "flex";
        loginForm.style.display = "none";
        window.location.hash = "#/signup";
    });

    // Handle submissions
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        // Custom validation check using email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast("Please enter a valid email address.", "error");
            return;
        }

        if (password.length < 6) {
            showToast("Password must be at least 6 characters.", "error");
            return;
        }

        // Simulating session
        localStorage.setItem("user_session", JSON.stringify({ email }));
        showToast("Login Successful!", "success");
        setTimeout(() => {
            window.location.hash = "#/";
        }, 800);
    });

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("signup-confirm-password").value;

        // Regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast("Please enter a valid email address.", "error");
            return;
        }

        if (password.length < 6) {
            showToast("Password must be at least 6 characters.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        // Simulating session creation
        localStorage.setItem("user_session", JSON.stringify({ name, email }));
        showToast("Account Created Successfully!", "success");
        setTimeout(() => {
            window.location.hash = "#/";
        }, 800);
    });
}
