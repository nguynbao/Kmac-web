// ===== KMAC Tech — Web Components =====
// Sử dụng Custom Elements để tách Header và Footer thành các component dùng chung

class KmacHeader extends HTMLElement {
  connectedCallback() {
    const isPages = window.location.pathname.includes('/pages/');
    const currentPath = window.location.pathname;
    
    // Xử lý đường dẫn tương đối
    const homeUrl = isPages ? '../index.html' : 'index.html';
    const shopUrl = isPages ? 'shop.html' : 'pages/shop.html';
    const blogUrl = isPages ? 'blog.html' : 'pages/blog.html';
    const cartUrl = isPages ? 'cart.html' : 'pages/cart.html';
    
    // Kiểm tra active link
    const isHome = currentPath.endsWith('/') || currentPath.endsWith('index.html');
    const isShop = currentPath.includes('shop.html') || currentPath.includes('product.html');
    const isBlog = currentPath.includes('blog.html');
    const isCart = currentPath.includes('cart.html') || currentPath.includes('checkout.html');

    this.innerHTML = `
      <header class="header" id="header" role="banner">
        <div class="container flex-between">
          <a href="${homeUrl}" class="logo" aria-label="KMAC Tech — Home">KMAC<span>Tech</span></a>
          <nav class="nav-links" id="navLinks" aria-label="Main navigation">
            <a href="${homeUrl}" class="${isHome ? 'active' : ''}" data-i18n="nav.home">Home</a>
            <a href="${shopUrl}" class="${isShop ? 'active' : ''}" data-i18n="nav.shop">Shop</a>
            <a href="${blogUrl}" class="${isBlog ? 'active' : ''}" data-i18n="nav.blog">Blog</a>
            <a href="${cartUrl}" class="${isCart ? 'active' : ''}" data-i18n="nav.cart">Cart</a>
          </nav>
          <div class="header-actions">
            <div class="lang-switcher" aria-label="Language Switcher">
              <button class="lang-btn active" data-lang="en" onclick="switchLang('en')" aria-label="Switch to English">🇺🇸 EN</button>
              <button class="lang-btn" data-lang="vn" onclick="switchLang('vn')" aria-label="Switch to Vietnamese">🇻🇳 VN</button>
            </div>
            <button class="btn-icon" data-search-toggle aria-label="Search products">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <a href="${cartUrl}" class="btn-icon" aria-label="Shopping cart">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span class="cart-count" aria-label="Cart items">0</span>
            </a>
            <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
      <div class="mobile-menu" id="mobileMenu" role="navigation" aria-label="Mobile navigation">
        <a href="${homeUrl}" class="${isHome ? 'active' : ''}">🏠 Home</a>
        <a href="${shopUrl}" class="${isShop ? 'active' : ''}">🛍️ Shop</a>
        <a href="${blogUrl}" class="${isBlog ? 'active' : ''}">📝 Blog</a>
        <a href="${cartUrl}" class="${isCart ? 'active' : ''}">🛒 Cart</a>
      </div>
    `;

    // Gọi lại các hàm khởi tạo từ main.js sau khi render UI
    setTimeout(() => {
      if (typeof initMobileMenu === 'function') initMobileMenu();
      if (typeof initSearch === 'function') initSearch();
      if (typeof updateCartCount === 'function') updateCartCount();
      if (typeof initI18n === 'function') initI18n(); // nếu có i18n
    }, 0);
  }
}

class KmacFooter extends HTMLElement {
  connectedCallback() {
    const isPages = window.location.pathname.includes('/pages/');
    const shopUrl = isPages ? 'shop.html' : 'pages/shop.html';

    this.innerHTML = `
      <footer class="footer" role="contentinfo">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="logo">KMAC<span class="footer-logo-white">Tech</span></div>
              <p data-i18n="footer.desc">Premium tech accessories designed with love for your MacBook and gaming setup. Based in the US, shipping nationwide. 🇺🇸</p>
            </div>
            <div>
              <h4>Shop</h4>
              <div class="footer-links">
                <a href="${shopUrl}">All Products</a>
                <a href="${shopUrl}?cat=cases">MacBook Cases</a>
                <a href="${shopUrl}?cat=sleeves">Sleeves & Bags</a>
                <a href="${shopUrl}?cat=gaming">Gaming Gear</a>
              </div>
            </div>
            <div>
              <h4>Help</h4>
              <div class="footer-links">
                <a href="#">Contact Us</a>
                <a href="#">Shipping Policy</a>
                <a href="#">Returns & Refunds</a>
                <a href="#">FAQ</a>
              </div>
            </div>
            <div>
              <h4>Follow Us</h4>
              <div class="footer-links">
                <a href="#" aria-label="Follow us on Instagram">Instagram</a>
                <a href="#" aria-label="Follow us on TikTok">TikTok</a>
                <a href="#" aria-label="Follow us on Twitter">Twitter / X</a>
                <a href="#" aria-label="Follow us on YouTube">YouTube</a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <span data-i18n="footer.copy">© 2026 KMAC Tech. All rights reserved.</span>
            <div class="payment-icons" aria-label="Accepted payment methods">
              <span>Visa</span><span>Mastercard</span><span>PayPal</span><span>Apple Pay</span>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

// Đăng ký component
customElements.define('kmac-header', KmacHeader);
customElements.define('kmac-footer', KmacFooter);
