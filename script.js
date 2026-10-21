/**
 * Tech Hub | Interactive JavaScript Website
 * Designed for macOS Development Environment
 */

// ==========================================
// 1. DATA & STATE MANAGEMENT
// ==========================================

// Array of 6 technologies matching your HTML categories and design cards
const technologies = [
  {
    id: 1,
    name: "Artificial Intelligence",
    category: "AI",
    level: "Advanced",
    description: "Machine learning models and neural networks driving modern automated systems and intelligent apps.",
    artClass: "art-ai",
    icon: "🤖"
  },
  {
    id: 2,
    name: "Cloud Computing",
    category: "Cloud",
    level: "Intermediate",
    description: "On-demand delivery of computing services over the internet with scalable storage and serverless architecture.",
    artClass: "art-cloud",
    icon: "☁️"
  },
  {
    id: 3,
    name: "Web Development",
    category: "Web",
    level: "Beginner",
    description: "Building responsive, accessible, and high-performance user interfaces using HTML5, CSS3, and JavaScript.",
    artClass: "art-web",
    icon: "🌐"
  },
  {
    id: 4,
    name: "Cyber Security",
    category: "Security",
    level: "Advanced",
    description: "Protecting systems, networks, and sensitive data from digital cyber attacks and unauthorized intrusions.",
    artClass: "art-security",
    icon: "🔒"
  },
  {
    id: 5,
    name: "Data Analytics",
    category: "AI",
    level: "Intermediate",
    description: "Inspecting, cleaning, and modeling data to discover useful information and support business decisions.",
    artClass: "art-data",
    icon: "📊"
  },
  {
    id: 6,
    name: "Core Coding",
    category: "Web",
    level: "Beginner",
    description: "Fundamental algorithms, data structures, and programming paradigms that form the backbone of software.",
    artClass: "art-code",
    icon: "💻"
  }
];

// Application State
let currentSearchTerm = "";
let currentCategory = "All";
let showOnlyFavourites = false;

// Use a JavaScript Set to store unique favourite technology IDs securely and efficiently
const favouriteIds = new Set();

// ==========================
// 2. DOM ELEMENT REFERENCES
// ==========================
const techGrid = document.getElementById("techGrid");
const searchInput = document.getElementById("searchInput");
const resultsMessage = document.getElementById("resultsMessage");
const categoryFiltersContainer = document.getElementById("categoryFilters");
const showFavouritesBtn = document.getElementById("showFavourites");
const emptyMessage = document.getElementById("emptyMessage");

// Dashboard Stat Counters
const totalCountEl = document.getElementById("totalCount");
const favouriteCountEl = document.getElementById("favouriteCount");
const categoryCountEl = document.getElementById("categoryCount");

// Modal Elements
const detailModal = document.getElementById("detailModal");
const modalTitle = document.getElementById("modalTitle");
const modalDetails = document.getElementById("modalDetails");
const closeModalBtn = document.getElementById("closeModal");

// Joke API Elements
const jokeButton = document.getElementById("jokeButton");
const jokeSetup = document.getElementById("jokeSetup");
const jokePunchline = document.getElementById("jokePunchline");

// Toast Notification Element
const toast = document.getElementById("toast");

// ==========================================
// 3. CORE RENDERING & FILTERING LOGIC
// ==========================================

/**
 * Filter technologies based on live search input, selected category, and favourites toggle.
 */
function getFilteredTechnologies() {
  return technologies.filter((tech) => {
    // b. Case-insensitive search across name and description
    const matchesSearch =
      tech.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
      tech.description.toLowerCase().includes(currentSearchTerm.toLowerCase());

    // Category filter check ("All" or matching category)
    const matchesCategory =
      currentCategory === "All" || tech.category === currentCategory;

    // Favourites filter check
    const matchesFavourites = !showOnlyFavourites || favouriteIds.has(tech.id);

    return matchesSearch && matchesCategory && matchesFavourites;
  });
}

