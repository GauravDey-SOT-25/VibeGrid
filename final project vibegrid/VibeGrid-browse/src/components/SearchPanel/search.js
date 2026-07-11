import { getAllEvents } from '../../services/eventsService.js';

const filterContainer = document.getElementById("filter-container");
const eventsContainer = document.getElementById("events-container");
export let events = [];
let filteredEvents = [];
let visibleCount = 10;

export async function loadEvents() {
  try {
    events = getAllEvents();
    filteredEvents = [...events];

    populateCategories();

    initialLoad();
  } catch (error) {
    console.error(error);
  }
}

function populateCategories() {
  const categories = [...new Set(events.map((event) => event.category))];

  categories.sort();

  categories.forEach((category) => {
    const option = document.createElement("option");

    option.value = category;

    option.textContent = category;

    categoryFilter.appendChild(option);
  });
}
filterContainer.innerHTML = `

<div class="filter-wrapper">

<div class="top-search">

<input
type="text"
id="searchInput"
placeholder="🔍 Search events, workshops, hackathons..."
>

<button id="searchBtn">
Search
</button>

</div>

<div class="filters">

<div class="filter-box">

<label>Search</label>

<input
id="searchField"
placeholder="Search events..."
>

</div>

<div class="filter-box">

<label>Category</label>

<select id="categoryFilter">

<option value="">All Categories</option>

</select>

</div>

<div class="filter-box">

<label>Date</label>

<input
type="date"
id="dateFilter"
>
</div>

<div class="filter-box">

<label>Location</label>

<input
id="locationFilter"
placeholder="Search location..."
>

</div>

<button
class="filter-btn"
id="applyFilter">

Filters

</button>

<button
class="reset-btn"
id="resetBtn">

Reset

</button>

</div>

<div class="sort-wrapper">

<span>Sort by :</span>

<select id="sortFilter">

<option value="newest">Newest First</option>
<option value="oldest">Oldest First</option>
<option value="az">A - Z</option>
<option value="za">Z - A</option>

</select>

</div>

</div>

`;

const searchInput = document.getElementById("searchInput");
const searchField = document.getElementById("searchField");
const categoryFilter = document.getElementById("categoryFilter");
const dateFilter = document.getElementById("dateFilter");
const locationFilter = document.getElementById("locationFilter");
const sortFilter = document.getElementById("sortFilter");

const applyBtn = document.getElementById("applyFilter");
const resetBtn = document.getElementById("resetBtn");

// ==========================
// APPLY FILTERS
// ==========================

function applyFilters() {
  const search =
    searchInput.value.toLowerCase().trim() ||
    searchField.value.toLowerCase().trim();

  const category = categoryFilter.value;

  const date = dateFilter.value;

  const location = locationFilter.value.toLowerCase().trim();

  filteredEvents = events.filter((event) => {
    const matchSearch =
      search === "" ||
      event.title.toLowerCase().includes(search) ||
      event.description.toLowerCase().includes(search);

    const matchCategory = category === "" || event.category === category;

    const matchDate = date === "" || event.date === date;

    const matchLocation =
      location === "" || event.venue.toLowerCase().includes(location);

    return matchSearch && matchCategory && matchDate && matchLocation;
  });

  visibleCount = 10;
  sortEvents();
}

// ==========================
// SORT EVENTS
// ==========================

function sortEvents() {
  const value = sortFilter.value;

  if (value === "newest") {
    filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (value === "oldest") {
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (value === "az") {
    filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
  } else if (value === "za") {
    filteredEvents.sort((a, b) => b.title.localeCompare(a.title));
  }

  renderEvents(filteredEvents);
}

// ==========================
// RESET
// ==========================

function resetFilters() {
  searchInput.value = "";
  searchField.value = "";

  categoryFilter.selectedIndex = 0;

  dateFilter.value = "";

  locationFilter.value = "";

  sortFilter.value = "newest";

  filteredEvents = [...events];

  visibleCount = 10;
  sortEvents();
}

// ==========================
// EVENT LISTENERS
// ==========================

applyBtn.addEventListener("click", applyFilters);

resetBtn.addEventListener("click", resetFilters);

sortFilter.addEventListener("change", sortEvents);

// Live Search

searchInput.addEventListener("input", applyFilters);

searchField.addEventListener("input", applyFilters);

categoryFilter.addEventListener("change", applyFilters);

dateFilter.addEventListener("change", applyFilters);

locationFilter.addEventListener("input", applyFilters);

// Press Enter

searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    applyFilters();
  }
});

searchField.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    applyFilters();
  }
});

locationFilter.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    applyFilters();
  }
});

// ==========================
// RENDER EVENTS
// ==========================

function isRegistered(eventId) {
  try {
    const registrations = JSON.parse(localStorage.getItem("registered_event_ids") || "[]");
    return registrations.includes(eventId);
  } catch {
    return false;
  }
}

function getAttendeeCount(eventId, defaultCount) {
  try {
    const counts = JSON.parse(localStorage.getItem("event_attendee_counts") || "{}");
    return counts[eventId] !== undefined ? counts[eventId] : defaultCount;
  } catch {
    return defaultCount;
  }
}

