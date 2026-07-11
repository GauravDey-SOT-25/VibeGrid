/**
 * admin.js  (ES module — entry point)
 * Owner: Anurag Kumar Jaiswara (Team Leader)
 * Shared data contract + integration layer. Wires eventForm.js, eventTable.js,
 * crud.js and deleteModal.js into one working dashboard, and owns the single
 * refresh() that keeps the table and stats in sync with storage.
 *
 * Data contract (matches PRD's suggested Admin Dashboard fields):
 * { id, title, category, date, time, venue, description, imageUrl, maxAttendees, attendees }
 *
 * This is the ONLY file that imports every other module. eventForm.js,
 * eventTable.js and deleteModal.js do not import this file — they signal
 * data changes through crud.js's "admin:data-changed" DOM event instead,
 * so there is no circular dependency anywhere in the module graph.
 */

import * as crud from "./crud.js";
import { init as initEventForm, openEventForm } from "./eventForm.js";
import { init as initEventTable, renderEventTable } from "./eventTable.js";
import { init as initDeleteModal } from "./deleteModal.js";
import { DATA_CHANGED_EVENT } from "./crud.js";

const state = {
  events: [],
};

function refresh() {
  state.events = crud.getEvents();
  renderEventTable(state.events);
  updateStats(state.events);
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
  toggle.addEventListener("click", () => sidebar.classList.toggle("is-open"));
}

function init() {
  // Initialize modules in dependency order.
  initEventForm();
  initEventTable();
  initDeleteModal();
  wireAddEventButton();
  wireSidebarToggle();

  // Any successful add/edit/delete dispatches this from crud.js.
  document.addEventListener(DATA_CHANGED_EVENT, refresh);

  refresh();
}

document.addEventListener("DOMContentLoaded", init);

export { init, refresh, state };