/**
 * Render tech cards into the DOM grid matching your index.html layout.
 */
function renderTechnologies() {
  const filtered = getFilteredTechnologies();

  // Clear current grid items
  techGrid.innerHTML = "";

  // d. Display the number of technologies matching the search criteria
  if (resultsMessage) {
    if (showOnlyFavourites) {
      resultsMessage.textContent = `Showing ${filtered.length} favourited technology/technologies`;
    } else if (currentSearchTerm !== "" || currentCategory !== "All") {
      resultsMessage.textContent = `Showing ${filtered.length} matching technology/technologies`;
    } else {
      resultsMessage.textContent = `Showing all technologies`;
    }
  }

  // c. Display appropriate message when no technologies match
  if (filtered.length === 0) {
    if (emptyMessage) emptyMessage.hidden = false;
    return;
  } else {
    if (emptyMessage) emptyMessage.hidden = true;
  }

  // Build card elements dynamically
  filtered.forEach((tech) => {
    const isFav = favouriteIds.has(tech.id);
    const card = document.createElement("div");
    card.className = "tech-card";
    card.innerHTML = `
      <div class="card-art ${tech.artClass}">
        <span>${tech.icon}</span>
      </div>
      <div class="card-content">
        <div class="card-meta">
          <span class="category-tag">${tech.category}</span>
          <span class="level-tag">${tech.level}</span>
        </div>
        <h3>${tech.name}</h3>
        <p>${tech.description}</p>
        <div class="card-bottom">
          <button class="learn-button" data-id="${tech.id}">Learn more →</button>
          <button class="favourite-button ${isFav ? "saved" : ""}" data-id="${tech.id}" aria-label="Toggle favourite">
            ${isFav ? "♥" : "♡"}
          </button>
        </div>
      </div>
    `;
    techGrid.appendChild(card);
  });

  // Re-attach event listeners to the newly created cards
  attachCardListeners();
}

/**
 * Attach click listeners to individual card buttons (Favourite & Learn More).
 */
function attachCardListeners() {
  // Favourite button listeners
  document.querySelectorAll(".favourite-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.getAttribute("data-id"), 10);
      toggleFavourite(id);
    });
  });

  // Learn more button listeners
  document.querySelectorAll(".learn-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.getAttribute("data-id"), 10);
      openModal(id);
    });
  });
}

// ==========================================
// 4. QUESTION IMPLEMENTATIONS
// ==========================================

/* --- Question 1: Live Search Functionality --- */
if (searchInput) {
  // a. Event listener responding when user enters text
  searchInput.addEventListener("input", (e) => {
    // b. Retrieve and trim input for case-insensitive processing
    currentSearchTerm = e.target.value.trim();
    renderTechnologies();
  });
}

/* --- Question 2: Category Filtering Functionality --- */
if (categoryFiltersContainer) {
  categoryFiltersContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      // a. Extract category value
      currentCategory = e.target.getAttribute("data-category") || "All";

      // b. Indicate currently selected category using active visual style
      const buttons = categoryFiltersContainer.querySelectorAll(".filter-button");
      buttons.forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      // c. Ensure category filtering works together with live search
      renderTechnologies();
    }
  });
}

/* --- Question 3: Favourites Functionality --- */
/**
 * Toggle favourite status for a technology ID.
 */
function toggleFavourite(techId) {
  // e. Use a JavaScript Set to store favourite identifiers
  if (favouriteIds.has(techId)) {
    // b. Remove from favourites
    favouriteIds.delete(techId);
    showToast("Removed from your collection");
  } else {
    // a. Add to favourites
    favouriteIds.add(techId);
    showToast("Added to your collection!");
  }

  // d. Update favourites counter and dashboard stats
  updateDashboardStats();
  renderTechnologies();
}

