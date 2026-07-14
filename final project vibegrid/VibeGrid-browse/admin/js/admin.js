/**
 * admin.js  (ES module — entry point)
 * Owner: Anurag Kumar Jaiswara (Team Leader)
 * Shared data contract + integration layer. Wires eventForm.js, eventTable.js,
 * crud.js and deleteModal.js into one working dashboard, and owns the single
 * refresh() that keeps the table and stats in sync with storage.
 */

import * as crud from "./crud.js";
import { init as initEventForm, openEventForm } from "./eventForm.js";
import { init as initEventTable, renderEventTable } from "./eventTable.js";
import { init as initDeleteModal } from "./deleteModal.js";
import { DATA_CHANGED_EVENT } from "./crud.js";

const state = {
  events: [],
};

let currentTab = "dashboard";
let activeAccentColor = "#E43D12";

function refresh() {
  state.events = crud.getEvents();
  renderEventTable(state.events);
  updateStats(state.events);

  if (currentTab === "attendees") {
    const searchVal = document.getElementById("attendeeSearchInput")?.value || "";
    renderAttendeesTable(searchVal);
  }
}

function updateStats(events) {
  const totalEl = document.getElementById("statTotalEvents");
  const attendeesEl = document.getElementById("statTotalAttendees");
  const upcomingEl = document.getElementById("statUpcoming");

  if (totalEl) totalEl.textContent = events.length;

  if (attendeesEl) {
    const total = events.reduce((sum, e) => sum + (e.attendees || 0), 0);
    attendeesEl.textContent = total.toLocaleString();
  }

  if (upcomingEl) {
    const now = new Date();
    const in7Days = new Date();
    in7Days.setDate(now.getDate() + 7);
    const count = events.filter((e) => {
      const d = new Date(e.date);
      return d >= now && d <= in7Days;
    }).length;
    upcomingEl.textContent = count;
  }
}

function wireAddEventButton() {
  const btn = document.getElementById("addEventBtn");
  const emptyStateBtn = document.getElementById("addEventFromEmptyState");
  [btn, emptyStateBtn].forEach((el) => {
    if (el) el.addEventListener("click", () => openEventForm("add", null));
  });
}

function wireSidebarToggle() {
  const toggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");
  if (!toggle || !sidebar) return;
  
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("is-open");
  });

  // Close sidebar when clicking any navigation link
  const navItems = sidebar.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      sidebar.classList.remove("is-open");
    });
  });

  // Close sidebar when clicking outside
  document.addEventListener("click", (e) => {
    if (sidebar.classList.contains("is-open") && !sidebar.contains(e.target) && e.target !== toggle) {
      sidebar.classList.remove("is-open");
    }
  });
}

/* ========================================================
   TAB SWITCHING SYSTEM
   ======================================================== */

function switchTab(tabName) {
  currentTab = tabName;

  const tabs = {
    dashboard: document.getElementById("navDashboard"),
    events: document.getElementById("navEvents"),
    attendees: document.getElementById("navAttendees"),
    settings: document.getElementById("navSettings"),
  };

  Object.entries(tabs).forEach(([name, el]) => {
    if (el) {
      if (name === tabName) {
        el.classList.add("is-active");
      } else {
        el.classList.remove("is-active");
      }
    }
  });

  const statsRow = document.getElementById("statsRow");
  const eventsSection = document.getElementById("eventsSection");
  const attendeesSection = document.getElementById("attendeesSection");
  const settingsSection = document.getElementById("settingsSection");
  const addEventBtn = document.getElementById("addEventBtn");

  const headingEl = document.querySelector(".topbar-heading h1");
  const subheadingEl = document.querySelector(".topbar-heading p");

  if (tabName === "dashboard") {
    if (statsRow) statsRow.style.display = "grid";
    if (eventsSection) eventsSection.style.display = "block";
    if (attendeesSection) attendeesSection.style.display = "none";
    if (settingsSection) settingsSection.style.display = "none";
    if (addEventBtn) addEventBtn.style.display = "inline-flex";

    if (headingEl) headingEl.textContent = "Event Dashboard";
    if (subheadingEl) subheadingEl.textContent = "Manage every listing on VibeGrid from one place.";
  } else if (tabName === "events") {
    if (statsRow) statsRow.style.display = "none";
    if (eventsSection) eventsSection.style.display = "block";
    if (attendeesSection) attendeesSection.style.display = "none";
    if (settingsSection) settingsSection.style.display = "none";
    if (addEventBtn) addEventBtn.style.display = "inline-flex";

    if (headingEl) headingEl.textContent = "Manage Events";
    if (subheadingEl) subheadingEl.textContent = "Create, edit, and delete event listings.";
  } else if (tabName === "attendees") {
    if (statsRow) statsRow.style.display = "none";
    if (eventsSection) eventsSection.style.display = "none";
    if (attendeesSection) attendeesSection.style.display = "block";
    if (settingsSection) settingsSection.style.display = "none";
    if (addEventBtn) addEventBtn.style.display = "none";

    if (headingEl) headingEl.textContent = "Event Attendees";
    if (subheadingEl) subheadingEl.textContent = "View and manage registered event attendees.";

    renderAttendeesTable();
  } else if (tabName === "settings") {
    if (statsRow) statsRow.style.display = "none";
    if (eventsSection) eventsSection.style.display = "none";
    if (attendeesSection) attendeesSection.style.display = "none";
    if (settingsSection) settingsSection.style.display = "block";
    if (addEventBtn) addEventBtn.style.display = "none";

    if (headingEl) headingEl.textContent = "Settings";
    if (subheadingEl) subheadingEl.textContent = "Customize your VibeGrid admin platform preferences.";

    loadSettingsIntoForm();
  }
}

