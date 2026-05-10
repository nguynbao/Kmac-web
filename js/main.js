/* ===== KMAC Tech — Main JS v2.0 ===== */
/* Q1 Upgrade: Search, coupon fix, deduplicated utilities, a11y */

// ===== Global Data Store =====
let PRODUCTS = [];
let CATEGORIES = [];

// ===== Path Helpers =====
// The home page lives at root while inner pages live in /pages.
const IS_PAGES_PAGE = window.location.pathname.includes('/pages/');
function pageUrl(path) {
  return IS_PAGES_PAGE ? path : 'pages/' + path;
}
function assetUrl(path) {
  if (/^(https?:|data:|\/)/.test(path)) return path;
  return IS_PAGES_PAGE ? '../' + path : path;
}

// ===== Shared Color Hex Map (deduplicated from product.js + shop.js) =====
const COLOR_HEX_MAP = {
  'Clear':'#E0E7FF','Blue':'#0A84FF','Pink':'#FF6B9D','Gray':'#9CA3AF',
  'Navy':'#1E3A5F','Black':'#1A1A2E','Dark Blue':'#1E3A5F','White':'#F8FAFC',
  'White/Blue':'#E8F4FF','Black/Red':'#1A1A2E','Pink/White':'#FFE4EC',
  'Sky Blue':'#87CEEB','Lavender':'#C4B5FD','Mint':'#6EE7B7',
  'Space Gray':'#6B7280','Silver':'#CBD5E1'
};
function getColorHex(name) { return COLOR_HEX_MAP[name] || '#CBD5E1'; }

// ===== Image Helper — WebP with PNG fallback =====
function imgSrc(basePath) {
  if (/^(https?:|data:|\/)/.test(basePath)) return basePath;
  return assetUrl(basePath + '.webp');
}
function imgPicture(basePath, alt, cls = '', lazy = true) {
  const loadAttr = lazy ? 'loading="lazy"' : '';
  if (/^(https?:|data:|\/)/.test(basePath)) {
    return `<img src="${basePath}" alt="${alt}" ${cls ? 'class="' + cls + '"' : ''} ${loadAttr} width="400" height="400">`;
  }
  return `<picture>
    <source srcset="${assetUrl(basePath + '.webp')}" type="image/webp">
    <img src="${assetUrl(basePath + '.png')}" alt="${alt}" ${cls ? 'class="' + cls + '"' : ''} ${loadAttr} width="400" height="400">
  </picture>`;
}

// ===== Cart Management =====
function getCart() {
  return JSON.parse(localStorage.getItem('kmac_cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('kmac_cart', JSON.stringify(cart));
  updateCartCount();
}
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) { existing.qty += qty; }
  else { cart.push({ id: productId, qty }); }
  saveCart(cart);
  showToast('Added to cart! 🛒', 'success');
}
function removeFromCart(productId) {
  saveCart(getCart().filter(i => i.id !== productId));
}
function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) { item.qty = Math.max(1, qty); }
  saveCart(cart);
}
function getCartTotal() {
  return getCart().reduce((sum, item) => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}
function updateCartCount() {
  const count = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => { el.textContent = count; });
}

// ===== Coupon System (FIXED — actually applies discount) =====
const COUPONS = {
  'KMAC10': { type: 'percent', value: 10, label: '10% off' },
  'WELCOME5': { type: 'fixed', value: 5, label: '$5 off' },
};
function getAppliedCoupon() {
  return JSON.parse(localStorage.getItem('kmac_coupon') || 'null');
}
function applyCouponCode(code) {
  const coupon = COUPONS[code.toUpperCase()];
  if (coupon) {
    localStorage.setItem('kmac_coupon', JSON.stringify({ code: code.toUpperCase(), ...coupon }));
    showToast(`Coupon applied! ${coupon.label} 🎉`, 'success');
    return true;
  }
  showToast('Invalid coupon code 😕', 'error');
  return false;
}
function removeCoupon() {
  localStorage.removeItem('kmac_coupon');
}
function getDiscountedTotal() {
  const subtotal = getCartTotal();
  const coupon = getAppliedCoupon();
  if (!coupon) return { subtotal, discount: 0, total: subtotal, coupon: null };
  let discount = 0;
  if (coupon.type === 'percent') discount = subtotal * (coupon.value / 100);
  else if (coupon.type === 'fixed') discount = Math.min(coupon.value, subtotal);
  return { subtotal, discount, total: subtotal - discount, coupon };
}

// ===== Toast Notification (upgraded) =====
function showToast(msg, type = '') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.className = 'toast' + (type ? ' toast-' + type : '');
  toast.textContent = msg;
  requestAnimationFrame(() => {
    toast.classList.add('visible');
    setTimeout(() => { toast.classList.remove('visible'); }, 2500);
  });
}

