/**
 * eventTable.js  (ES module)
 * Owner: Karan Kamal
 * Renders the event list as a table, with live search and column sorting.
 * Edit opens eventForm.js in edit mode; Delete opens deleteModal.js.
 *
 * Loose-coupling note: the last events array passed in from admin.js is
 * cached locally. Typing in the search box or clicking a sort header just
 * re-renders from that cache — it never needs to call back into admin.js
 * or re-read storage, since search/sort are pure view-layer concerns.
 */

import { openEventForm } from "./eventForm.js";
import { openDeleteModal } from "./deleteModal.js";
import * as crud from "./crud.js";

let currentSearch = "";
let currentSort = { field: "date", direction: "asc" };
let cachedEvents = [];

function els() {
  return {
    tbody: document.getElementById("eventTableBody"),
    emptyState: document.getElementById("eventTableEmptyState"),
    searchInput: document.getElementById("eventSearchInput"),
    sortHeaders: document.querySelectorAll("[data-sort-field]"),
    countLabel: document.getElementById("eventCountLabel"),
  };
}

function applySearchAndSort(events) {
  let result = events;

  if (currentSearch.trim().length > 0) {
    const q = currentSearch.trim().toLowerCase();
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
    );
  }

  const { field, direction } = currentSort;
  result = [...result].sort((a, b) => {
    let valA = a[field];
    let valB = b[field];
    if (field === "date") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    } else {
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
    }
    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return result;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function renderRow(evt) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="cell-title">
      <span class="event-dot" data-category="${evt.category}"></span>
      <div>
        <div class="cell-title-main">${escapeHtml(evt.title)}</div>
        <div class="cell-title-sub">${escapeHtml(evt.venue)}</div>
      </div>
    </td>
    <td><span class="tag">${escapeHtml(evt.category)}</span></td>
    <td>${formatDate(evt.date)}</td>
    <td>${evt.attendees || 0} / ${evt.maxAttendees}</td>
    <td class="cell-actions">
      <button class="btn btn-ghost btn-sm" data-action="edit" data-id="${evt.id}">Edit</button>
      <button class="btn btn-danger btn-sm" data-action="delete" data-id="${evt.id}">Delete</button>
    </td>
  `;
  return tr;
}

export function renderEventTable(events) {
  cachedEvents = events;
  const { tbody, emptyState, countLabel } = els();
  if (!tbody) return;

  const visible = applySearchAndSort(events);
  tbody.innerHTML = "";

  if (visible.length === 0) {
    emptyState.classList.add("is-visible");
    emptyState.textContent =
      currentSearch.trim().length > 0
        ? `No events found for "${currentSearch}".`
        : "No events yet. Click \u201c+ Add Event\u201d to create your first one.";
  } else {
    emptyState.classList.remove("is-visible");
    visible.forEach((evt) => tbody.appendChild(renderRow(evt)));
  }

  if (countLabel) {
    countLabel.textContent = `${visible.length} of ${events.length} event${events.length === 1 ? "" : "s"}`;
  }
}

function handleTableClick(e) {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const events = crud.getEvents();
  const evt = events.find((x) => x.id === id);
  if (!evt) return;

  if (btn.dataset.action === "edit") {
    openEventForm("edit", evt);
  } else if (btn.dataset.action === "delete") {
    openDeleteModal(evt.id, evt.title);
  }
}

function handleSearchInput(e) {
  currentSearch = e.target.value;
  renderEventTable(cachedEvents);
}

function handleSortClick(e) {
  const field = e.currentTarget.dataset.sortField;
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
  } else {
    currentSort = { field, direction: "asc" };
  }
  updateSortIndicators();
  renderEventTable(cachedEvents);
}

function updateSortIndicators() {
  const { sortHeaders } = els();
  sortHeaders.forEach((h) => {
    h.classList.remove("is-sorted-asc", "is-sorted-desc");
    if (h.dataset.sortField === currentSort.field) {
      h.classList.add(currentSort.direction === "asc" ? "is-sorted-asc" : "is-sorted-desc");
    }
  });
}

export function init() {
  const { tbody, searchInput, sortHeaders } = els();
  if (!tbody) return;
  tbody.addEventListener("click", handleTableClick);
  if (searchInput) searchInput.addEventListener("input", handleSearchInput);
  sortHeaders.forEach((h) => h.addEventListener("click", handleSortClick));
  updateSortIndicators();
}