function renderEvents(eventsList) {
  eventsContainer.innerHTML = "";

  if (eventsList.length === 0) {
    eventsContainer.innerHTML = `
            <div style="
                text-align:center;
                padding:70px 20px;
                color:#666;
                font-family:Arial;
            ">
                <h2>No Events Found</h2>
                <p>Try changing your search or filters.</p>
            </div>
        `;

    return;
  }

  // Paginated/sliced list
  const slicedEvents = eventsList.slice(0, visibleCount);

  const cards = document.createElement("div");
  cards.className = "cards";

  slicedEvents.forEach((event) => {
    const card = document.createElement("div");
    card.className = "card";

    const isUserRegistered = isRegistered(event.id);
    const currentAttendeeCount = getAttendeeCount(event.id, event.registeredCount);

    card.innerHTML = `
            <a href="#/event-details/${event.id}">
                <img src="${event.bannerImage}" alt="${event.title}" style="cursor: pointer; display: block; width: 100%; transition: opacity 0.2s;">
            </a>

            <div class="card-content">
                <span class="tag">${event.category}</span>

                <a href="#/event-details/${event.id}" style="text-decoration: none; color: inherit;">
                    <h3 style="cursor: pointer; margin-bottom: 12px; transition: color 0.2s;">${event.title}</h3>
                </a>

                <p>📅 ${formatDate(event.date)}</p>
                <p>📍 ${event.venue}</p>
                <p>👥 <span class="count-val">${currentAttendeeCount}</span> / ${event.maxAttendees} Registered</p>

                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <a href="#/event-details/${event.id}" style="
                        flex: 1;
                        padding: 10px 0;
                        text-align: center;
                        background: #f3f0eb;
                        color: #2b2b2b;
                        border-radius: var(--radius-sm);
                        font-weight: 600;
                        text-decoration: none;
                        font-size: 14px;
                        transition: background var(--transition-fast);
                    " onmouseover="this.style.background='#eae5dc'" onmouseout="this.style.background='#f3f0eb'">
                        Details
                    </a>
                    
                    <button class="card-register-btn" data-id="${event.id}" style="
                        flex: 1;
                        padding: 10px 0;
                        background: ${isUserRegistered ? 'var(--success-bg)' : 'var(--btn-primary-bg)'};
                        color: ${isUserRegistered ? 'var(--success)' : 'var(--btn-primary-text)'};
                        border: 1px solid ${isUserRegistered ? 'var(--success)' : 'var(--btn-primary-bg)'};
                        border-radius: var(--radius-sm);
                        font-weight: 600;
                        font-size: 14px;
                        cursor: ${isUserRegistered ? 'not-allowed' : 'pointer'};
                        transition: all var(--transition-fast);
                    " ${isUserRegistered ? 'disabled' : ''}>
                        ${isUserRegistered ? 'Registered ✓' : 'Register'}
                    </button>
                </div>
            </div>
        `;

    const registerBtn = card.querySelector('.card-register-btn');
    if (!isUserRegistered) {
      registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = `#/register/${event.id}`;
      });
    }

    cards.appendChild(card);
  });

  eventsContainer.appendChild(cards);

  // Load More Button UI & interaction
  if (visibleCount < eventsList.length) {
    const loadMoreWrapper = document.createElement("div");
    loadMoreWrapper.className = "load-more-wrapper";
    loadMoreWrapper.style.cssText = "text-align: center; margin-top: 40px; margin-bottom: 20px;";
    loadMoreWrapper.innerHTML = `
      <button id="loadMoreBtn" style="
          padding: 14px 36px;
          background: var(--btn-primary-bg);
          color: var(--btn-primary-text);
          border: none;
          border-radius: var(--radius-round);
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          font-size: 15px;
          transition: all var(--transition-fast);
          box-shadow: 0 4px 12px rgba(228, 61, 18, 0.15);
      " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(228, 61, 18, 0.3)'" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 12px rgba(228, 61, 18, 0.15)'">
          Load More
      </button>
    `;
    eventsContainer.appendChild(loadMoreWrapper);

    document.getElementById("loadMoreBtn").addEventListener("click", () => {
      visibleCount += 10;
      renderEvents(eventsList);
    });
  }
}

// ==========================
// FORMAT DATE
// ==========================

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    day: "numeric",

    month: "long",

    year: "numeric",
  });
}

// ==========================
// INITIAL SORT
// ==========================

function initialLoad() {
  filteredEvents = [...events];

  sortEvents();
}

export function showBrowseView() {
  events = getAllEvents();
  applyFilters();

  document.getElementById("browse-view").style.display = "block";
  document.getElementById("details-view").style.display = "none";
  document.getElementById("registration-view").style.display = "none";
  document.getElementById("my-registrations-view").style.display = "none";
  if (document.getElementById("landing-view")) {
    document.getElementById("landing-view").style.display = "none";
  }
  if (document.getElementById("login-view")) {
    document.getElementById("login-view").style.display = "none";
  }
}