// ===== Header Scroll Effect =====
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const header = document.getElementById('header');
      if (header) header.classList.toggle('scrolled', window.scrollY > 20);
      ticking = false;
    });
    ticking = true;
  }
});

// ===== Search Functionality =====
function initSearch() {
  const searchBtns = document.querySelectorAll('[data-search-toggle]');
  if (!searchBtns.length) return;

  // Create search overlay
  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.id = 'searchOverlay';
  overlay.innerHTML = `
    <div class="search-box" role="search" aria-label="Search products">
      <input type="search" id="searchInput" placeholder="Search products..." aria-label="Search products" autocomplete="off">
      <div class="search-results" id="searchResults"></div>
    </div>`;
  document.body.appendChild(overlay);

  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  // Toggle search
  searchBtns.forEach(btn => btn.addEventListener('click', () => {
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 100);
  }));

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      overlay.classList.remove('open');
    }
  });

  // Search as you type
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { results.innerHTML = ''; return; }
      const matches = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.includes(q)
      );
      if (matches.length === 0) {
        results.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-sec)">No products found 😅</div>';
      } else {
        results.innerHTML = matches.map(p => `
          <a href="${pageUrl(`product.html?id=${p.id}`)}" class="search-result-item">
            <img src="${imgSrc(p.img)}" alt="${p.name}" width="48" height="48">
            <div class="result-info">
              <div class="result-name">${p.name}</div>
              <div class="result-price">$${p.price.toFixed(2)}</div>
            </div>
          </a>`).join('');
      }
    }, 200);
  });
}

// ===== Mobile Menu =====
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', menu.classList.contains('open'));
    });
  }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Map API data from server (fallback to mock data if error/empty)
  try {
    if (typeof categoryApi !== 'undefined') {
      const resCat = await categoryApi.getCategories();
      const serverCategories = resCat.data || resCat;
      if (serverCategories && Array.isArray(serverCategories)) {
        CATEGORIES = serverCategories;
      }
    }

    if (typeof productApi !== 'undefined') {
      const res = await productApi.getProducts();
      // Backend KMAC trả về format { success: true, data: [...] }
      const serverProducts = res.data || res;
      if (serverProducts && Array.isArray(serverProducts) && serverProducts.length > 0) {
        PRODUCTS = serverProducts.map(p => ({
          ...p,
          // Ánh xạ các trường từ API về chuẩn Frontend cũ nếu khác tên
          id: p._id || p.id,
          name: typeof p.name === 'object' ? (p.name.vn || p.name.en || '') : (p.name || ''),
          price: p.price || p.regularPrice || p.salePrice || 0,
          oldPrice: p.oldPrice || null,
          img: p.images && p.images.length > 0 && p.images[0].url ? p.images[0].url : 'assets/product-macbook-case',
          // Backend trả về categoryId là object hoặc string, ánh xạ sang slug để filter
          category: p.categoryId && p.categoryId.slug ? p.categoryId.slug : p.categoryId || 'cases',
          colors: p.colors || [],
          sizes: p.sizes || []
        }));
      }
    }
  } catch (err) {
    console.error("Lỗi tải API Products, sử dụng dữ liệu mẫu:", err);
  }

  // 2. Dispatch custom event để báo cho các file khác biết Data đã sẵn sàng
  window.dispatchEvent(new Event('KmacDataLoaded'));

  // 3. Khởi tạo các UI cơ bản
  updateCartCount();
  initMobileMenu();
  initSearch();
  initScrollAnimations();
});

// ===== Render Helpers =====
function renderStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function renderProductCard(p) {
  let badgeHTML = '';
  if (p.badge === 'best') badgeHTML = '<span class="badge badge-best">Best Seller</span>';
  else if (p.badge === 'new') badgeHTML = '<span class="badge badge-new">New</span>';
  else if (p.badge === 'sale') badgeHTML = '<span class="badge badge-sale">-' + Math.round((1 - p.price / p.oldPrice) * 100) + '%</span>';

  const priceHTML = p.oldPrice
    ? `$${p.price.toFixed(2)} <span class="old-price">$${p.oldPrice.toFixed(2)}</span>`
    : `$${p.price.toFixed(2)}`;

  return `<a href="${pageUrl(`product.html?id=${p.id}`)}" class="product-card">
    <div class="product-img">
      ${badgeHTML ? '<div class="product-badges">' + badgeHTML + '</div>' : ''}
      ${imgPicture(p.img, p.name)}
    </div>
    <div class="product-info">
      <div class="product-rating"><span class="stars">${renderStars(p.rating)}</span> (${p.reviews})</div>
      <h3 class="product-name">${p.name}</h3>
      <div class="product-price">${priceHTML}</div>
      <div class="product-actions"><button class="btn btn-cart" onclick="event.preventDefault();addToCart(${p.id})">Add to Cart</button></div>
    </div>
  </a>`;
}

// ===== US States (complete list for checkout) =====
const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming','District of Columbia'
];
