// ===== KMAC Tech — Shared UI Behaviors =====

function showToast(msg, type = "") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.className = "toast" + (type ? " toast-" + type : "");
  toast.textContent = msg;
  requestAnimationFrame(() => {
    toast.classList.add("visible");
    setTimeout(() => {
      toast.classList.remove("visible");
    }, 2500);
  });
}

function initHeaderScroll() {
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const header = document.getElementById("header");
        if (header) header.classList.toggle("scrolled", window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initSearch() {
  const searchBtns = document.querySelectorAll("[data-search-toggle]");
  if (!searchBtns.length || document.getElementById("searchOverlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "search-overlay";
  overlay.id = "searchOverlay";
  overlay.innerHTML = `
    <div class="search-box" role="search" aria-label="Search products">
      <input type="search" id="searchInput" placeholder="Search products..." aria-label="Search products" autocomplete="off">
      <div class="search-results" id="searchResults"></div>
    </div>`;
  document.body.appendChild(overlay);

  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  searchBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      overlay.classList.add("open");
      setTimeout(() => input.focus(), 100);
    }),
  );

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("open");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) {
      overlay.classList.remove("open");
    }
  });

  let debounceTimer;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) {
        results.innerHTML = "";
        return;
      }
      const matches = PRODUCTS.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.includes(q),
      );
      if (matches.length === 0) {
        results.innerHTML =
          '<div style="padding:24px;text-align:center;color:var(--text-sec)">No products found 😅</div>';
      } else {
        results.innerHTML = matches
          .map(
            (p) => `
          <a href="${pageUrl(`product.html?id=${p.id}`)}" class="search-result-item">
            <img src="${imgSrc(p.img)}" alt="${p.name}" width="48" height="48">
            <div class="result-info">
              <div class="result-name">${p.name}</div>
              <div class="result-price">${formatPrice(p.price)}</div>
            </div>
          </a>`,
          )
          .join("");
      }
    }, 200);
  });
}

function initMobileMenu() {
  const toggle = document.getElementById("mobileToggle");
  const menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", menu.classList.contains("open"));
    });
  }
}

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
}