// c. Favourites filter button listener
if (showFavouritesBtn) {
  showFavouritesBtn.addEventListener("click", () => {
    showOnlyFavourites = !showOnlyFavourites;
    showFavouritesBtn.classList.toggle("active", showOnlyFavourites);
    showFavouritesBtn.textContent = showOnlyFavourites
      ? "♥ Show all technologies"
      : "♥ Show favourites";
    renderTechnologies();
  });
}

/**
 * Show temporary toast message helper.
 */
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* --- Question 4: Dynamic Dashboard Statistics --- */
function updateDashboardStats() {
  // a. Total number of technologies from available data
  if (totalCountEl) {
    totalCountEl.textContent = String(technologies.length).padStart(2, "0");
  }

  // b. Total number of favourited technologies
  if (favouriteCountEl) {
    favouriteCountEl.textContent = String(favouriteIds.size).padStart(2, "0");
  }

  // c. Number of distinct technology categories
  if (categoryCountEl) {
    const distinctCategories = new Set(technologies.map((t) => t.category));
    categoryCountEl.textContent = String(distinctCategories.size).padStart(2, "0");
  }
}

/* --- Question 5: Learn More Modal Functionality --- */
/**
 * Open detail modal for the selected technology.
 */
function openModal(techId) {
  // d. Handle invalid or missing technology identifier appropriately
  if (!techId || isNaN(techId)) {
    alert("Error: Invalid technology identifier.");
    return;
  }

  // a. Identify selected technology object using its unique identifier
  const tech = technologies.find((item) => item.id === techId);

  if (!tech) {
    alert("Error: Technology details not found.");
    return;
  }

  // b. Display selected technology details in modal
  if (modalTitle) modalTitle.textContent = tech.name;
  if (modalDetails) {
    modalDetails.textContent = `${tech.description} Category: ${tech.category}. Proficiency Level: ${tech.level}.`;
  }

  if (detailModal) {
    detailModal.hidden = false;
  }
}

/**
 * c. Working control that closes the modal
 */
function closeModalWindow() {
  if (detailModal) {
    detailModal.hidden = true;
  }
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModalWindow);
}

// Close modal when clicking outside the modal box
if (detailModal) {
  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) {
      closeModalWindow();
    }
  });
}

/* --- Question 6: Asynchronous Programming (Joke API) --- */
const JOKE_API_URL = "https://official-joke-api.appspot.com/random_joke";

/**
 * Fetch a random programming joke using async/await and fetch().
 */
async function fetchJoke() {
  // a. Display loading state on button
  if (jokeButton) {
    jokeButton.disabled = true;
    jokeButton.textContent = "Loading joke...";
  }

  if (jokeSetup) jokeSetup.textContent = "Fetching a fresh programming joke...";
  if (jokePunchline) jokePunchline.textContent = "";

  try {
    // b. Use fetch() with async and await
    const response = await fetch(JOKE_API_URL);

    // c. Check whether HTTP response was successful and convert to JSON
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jokeData = await response.json();

    // d. Display setup and punchline in website section
    if (jokeSetup) jokeSetup.textContent = jokeData.setup;
    if (jokePunchline) jokePunchline.textContent = jokeData.punchline;

  } catch (error) {
    // e. Use try...catch to handle errors and show user-friendly message
    console.error("Joke fetch failed:", error);
    if (jokeSetup) jokeSetup.textContent = "Oops! Could not load a joke at this time.";
    if (jokePunchline) jokePunchline.textContent = "Please check your network connection and try again.";
  } finally {
    // f. Use finally to restore button to normal state
    if (jokeButton) {
      jokeButton.disabled = false;
      jokeButton.textContent = "Get a programming joke →";
    }
  }
}

if (jokeButton) {
  jokeButton.addEventListener("click", fetchJoke);
}

// ==========================================
// 5. INITIALIZATION ON PAGE LOAD
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  renderTechnologies();
  updateDashboardStats();
});