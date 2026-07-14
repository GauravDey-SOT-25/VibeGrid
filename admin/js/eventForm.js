/**
 * eventForm.js  (ES module)
 * Owner: Ashish Anand
 * One form component that handles both Add and Edit, driven by a mode flag.
 * Uses formValidation.js for validation and crud.js to persist. Does not
 * import admin.js: crud.js's "admin:data-changed" event is what tells
 * admin.js to refresh, so this module stays decoupled from the dashboard shell.
 */

import { validateEventForm } from "./formValidation.js";
import * as crud from "./crud.js";
import { show as showToast } from "./toast.js";

let currentMode = "add"; // "add" | "edit"
let currentEventId = null;

const FIELD_IDS = [
  "title",
  "category",
  "date",
  "time",
  "venue",
  "maxAttendees",
  "imageUrl",
  "description",
];

function els() {
  return {
    panelOverlay: document.getElementById("eventFormOverlay"),
    panel: document.getElementById("eventFormPanel"),
    form: document.getElementById("eventForm"),
    heading: document.getElementById("eventFormHeading"),
    subheading: document.getElementById("eventFormSubheading"),
    submitBtn: document.getElementById("eventFormSubmitBtn"),
    cancelBtn: document.getElementById("eventFormCancelBtn"),
    closeBtn: document.getElementById("eventFormCloseBtn"),
  };
}

function fieldEl(name) {
  return document.getElementById(`field-${name}`);
}

function errorEl(name) {
  return document.getElementById(`error-${name}`);
}

function clearErrors() {
  FIELD_IDS.forEach((name) => {
    const err = errorEl(name);
    const field = fieldEl(name);
    if (err) err.textContent = "";
    if (field) field.classList.remove("has-error");
  });
}

function showErrors(errors) {
  clearErrors();
  Object.keys(errors).forEach((name) => {
    const err = errorEl(name);
    const field = fieldEl(name);
    if (err) err.textContent = errors[name];
    if (field) field.classList.add("has-error");
  });
}

function readForm() {
  return {
    title: fieldEl("title").value.trim(),
    category: fieldEl("category").value,
    date: fieldEl("date").value,
    time: fieldEl("time").value,
    venue: fieldEl("venue").value.trim(),
    maxAttendees: fieldEl("maxAttendees").value,
    imageUrl: fieldEl("imageUrl").value.trim(),
    description: fieldEl("description").value.trim(),
  };
}

function fillForm(eventData) {
  FIELD_IDS.forEach((name) => {
    const field = fieldEl(name);
    if (field) field.value = eventData[name] != null ? eventData[name] : "";
  });
}

function resetForm() {
  FIELD_IDS.forEach((name) => {
    const field = fieldEl(name);
    if (field) field.value = "";
  });
  clearErrors();
}

export function openEventForm(mode, eventData) {
  currentMode = mode;
  currentEventId = eventData ? eventData.id : null;
  const { panelOverlay, panel, heading, subheading, submitBtn } = els();

  resetForm();

  if (mode === "edit" && eventData) {
    fillForm(eventData);
    heading.textContent = "Edit event";
    subheading.textContent = `Updating "${eventData.title}"`;
    submitBtn.textContent = "Save changes";
  } else {
    heading.textContent = "Add a new event";
    subheading.textContent = "Fill in the details below to list a new event.";
    submitBtn.textContent = "Create event";
  }

  panelOverlay.classList.add("is-open");
  panelOverlay.setAttribute("aria-hidden", "false");
  panel.classList.add("is-open");
  fieldEl("title").focus();
  document.addEventListener("keydown", handleEscape);
}

export function closeEventForm() {
  const { panelOverlay, panel } = els();
  panelOverlay.classList.remove("is-open");
  panelOverlay.setAttribute("aria-hidden", "true");
  panel.classList.remove("is-open");
  document.removeEventListener("keydown", handleEscape);
}

function handleEscape(e) {
  if (e.key === "Escape") closeEventForm();
}

function handleSubmit(e) {
  e.preventDefault();
  const data = readForm();
  const errors = validateEventForm(data);

  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }

  const payload = {
    title: data.title,
    category: data.category,
    date: data.date,
    time: data.time,
    venue: data.venue,
    maxAttendees: Number(data.maxAttendees),
    imageUrl:
     data.imageUrl,
    description: data.description,
  };

  if (currentMode === "edit" && currentEventId != null) {
    const updated = crud.editEvent(currentEventId, payload);
    if (updated) {
      showToast(`"${updated.title}" was updated.`, "success");
    } else {
      showToast("Couldn't update that event. Try again.", "error");
    }
  } else {
    const created = crud.addEvent(payload);
    if (created) {
      showToast(`"${created.title}" was added.`, "success");
    } else {
      showToast("Couldn't create that event. Try again.", "error");
    }
  }

  closeEventForm();
}

export function init() {
  const { form, cancelBtn, closeBtn, panelOverlay } = els();
  if (!form) return;
  form.addEventListener("submit", handleSubmit);
  cancelBtn.addEventListener("click", closeEventForm);
  closeBtn.addEventListener("click", closeEventForm);
  panelOverlay.addEventListener("click", (e) => {
    if (e.target === panelOverlay) closeEventForm();
  });
}
