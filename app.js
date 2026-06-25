// Shared App Logic for Discrete Mathematics Portal

document.addEventListener("DOMContentLoaded", () => {
  initSearch();
  initMathRendering();
  initAccordions();
  initActiveLinks();
});

// 2. Question Search & Categorization Filter
function initSearch() {
  const searchBar = document.getElementById("search-bar");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".question-card");
  
  if (!searchBar && filterBtns.length === 0) return;

  let activeFilter = "all";
  let searchQuery = "";

  function applyFilters() {
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const tags = (card.getAttribute("data-tags") || "").toLowerCase().split(",");
      
      const matchesSearch = text.includes(searchQuery);
      const matchesFilter = activeFilter === "all" || tags.includes(activeFilter);
      
      if (matchesSearch && matchesFilter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  if (searchBar) {
    searchBar.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase();
      applyFilters();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.getAttribute("data-filter");
      applyFilters();
    });
  });
}

// 3. Dynamic KaTeX Typesetting Initialization
function initMathRendering() {
  if (typeof renderMathInElement === "function") {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false
    });
  }
}

// 4. Accordion Toggle
function initAccordions() {
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      header.classList.toggle("active");
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

// 5. Sticky Navigation Link Highlight
function initActiveLinks() {
  const sections = document.querySelectorAll(".section-block");
  const navItems = document.querySelectorAll(".sidebar-menu-item a");
  
  if (sections.length === 0 || navItems.length === 0) return;

  window.addEventListener("scroll", () => {
    let currentId = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 120) {
        currentId = section.getAttribute("id");
      }
    });

    navItems.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${currentId}`) {
        item.classList.add("active");
      }
    });
  });
}
