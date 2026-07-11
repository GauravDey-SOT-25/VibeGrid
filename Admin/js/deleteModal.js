/**
 * deleteModal.js  (ES module)
 * Owner: Manish Rai
 * Confirmation popup shown before any event is deleted. Opens from eventTable.js,
 * confirms via crud.js, and triggers a toast on completion. crud.js's
 * "admin:data-changed" event (not a direct call here) is what tells admin.js
 * to refresh the table and stats.
 */

import * as crud from "./crud.js";
import { show as showToast } from "./toast.js";

let pendingEventId = null;
let pendingEventTitle = "";

function getElements() {
  return {
    overlay: document.getElementById("deleteModalOverlay"),
    titleSlot: document.getElementById("deleteModalEventTitle"),
    cancelBtn: document.getElementById("deleteModalCancelBtn"),
    confirmBtn: document.getElementById("deleteModalConfirmBtn"),
  };
}

export function openDeleteModal(eventId, eventTitle) {
  pendingEventId = eventId;
  pendingEventTitle = eventTitle;
  const { overlay, titleSlot, confirmBtn } = getElements();
  if (!overlay) return;
  titleSlot.textContent = eventTitle;
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  if (confirmBtn) confirmBtn.focus();
  document.addEventListener("keydown", handleEscape);
}

export function closeDeleteModal() {
  const { overlay } = getElements();
  if (!overlay) return;
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  pendingEventId = null;
  pendingEventTitle = "";
  document.removeEventListener("keydown", handleEscape);
}

function handleEscape(e) {
  if (e.key === "Escape") closeDeleteModal();
}

function confirmDelete() {
  if (pendingEventId === null) return;
  const ok = crud.deleteEvent(pendingEventId);
  if (ok) {
    showToast(`"${pendingEventTitle}" was deleted.`, "success");
  } else {
    showToast("Couldn't delete that event. Try again.", "error");
  }
  closeDeleteModal();
}

export function init() {
  const { overlay, cancelBtn, confirmBtn } = getElements();
  if (!overlay) return;
  cancelBtn.addEventListener("click", closeDeleteModal);
  confirmBtn.addEventListener("click", confirmDelete);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeDeleteModal();
  });
}
