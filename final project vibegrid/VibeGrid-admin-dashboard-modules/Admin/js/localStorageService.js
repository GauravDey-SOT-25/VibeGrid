/**
 * localStorageService.js  (ES module)
 * Owner: Backend Team (Ayush Singh, Eklavya Gond) — per Team Roles & Deliverables doc.
 * Included here as a lightweight mock so the Admin Dashboard is runnable end-to-end.
 * Exposes: getAllEvents, addNewEvent, updateEventDetails, removeEvent, incrementRegistration
 */

const STORAGE_KEY = "eventPlatform.events";

const SEED_EVENTS = [
  {
    id: 1,
    title: "Frontend Bootcamp",
    category: "Technology",
    date: "2026-08-20",
    time: "10:00",
    venue: "Community Hall",
    description: "Hands-on frontend workshop covering HTML, CSS and JavaScript fundamentals.",
    imageUrl: "",
    maxAttendees: 150,
    attendees: 120,
  },
  {
    id: 2,
    title: "Indie Music Night",
    category: "Music",
    date: "2026-08-22",
    time: "19:00",
    venue: "Riverside Amphitheatre",
    description: "An evening of live sets from independent artists across genres.",
    imageUrl: "",
    maxAttendees: 300,
    attendees: 85,
  },
  {
    id: 3,
    title: "Startup Founders Meetup",
    category: "Business",
    date: "2026-08-25",
    time: "17:30",
    venue: "Innovation Hub, Tower B",
    description: "Monthly meetup for early-stage founders to trade notes and find collaborators.",
    imageUrl: "",
    maxAttendees: 80,
    attendees: 40,
  },
  {
    id: 4,
    title: "Sunrise Yoga Workshop",
    category: "Health",
    date: "2026-08-27",
    time: "06:30",
    venue: "Lakeside Park, East Lawn",
    description: "A beginner-friendly outdoor yoga session focused on breathwork and mobility.",
    imageUrl: "",
    maxAttendees: 60,
    attendees: 22,
  },
  {
    id: 5,
    title: "Data Science Career Fair",
    category: "Technology",
    date: "2026-09-02",
    time: "11:00",
    venue: "Grand Convention Centre, Hall 3",
    description: "Meet recruiters and hiring teams from data-driven companies across the region.",
    imageUrl: "",
    maxAttendees: 500,
    attendees: 310,
  },
];

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_EVENTS));
    return clone(SEED_EVENTS);
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("localStorageService: corrupted data, reseeding.", e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_EVENTS));
    return clone(SEED_EVENTS);
  }
}

function writeAll(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function nextId(events) {
  return events.reduce((max, e) => Math.max(max, e.id), 0) + 1;
}

export function getAllEvents() {
  return clone(readAll());
}

export function addNewEvent(eventData) {
  const events = readAll();
  const newEvent = Object.assign({ id: nextId(events), attendees: 0 }, eventData);
  events.push(newEvent);
  writeAll(events);
  return clone(newEvent);
}

export function updateEventDetails(id, updates) {
  const events = readAll();
  const idx = events.findIndex((e) => e.id === Number(id));
  if (idx === -1) return null;
  events[idx] = Object.assign({}, events[idx], updates, { id: events[idx].id });
  writeAll(events);
  return clone(events[idx]);
}

export function removeEvent(id) {
  const events = readAll();
  const filtered = events.filter((e) => e.id !== Number(id));
  const removed = events.length !== filtered.length;
  writeAll(filtered);
  return removed;
}

export function incrementRegistration(id) {
  const events = readAll();
  const idx = events.findIndex((e) => e.id === Number(id));
  if (idx === -1) return null;
  events[idx].attendees = Math.min(
    (events[idx].attendees || 0) + 1,
    events[idx].maxAttendees || Infinity
  );
  writeAll(events);
  return clone(events[idx]);
}