function wireNavigation() {
  const navMap = {
    navDashboard: "dashboard",
    navEvents: "events",
    navAttendees: "attendees",
    navSettings: "settings"
  };
  
  Object.entries(navMap).forEach(([id, tab]) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab(tab);
      });
    }
  });
}

/* ========================================================
   ATTENDEES REGISTRY & TABLE RENDERING
   ======================================================== */

function getRegistrations() {
  let registrations = [];
  try {
    const stored = localStorage.getItem('eventPlatform.registrations');
    if (stored) {
      registrations = JSON.parse(stored);
    } else {
      // Seed mock registrations based on initial events
      const events = crud.getEvents();
      const mockNames = [
        "Alexander Wright", "Sophia Martinez", "Liam Johnson", "Olivia Davis", 
        "Noah Wilson", "Emma Anderson", "Lucas Thomas", "Ava Taylor", 
        "Ethan Moore", "Isabella Jackson", "Mason Martin", "Mia White"
      ];
      const mockEmails = [
        "alexander@example.com", "sophia@example.com", "liam@example.com", "olivia@example.com",
        "noah@example.com", "emma@example.com", "lucas@example.com", "ava@example.com",
        "ethan@example.com", "isabella@example.com", "mason@example.com", "mia@example.com"
      ];
      const mockPhones = [
        "+1 (555) 234-5678", "+1 (555) 345-6789", "+1 (555) 456-7890", "+1 (555) 567-8901",
        "+1 (555) 678-9012", "+1 (555) 789-0123", "+1 (555) 890-1234", "+1 (555) 901-2345",
        "+1 (555) 012-3456", "+1 (555) 123-4567", "+1 (555) 321-7654", "+1 (555) 432-8765"
      ];
      
      if (events && events.length > 0) {
        for (let i = 0; i < mockNames.length; i++) {
          const randomEvent = events[i % events.length];
          registrations.push({
            id: 'REG-' + (102482 + i),
            eventId: randomEvent.id,
            eventTitle: randomEvent.title,
            name: mockNames[i],
            email: mockEmails[i],
            phone: mockPhones[i],
            tickets: Math.floor(Math.random() * 3) + 1,
            date: randomEvent.date
          });
        }
      }
      localStorage.setItem('eventPlatform.registrations', JSON.stringify(registrations));
    }
  } catch (err) {
    console.error('Error loading/seeding registrations:', err);
  }
  return registrations;
}

