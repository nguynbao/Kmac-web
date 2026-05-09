/* ===== KMAC Tech — Main JS v2.0 ===== */
/* Q1 Upgrade: Search, coupon fix, deduplicated utilities, a11y */

// ===== Product Data Store =====
const PRODUCTS = [
  { id:1, name:'MacBook Pro 14" Crystal Clear Case', price:29.99, oldPrice:null, img:'assets/product-macbook-case', category:'cases', badge:'best', rating:5, reviews:128, colors:['Clear','Blue','Pink'], sizes:['MacBook Air 13"','MacBook Pro 14"','MacBook Pro 16"'] },
  { id:2, name:'Premium Laptop Sleeve — Minimalist Gray', price:39.99, oldPrice:null, img:'assets/product-laptop-sleeve', category:'sleeves', badge:'new', rating:5, reviews:86, colors:['Gray','Navy','Black'], sizes:['13"','14"','15.6"','16"'] },
  { id:3, name:'XL RGB Gaming Mousepad — Dark Blue', price:24.99, oldPrice:null, img:'assets/product-gaming-mousepad', category:'gaming', badge:'best', rating:4, reviews:214, colors:['Dark Blue','Black','White'], sizes:['Medium','Large','XL'] },
  { id:4, name:'65W USB-C GaN Fast Charger — Compact', price:34.99, oldPrice:null, img:'assets/product-charger', category:'chargers', badge:null, rating:5, reviews:72, colors:['White','Black'], sizes:[] },
  { id:5, name:'Wireless Mechanical Keyboard — White & Blue', price:49.99, oldPrice:62.99, img:'assets/product-keyboard', category:'gaming', badge:'sale', rating:5, reviews:156, colors:['White/Blue','Black/Red','Pink/White'], sizes:[] },
  { id:6, name:'MacBook Air 13" Matte Pastel Case — Sky Blue', price:24.99, oldPrice:null, img:'assets/product-macbook-case', category:'cases', badge:null, rating:4, reviews:93, colors:['Sky Blue','Lavender','Mint','Pink'], sizes:['MacBook Air 13"','MacBook Air 15"'] },
  { id:7, name:'USB-C Hub 7-in-1 — Space Gray', price:44.99, oldPrice:54.99, img:'assets/product-charger', category:'chargers', badge:'sale', rating:5, reviews:167, colors:['Space Gray','Silver'], sizes:[] },
  { id:8, name:'Laptop Stand — Aluminum Adjustable', price:39.99, oldPrice:null, img:'assets/product-keyboard', category:'gaming', badge:'new', rating:4, reviews:58, colors:['Silver','Black'], sizes:[] },
];

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
  // basePath = 'assets/product-keyboard' (no extension)
  return basePath + '.webp';
}
function imgPicture(basePath, alt, cls = '', lazy = true) {
  const loadAttr = lazy ? 'loading="lazy"' : '';
  return `<picture>
    <source srcset="${basePath}.webp" type="image/webp">
    <img src="${basePath}.png" alt="${alt}" ${cls ? 'class="' + cls + '"' : ''} ${loadAttr} width="400" height="400">
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
          <a href="product.html?id=${p.id}" class="search-result-item">
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
document.addEventListener('DOMContentLoaded', () => {
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

  return `<a href="product.html?id=${p.id}" class="product-card">
    <div class="product-img">
      ${badgeHTML ? '<div class="product-badges">' + badgeHTML + '</div>' : ''}
      <picture>
        <source srcset="${p.img}.webp" type="image/webp">
        <img src="${p.img}.png" alt="${p.name}" loading="lazy" width="400" height="400">
      </picture>
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
