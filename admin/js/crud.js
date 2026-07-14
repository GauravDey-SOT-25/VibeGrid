/**
 * crud.js  (ES module)
 * Owner: Manish Rai
 * Single layer that talks to Backend's localStorageService.js.
 * eventForm.js and eventTable.js import this instead of hitting the storage
 * service directly.
 *
 * Loose-coupling note: instead of reaching back into admin.js to trigger a
 * re-render (which would create a circular import between crud.js and
 * admin.js), crud.js dispatches an "admin:data-changed" DOM event on every
 * successful mutation. admin.js — and only admin.js — listens for it. Every
 * other module stays unaware that admin.js even exists.
 */

import * as localStorageService from "../../src/services/eventsService.js";

const DATA_CHANGED_EVENT = "admin:data-changed";

function notifyDataChanged() {
  document.dispatchEvent(new CustomEvent(DATA_CHANGED_EVENT));
}

export function addEvent(eventData) {
  const saved = localStorageService.addNewEvent(eventData);
  if (saved) notifyDataChanged();
  return saved;
}

export function editEvent(id, updates) {
  const updated = localStorageService.updateEventDetails(id, updates);
  if (updated) notifyDataChanged();
  return updated;
}

export function deleteEvent(id) {
  const removed = localStorageService.removeEvent(id);
  if (removed) notifyDataChanged();
  return removed;
}

export function getEvents() {
  return localStorageService.getAllEvents();
}

export { DATA_CHANGED_EVENT };