function deleteRegistration(regId) {
  try {
    let registrations = getRegistrations();
    const idx = registrations.findIndex(r => String(r.id) === String(regId));
    if (idx === -1) return false;

    const reg = registrations[idx];
    registrations.splice(idx, 1);
    localStorage.setItem('eventPlatform.registrations', JSON.stringify(registrations));

    // Also decrement corresponding event attendees count
    const events = crud.getEvents();
    const eventIdx = events.findIndex(e => String(e.id) === String(reg.eventId));
    if (eventIdx !== -1) {
      const event = events[eventIdx];
      event.attendees = Math.max(0, (event.attendees || 0) - reg.tickets);
      event.registeredCount = event.attendees;
      crud.editEvent(event.id, { attendees: event.attendees, registeredCount: event.attendees });
    }
    return true;
  } catch (err) {
    console.error('Error deleting registration:', err);
    return false;
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

function renderAttendeesTable(searchQuery = "") {
  const tbody = document.getElementById("attendeeTableBody");
  const emptyState = document.getElementById("attendeeTableEmptyState");
  const countLabel = document.getElementById("attendeeCountLabel");
  if (!tbody) return;

  let registrations = getRegistrations();
  
  if (searchQuery.trim().length > 0) {
    const q = searchQuery.trim().toLowerCase();
    registrations = registrations.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.eventTitle.toLowerCase().includes(q) ||
      String(r.id).toLowerCase().includes(q)
    );
  }

  if (countLabel) {
    countLabel.textContent = `${registrations.length} attendee${registrations.length === 1 ? "" : "s"}`;
  }

  if (registrations.length === 0) {
    tbody.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  tbody.innerHTML = registrations.map(reg => {
    return `
      <tr>
        <td><code style="font-family: var(--font-mono); font-size: 13px;">${escapeHtml(reg.id)}</code></td>
        <td class="cell-title">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="admin-avatar" style="width: 32px; height: 32px; font-size: 13px; font-weight: 600; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--border-dark); color: var(--text-primary); margin-right: 8px;">
              ${escapeHtml(reg.name.charAt(0).toUpperCase())}
            </span>
            <div style="font-weight: 600;">${escapeHtml(reg.name)}</div>
          </div>
        </td>
        <td>${escapeHtml(reg.email)}</td>
        <td>${escapeHtml(reg.phone || "-")}</td>
        <td style="font-weight: 500; color: var(--primary);">${escapeHtml(reg.eventTitle)}</td>
        <td><span class="tag" style="background: var(--border-light); color: var(--text-primary); border-radius: var(--radius-xs); padding: 4px 8px; font-weight: 600;">${reg.tickets} ticket${reg.tickets === 1 ? "" : "s"}</span></td>
        <td>${formatDate(reg.date)}</td>
        <td class="cell-actions">
          <button class="btn btn-danger btn-sm" data-action="cancel-reg" data-id="${reg.id}">Cancel</button>
        </td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll('button[data-action="cancel-reg"]').forEach(btn => {
    btn.addEventListener("click", (e) => {
      const regId = e.currentTarget.getAttribute("data-id");
      if (confirm(`Are you sure you want to cancel registration ${regId}?`)) {
        deleteRegistration(regId);
        renderAttendeesTable(searchQuery);
        import("./toast.js").then(toast => {
          toast.show("Registration cancelled successfully.", "success");
        });
      }
    });
  });
}

function wireAttendeeSearch() {
  const input = document.getElementById("attendeeSearchInput");
  if (input) {
    input.addEventListener("input", (e) => {
      renderAttendeesTable(e.target.value);
    });
  }
}

/* ========================================================
   SETTINGS CONTROLS & DYNAMIC CUSTOMIZATION
   ======================================================== */

function getSettings() {
  try {
    const stored = localStorage.getItem("eventPlatform.settings");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error("Error reading settings:", err);
  }
  return {
    platformName: "VibeGrid",
    adminEmail: "support@vibegrid.com",
    accentColor: "#E43D12",
    theme: "light"
  };
}

function saveSettings(settings) {
  try {
    localStorage.setItem("eventPlatform.settings", JSON.stringify(settings));
    applySettings(settings);
  } catch (err) {
    console.error("Error saving settings:", err);
  }
}

function applySettings(settings) {
  const brandEl = document.querySelector(".brand-name");
  if (brandEl) brandEl.textContent = settings.platformName || "VibeGrid";

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

  if (settings.theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

function loadSettingsIntoForm() {
  const settings = getSettings();
  
  const platformNameInput = document.getElementById("settings-platformName");
  const adminEmailInput = document.getElementById("settings-adminEmail");
  const themeInput = document.getElementById("settings-theme");

  if (platformNameInput) platformNameInput.value = settings.platformName || "VibeGrid";
  if (adminEmailInput) adminEmailInput.value = settings.adminEmail || "support@vibegrid.com";
  if (themeInput) themeInput.value = settings.theme || "light";

  activeAccentColor = settings.accentColor || "#E43D12";
  updateColorChipSelection(activeAccentColor);
}

function updateColorChipSelection(color) {
  const chips = document.querySelectorAll(".color-chip");
  chips.forEach(chip => {
    const chipColor = chip.getAttribute("data-color");
    if (chipColor.toLowerCase() === color.toLowerCase()) {
      chip.classList.add("is-active");
    } else {
      chip.classList.remove("is-active");
    }
  });
}

function wireSettings() {
  const chips = document.querySelectorAll(".color-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", (e) => {
      const color = e.currentTarget.getAttribute("data-color");
      activeAccentColor = color;
      updateColorChipSelection(color);
    });
  });

  const form = document.getElementById("adminSettingsForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const platformName = document.getElementById("settings-platformName").value.trim();
      const adminEmail = document.getElementById("settings-adminEmail").value.trim();
      const theme = document.getElementById("settings-theme").value;
      
      const newSettings = {
        platformName,
        adminEmail,
        theme,
        accentColor: activeAccentColor
      };
      
      saveSettings(newSettings);
      
      import("./toast.js").then(toast => {
        toast.show("Settings saved successfully.", "success");
      });
    });
  }

  const resetBtn = document.getElementById("btn-reset-db");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("WARNING: Are you sure you want to reset the platform database? All added events, registrations, settings, and sessions will be permanently deleted!")) {
        localStorage.clear();
        alert("Platform database reset complete. Re-seeding default data...");
        window.location.reload();
      }
    });
  }
}

/* ========================================================
   INITIALIZATION
   ======================================================== */

function init() {
  // Load and apply settings on boot
  const initialSettings = getSettings();
  applySettings(initialSettings);

  // Initialize modules in dependency order.
  initEventForm();
  initEventTable();
  initDeleteModal();
  wireAddEventButton();
  wireSidebarToggle();
  
  // Wire new dashboard modules
  wireNavigation();
  wireAttendeeSearch();
  wireSettings();

  // Load and seed default registrations if they don't exist
  getRegistrations();

  // Any successful add/edit/delete dispatches this from crud.js.
  document.addEventListener(DATA_CHANGED_EVENT, refresh);

  refresh();
}

document.addEventListener("DOMContentLoaded", init);

export { init, refresh, state };
