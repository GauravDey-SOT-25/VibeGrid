/**
 * formValidation.js  (ES module)
 * Owner: Ashish Anand
 * Validation rules for the Add/Edit Event form. Returns a map of field -> error message.
 * Empty map means the form is valid.
 */

export function isBlank(value) {
  return !value || String(value).trim().length === 0;
}

export function isValidUrl(value) {
  if (isBlank(value)) return true; // image URL is optional
  try {
    new URL(value);
    return true;
  } catch (e) {
    return false;
  }
}

export function isPastDate(dateStr) {
  if (isBlank(dateStr)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const picked = new Date(dateStr);
  return picked < today;
}

export function validateEventForm(data) {
  const errors = {};

  if (isBlank(data.title)) {
    errors.title = "Event title cannot be empty.";
  }

  if (isBlank(data.category)) {
    errors.category = "Please select a category.";
  }

  if (isBlank(data.date)) {
    errors.date = "Date cannot be empty.";
  } else if (isPastDate(data.date)) {
    errors.date = "Date cannot be in the past.";
  }

  if (isBlank(data.venue)) {
    errors.venue = "Venue cannot be empty.";
  }

  if (data.maxAttendees === "" || data.maxAttendees === null || data.maxAttendees === undefined) {
    errors.maxAttendees = "Maximum attendees is required.";
  } else if (Number(data.maxAttendees) < 0) {
    errors.maxAttendees = "Attendee count cannot go below zero.";
  } else if (!Number.isFinite(Number(data.maxAttendees))) {
    errors.maxAttendees = "Enter a valid number.";
  }

  if (!isValidUrl(data.imageUrl)) {
    errors.imageUrl = "Enter a valid URL, or leave this field empty.";
  }

  if (isBlank(data.description)) {
   errors.description =
      "Description cannot be empty.";
}

  return errors;
}
